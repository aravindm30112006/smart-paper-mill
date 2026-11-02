const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { seedAdminUser, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } = require("../config/seed");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "smart_paper_mill_secret_key_2026";

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide both email and password."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Ensure default admin exists
        await seedAdminUser();

        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Please try again."
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Please try again."
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server authentication error",
            error: error.message
        });
    }
});

// GET /api/auth/me - Verify current token
router.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({ success: true, user: decoded });
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
});

module.exports = router;
