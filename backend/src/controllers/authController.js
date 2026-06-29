const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "This user account is inactive.",
      });
    }

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token: generateToken(user._id),
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          username: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role && role !== "ALL") {
      query.role = role;
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
      error: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, username, password, role } = req.body;

    if (!fullName || !username || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Full name, username, password, and role are required.",
      });
    }

    const existingUser = await User.findOne({
      username: username.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists.",
      });
    }

    const user = await User.create({
      fullName,
      username,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User creation failed.",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { fullName, username, password, role, isActive } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (username && username.toLowerCase() !== user.username) {
      const existingUser = await User.findOne({
        _id: { $ne: user._id },
        username: username.toLowerCase(),
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "Username already exists.",
        });
      }

      user.username = username;
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (password) user.password = password;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user.",
      error: error.message,
    });
  }
};

const deactivateUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account.",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to deactivate user.",
      error: error.message,
    });
  }
};

module.exports = {
  login,
  getMe,
  getUsers,
  createUser,
  updateUser,
  deactivateUser,
};