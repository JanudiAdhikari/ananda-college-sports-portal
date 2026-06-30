const Sport = require("../models/Sport");
const createSlug = require("../utils/createSlug");

const getSports = async (req, res) => {
  try {
    const { search, category } = req.query;

    const query = {
      isActive: true,
    };

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category && category !== "ALL") {
      query.category = category;
    }

    const sports = await Sport.find(query).sort({
      displayOrder: 1,
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: sports.length,
      sports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sports.",
      error: error.message,
    });
  }
};

const getSportBySlug = async (req, res) => {
  try {
    const sport = await Sport.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found.",
      });
    }

    res.status(200).json({
      success: true,
      sport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sport details.",
      error: error.message,
    });
  }
};

const createSport = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      achievements,
      displayOrder,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Sport name is required.",
      });
    }

    const slug = createSlug(name);

    const existingSport = await Sport.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingSport) {
      return res.status(409).json({
        success: false,
        message: "Sport already exists.",
      });
    }

    const sport = await Sport.create({
      name,
      slug,
      category,
      description,
      achievements,
      displayOrder,
    });

    res.status(201).json({
      success: true,
      message: "Sport created successfully.",
      sport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create sport.",
      error: error.message,
    });
  }
};

const updateSport = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      achievements,
      displayOrder,
      isActive,
    } = req.body;

    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found.",
      });
    }

    if (name && name !== sport.name) {
      const newSlug = createSlug(name);

      const existingSport = await Sport.findOne({
        _id: { $ne: sport._id },
        $or: [{ name }, { slug: newSlug }],
      });

      if (existingSport) {
        return res.status(409).json({
          success: false,
          message: "Another sport with this name already exists.",
        });
      }

      sport.name = name;
      sport.slug = newSlug;
    }

    if (category !== undefined) sport.category = category;
    if (description !== undefined) sport.description = description;
    if (achievements !== undefined) sport.achievements = achievements;
    if (displayOrder !== undefined) sport.displayOrder = displayOrder;
    if (isActive !== undefined) sport.isActive = isActive;

    await sport.save();

    res.status(200).json({
      success: true,
      message: "Sport updated successfully.",
      sport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update sport.",
      error: error.message,
    });
  }
};

const deleteSport = async (req, res) => {
  try {
    const sport = await Sport.findById(req.params.id);

    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Sport not found.",
      });
    }

    sport.isActive = false;
    await sport.save();

    res.status(200).json({
      success: true,
      message: "Sport deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete sport.",
      error: error.message,
    });
  }
};

module.exports = {
  getSports,
  getSportBySlug,
  createSport,
  updateSport,
  deleteSport,
};