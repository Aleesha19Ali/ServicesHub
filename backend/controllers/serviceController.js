import serviceModel from "../models/serviceModel.js";


// =====================================================
// GET ALL SERVICES
// =====================================================
export const getServices = async (req, res, next) => {
  try {

    // Get all services from MongoDB
    // sort({ createdAt: -1 }) means newest services first
    const services = await serviceModel
      .find()
      .sort({ createdAt: -1 });

    // Send services to frontend
    // services.length tells how many services were found
    res.json({
      success: true,
      count: services.length,
      services,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};


// =====================================================
// GET SINGLE SERVICE BY ID
// =====================================================
export const getServiceById = async (req, res, next) => {
  try {

    // Get service ID from URL
    // Example: /api/v1/services/68abc123
    // req.params.id = 68abc123
    const service = await serviceModel.findById(req.params.id);

    // Check if service was found
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Send the requested service to frontend
    res.json({
      success: true,
      service,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};


// =====================================================
// CREATE NEW SERVICE - ADMIN
// =====================================================
export const createService = async (req, res, next) => {
  try {

    // Create a new service in MongoDB
    // req.body contains service data sent from frontend/Postman
    const service = await serviceModel.create(req.body);

    // Send successful response
    // 201 means a new resource was successfully created
    res.status(201).json({
      success: true,
      message: "Service created successfully.",
      service,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};


// =====================================================
// UPDATE SERVICE - ADMIN
// =====================================================
export const updateService = async (req, res, next) => {
  try {

    // Find service by ID and update it
    // req.params.id comes from the URL
    // req.body contains the new service data
    const service = await serviceModel.findByIdAndUpdate(
      req.params.id,

      // Data that needs to be updated
      req.body,

      // new: true
      // Returns the updated service instead of the old one
      //
      // runValidators: true
      // Applies Mongoose schema validation during update
      {
        new: true,
        runValidators: true,
      }
    );

    // Check if service exists
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Send updated service to frontend
    res.json({
      success: true,
      message: "Service updated successfully.",
      service,
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};


// =====================================================
// DELETE SERVICE - ADMIN
// =====================================================
export const deleteService = async (req, res, next) => {
  try {

    // Find service by ID and delete it from MongoDB
    const service = await serviceModel.findByIdAndDelete(
      req.params.id
    );

    // Check if service exists
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    // Send successful response
    res.json({
      success: true,
      message: "Service deleted successfully.",
    });

  } catch (error) {
    // Send error to global error-handling middleware
    next(error);
  }
};