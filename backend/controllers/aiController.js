import { GoogleGenAI } from "@google/genai";
import serviceModel from "../models/serviceModel.js";
import bookingModel from "../models/bookingModel.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatWithAI = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    // Check message
    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required.",
      });
    }

    // Get services from MongoDB
    const services = await serviceModel
      .find()
      .select("name description price category");

    const serviceInfo = services
      .map(
        (service) =>
          `Name: ${service.name} | Price: ${service.price} | Category: ${service.category} | Description: ${service.description}`
      )
      .join("\n");

    // Keep recent chat history only
    const safeHistory = Array.isArray(history)
      ? history.slice(-10).map((item) => ({
          role: item.role === "assistant" ? "Assistant" : "User",
          content: String(item.content || "").slice(0, 1000),
        }))
      : [];

    const conversation = safeHistory
      .map((item) => `${item.role}: ${item.content}`)
      .join("\n");

    const prompt = `
You are ServiceHub AI, a friendly service booking assistant.

Available ServiceHub services:
${serviceInfo}

Conversation:
${conversation}

Latest user message:
${message.trim()}

IMPORTANT RULES:

1. Understand spelling mistakes.
2. Ignore uppercase/lowercase differences.
3. Understand simple English and Roman Urdu.
4. Do not require exact service names.
5. Match the user's intention with the closest available service.
6. Never invent a service or price.
7. Only use services from the available services list.
8. For a booking, collect these four details:
   - serviceName
   - date
   - time
   - address
9. If any booking detail is missing, ask for the missing detail.
10. When all four details are available, show the complete booking details and ask the user to confirm.
11. DO NOT mark bookingConfirmed as true until the user explicitly confirms.
12. "yes", "yes I confirm", "confirm", "book it", "go ahead" can be treated as confirmation when the previous assistant message asked for confirmation.
13. If the user has NOT confirmed, bookingConfirmed must be false.
14. After the user confirms, bookingConfirmed must be true.
15. Never tell the user that a booking is confirmed unless bookingConfirmed is true.
16. Keep the reply short, friendly and natural.

Return JSON only.
`;

    // =====================================================
    // GEMINI REQUEST WITH RETRY
    // =====================================================
    const generateAIResponse = async () => {
      return await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash-lite",
        contents: prompt,

        config: {
          responseMimeType: "application/json",

          responseSchema: {
            type: "object",
            properties: {
              reply: {
                type: "string",
              },
              action: {
                type: "string",
                enum: ["chat", "booking"],
              },
              serviceName: {
                type: "string",
              },
              date: {
                type: "string",
              },
              time: {
                type: "string",
              },
              address: {
                type: "string",
              },
              bookingConfirmed: {
                type: "boolean",
              },
            },
            required: [
              "reply",
              "action",
              "serviceName",
              "date",
              "time",
              "address",
              "bookingConfirmed",
            ],
          },
        },
      });
    };

    let response;

    // =====================================================
    // FIRST ATTEMPT
    // =====================================================
    try {
      response = await generateAIResponse();
    } catch (error) {
      console.error("First AI attempt failed:", {
        message: error?.message,
        status: error?.status,
        code: error?.code,
        details: error?.details,
      });

      // =====================================================
      // RETRY FOR TEMPORARY 503 / 429 ERRORS
      // =====================================================
      const status = error?.status || error?.code;

      if (status === 503 || status === 429) {
        console.log("Retrying Gemini request after temporary error...");

        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
          response = await generateAIResponse();
        } catch (retryError) {
          console.error("Second AI attempt failed:", {
            message: retryError?.message,
            status: retryError?.status,
            code: retryError?.code,
            details: retryError?.details,
          });

          const retryStatus =
            retryError?.status || retryError?.code;

          if (retryStatus === 503) {
            return res.status(503).json({
              success: false,
              message:
                "AI service is temporarily unavailable. Please try again in a moment.",
            });
          }

          if (retryStatus === 429) {
            return res.status(429).json({
              success: false,
              message:
                "AI service limit has been reached. Please try again later.",
            });
          }

          return next(retryError);
        }
      } else {
        return next(error);
      }
    }

    // =====================================================
    // PARSE AI RESPONSE
    // =====================================================
    let result;

    try {
      result = JSON.parse(response.text);
    } catch (error) {
      console.error("AI JSON Parse Error:", error);

      return res.status(500).json({
        success: false,
        message: "AI returned an invalid response.",
      });
    }

    // =====================================================
    // NORMAL CHAT
    // =====================================================
    if (result.action !== "booking") {
      return res.json({
        success: true,
        reply: result.reply,
        bookingCreated: false,
      });
    }

    // =====================================================
    // GET BOOKING DETAILS
    // =====================================================
    const serviceName = result.serviceName?.trim();
    const date = result.date?.trim();
    const time = result.time?.trim();
    const address = result.address?.trim();

    // =====================================================
    // MISSING BOOKING DETAILS
    // =====================================================
    if (!serviceName || !date || !time || !address) {
      return res.json({
        success: true,
        reply: result.reply,
        bookingCreated: false,
      });
    }

    // =====================================================
    // USER HAS NOT CONFIRMED
    // =====================================================
    if (!result.bookingConfirmed) {
      return res.json({
        success: true,
        reply: result.reply,
        bookingCreated: false,
      });
    }

    // =====================================================
    // FIND REAL SERVICE
    // =====================================================
    const normalizedServiceName = serviceName.toLowerCase();

    const service = services.find(
      (item) =>
        item.name.toLowerCase() === normalizedServiceName
    );

    if (!service) {
      return res.json({
        success: true,
        reply:
          "I couldn't find that service in our available services. Please choose one of the available services.",
        bookingCreated: false,
      });
    }

    // =====================================================
    // CREATE ACTUAL BOOKING
    // =====================================================
    const booking = await bookingModel.create({
      user: req.user._id,
      service: service._id,
      date,
      time,
      address,
      status: "Pending",
    });

    // =====================================================
    // POPULATE BOOKING DETAILS
    // =====================================================
    const populatedBooking = await bookingModel
      .findById(booking._id)
      .populate(
        "service",
        "name price image category"
      );

    // =====================================================
    // SUCCESS RESPONSE
    // =====================================================
    return res.status(201).json({
      success: true,
      reply: `Perfect! Your ${service.name} booking has been created successfully.`,
      bookingCreated: true,
      booking: populatedBooking,
    });
  } catch (error) {
    console.error("AI Error:", {
      message: error?.message,
      status: error?.status,
      code: error?.code,
      details: error?.details,
    });

    // =====================================================
    // GEMINI 503
    // =====================================================
    if (error?.status === 503 || error?.code === 503) {
      return res.status(503).json({
        success: false,
        message:
          "AI service is temporarily unavailable. Please try again in a moment.",
      });
    }

    // =====================================================
    // GEMINI 429
    // =====================================================
    if (error?.status === 429 || error?.code === 429) {
      return res.status(429).json({
        success: false,
        message:
          "AI service limit has been reached. Please try again later.",
      });
    }

    next(error);
  }
};