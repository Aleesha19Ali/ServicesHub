import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================
export const authMiddleware = async (req, res, next) => {
  try {
    // Get JWT token from cookie
    const token = req.cookies.token;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login first.",
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Find user using the user ID stored inside JWT
    // Password is excluded from the result
    const user = await userModel
      .findById(decoded.userId)
      .select("-password");

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // Store logged-in user in request object
    // Controllers can access it using req.user
    req.user = user;

    // Continue to the next middleware/controller
    next();

  } catch (error) {
    // JWT invalid or expired
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
};


// =====================================================
// ADMIN ONLY MIDDLEWARE
// =====================================================
export const adminOnly = (req, res, next) => {

  // Check whether logged-in user's role is admin
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  // User is admin
  next();
};