import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// =========================
// CREATE JWT TOKEN
// =========================
const createToken = (userId) =>
  jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// =========================
// SET TOKEN COOKIE
// =========================
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// =========================
// REGISTER USER
// =========================
export const register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    // Check required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required.",
      });
    }

    // Check if email already exists
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    // New users are always customers
    const user = await userModel.create({
      fullname,
      email,
      password: hashedPassword,
      role: "customer",
    });

    // Create JWT
    const token = createToken(user._id);

    // Store JWT inside HTTP-only cookie
    setTokenCookie(res, token);

    // Send response
    res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// LOGIN USER
// =========================
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Find user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Create JWT
    const token = createToken(user._id);

    // Store JWT inside HTTP-only cookie
    setTokenCookie(res, token);

    // Send user data
    res.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET CURRENT USER
// =========================
export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// LOGOUT USER
// =========================
export const logout = async (req, res, next) => {
  try {
    // Remove token cookie
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    next(error);
  }
};