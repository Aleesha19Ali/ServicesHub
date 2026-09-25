import { useState } from "react";
import { Bot, Send, X, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm ServiceHub AI. I can help you choose a service or make a booking.",
    },
  ]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    const userMessage = {
      role: "user",
      content: text,
    };

    const history = [...messages, userMessage];

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/ai/chat", {
        message: text,
        history,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.reply,
          bookingCreated: response.data.bookingCreated || false,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "Sorry, I couldn't process your request right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {open && (
        <div
          className="
            fixed bottom-20 right-3 z-50
            flex w-[calc(100vw-1.5rem)] max-w-[380px]
            flex-col overflow-hidden rounded-2xl
            border border-slate-200 bg-white shadow-2xl
            h-[min(600px,calc(100vh-6rem))]
          "
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between bg-slate-950 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />

              <div>
                <p className="font-bold">ServiceHub AI</p>
                <p className="text-xs text-slate-300">
                  Booking Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chatbot"
              className="rounded-lg p-1 hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    item.role === "user"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{item.content}</p>

                  {item.bookingCreated && (
                    <Link
                      to="/my-bookings"
                      onClick={() => setOpen(false)}
                      className="
                        mt-3 inline-flex items-center gap-2
                        rounded-lg bg-emerald-600 px-3 py-2
                        text-xs font-semibold text-white
                        hover:bg-emerald-700
                      "
                    >
                      <CalendarCheck className="h-4 w-4" />
                      View My Bookings
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-500">
                  AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex shrink-0 gap-2 border-t bg-white p-3"
          >
            <input
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask or book a service..."
              className="
                min-w-0 flex-1 rounded-lg
                border border-slate-200 px-3 py-2
                text-sm outline-none
                focus:border-emerald-500
              "
            />

            <button
              type="submit"
              disabled={loading}
              className="
                rounded-lg bg-emerald-600 px-3
                text-white hover:bg-emerald-700
                disabled:opacity-50
              "
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="
          fixed bottom-5 right-5 z-50
          flex h-14 w-14 items-center justify-center
          rounded-full bg-emerald-600
          text-white shadow-lg hover:bg-emerald-700
        "
        aria-label="Open ServiceHub AI"
      >
        <Bot className="h-6 w-6" />
      </button>
    </>
  );
}