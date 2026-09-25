import bookingModel from "../models/bookingModel.js";


// =====================================================
// CREATE BOOKING
// =====================================================
export const createBooking = async (req, res, next) => {
  try {
    // Get booking data from frontend request body
    const { service, date, time, address } = req.body;

    // Check if all required fields are provided
    if (!service || !date || !time || !address) {
      return res.status(400).json({
        success: false,
        message: "Service, date, time and address are required.",
      });
    }

    // Create a new booking in MongoDB
    // req.user._id comes from the protect authentication middleware
    const booking = await bookingModel.create({
      user: req.user._id,
      service,
      date,
      time,
      address,
    });

    // Fetch the newly created booking again
    // populate() gets service details instead of only the service ID
    const populatedBooking = await bookingModel
      .findById(booking._id)
      .populate("service", "name price image category");

    // Send successful response to frontend
    res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking: populatedBooking,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};


// =====================================================
// GET MY BOOKINGS
// =====================================================
export const getMyBookings = async (req, res, next) => {
  try {

    // Find only bookings that belong to the logged-in user
    // req.user._id comes from the protect middleware
    const bookings = await bookingModel
      .find({ user: req.user._id })

      // Get service details related to each booking
      .populate("service", "name price image category")

      // Show newest bookings first
      .sort({ createdAt: -1 });

    // Send bookings to frontend
    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};


// =====================================================
// GET ALL BOOKINGS - ADMIN
// =====================================================
export const getAllBookings = async (req, res, next) => {
  try {

    // Get all bookings from MongoDB
    // This route should be protected by protect + adminOnly middleware
    const bookings = await bookingModel
      .find()

      // Get user details related to each booking
      .populate("user", "fullname email")

      // Get service details related to each booking
      .populate("service", "name price image category")

      // Show newest bookings first
      .sort({ createdAt: -1 });

    // Send all bookings to admin frontend
    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};


// =====================================================
// UPDATE BOOKING STATUS - ADMIN
// =====================================================
export const updateBookingStatus = async (req, res, next) => {
  try {

    // Get new status from frontend request body
    const { status } = req.body;

    // Define which booking statuses are allowed
    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Completed",
      "Cancelled",
    ];

    // Check if the provided status is valid
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status.",
      });
    }

    // Find booking by ID and update its status
    // req.params.id comes from the URL
    const booking = await bookingModel.findByIdAndUpdate(
      req.params.id,

      // New status that should be saved
      { status },

      // new: true → return updated booking
      // runValidators: true → apply model validation during update
      { new: true, runValidators: true }
    );

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Fetch updated booking again
    // Populate user and service information
    const populatedBooking = await bookingModel
      .findById(booking._id)
      .populate("user", "fullname email")
      .populate("service", "name price");

    // Send updated booking to frontend
    res.json({
      success: true,
      message: "Booking status updated.",
      booking: populatedBooking,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};


// =====================================================
// CANCEL MY BOOKING - CUSTOMER
// =====================================================
export const cancelMyBooking = async (req, res, next) => {
  try {

    // Find the booking by:
    // 1. Booking ID from URL
    // 2. Logged-in user's ID
    //
    // This ensures that a user can cancel only their own booking
    const booking = await bookingModel.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    // Check if booking exists
    // Also covers the case where booking belongs to another user
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Change booking status to Cancelled
    booking.status = "Cancelled";

    // Save the updated status to MongoDB
    await booking.save();

    // Send successful response to frontend
    res.json({
      success: true,
      message: "Booking cancelled successfully.",
      booking,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};