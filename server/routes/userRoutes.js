const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");

const router = express.Router();


// ==========================================
// REGISTER USER
// ==========================================

router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.toLowerCase().trim();

        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const user = new User({
            name: cleanName,
            email: cleanEmail,
            password: password
        });

        const savedUser = await user.save();

        return res.status(201).json({
            message: "Registration successful",
            user: {
                id: savedUser._id.toString(),
                name: savedUser.name,
                email: savedUser.email,
                phone: savedUser.phone || "",
                location: savedUser.location || ""
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});


// ==========================================
// LOGIN USER
// ==========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                location: user.location || ""
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});


// ==========================================
// GET ALL USERS
// ==========================================

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
            .select("_id name email phone location")
            .sort({ createdAt: 1 });

        return res.status(200).json(users);

    } catch (error) {
        console.error("Fetch users error:", error);

        return res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
});


// ==========================================
// GET ONE USER
// ==========================================

router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(userId)
            .select("_id name email phone location");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        console.error("Get user error:", error);

        return res.status(500).json({
            message: "Failed to get user",
            error: error.message
        });
    }
});


// ==========================================
// UPDATE USER PROFILE
// ==========================================

router.put("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            name,
            email,
            phone,
            location
        } = req.body;

        // ==========================================
        // VALIDATE USER ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // ==========================================
        // VALIDATE REQUIRED FIELDS
        // ==========================================

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.toLowerCase().trim();

        if (!cleanName || !cleanEmail) {
            return res.status(400).json({
                message: "Name and email cannot be empty"
            });
        }

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // ==========================================
        // CHECK EMAIL DUPLICATE
        // ==========================================

        const existingUser = await User.findOne({
            email: cleanEmail,
            _id: { $ne: userId }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered by another user"
            });
        }

        // ==========================================
        // UPDATE PROFILE
        // ==========================================

        user.name = cleanName;
        user.email = cleanEmail;

        user.phone = phone
            ? phone.trim()
            : "";

        user.location = location
            ? location.trim()
            : "";

        // ==========================================
        // SAVE
        // ==========================================

        const updatedUser = await user.save();

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({
            message: "Profile updated successfully",

            user: {
                id: updatedUser._id.toString(),
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone || "",
                location: updatedUser.location || ""
            }
        });

    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            message: "Failed to update profile",
            error: error.message
        });
    }
});


// ==========================================
// RESET PASSWORD
// ==========================================
// Temporary development route
// Later we can replace this with bcrypt
// and proper authentication.
// ==========================================

router.put("/reset-password/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { password } = req.body;

        // ==========================================
        // VALIDATE USER ID
        // ==========================================

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        // ==========================================
        // VALIDATE PASSWORD
        // ==========================================

        if (!password || !password.trim()) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        // ==========================================
        // FIND USER
        // ==========================================

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // ==========================================
        // UPDATE PASSWORD
        // ==========================================

        user.password = password.trim();

        await user.save();

        // ==========================================
        // RESPONSE
        // ==========================================

        return res.status(200).json({
            message: "Password updated successfully",

            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                location: user.location || ""
            }
        });

    } catch (error) {
        console.error("Reset password error:", error);

        return res.status(500).json({
            message: "Failed to reset password",
            error: error.message
        });
    }
});


module.exports = router;
