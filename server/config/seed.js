const bcrypt = require("bcryptjs");
const User = require("../models/User");

const DEFAULT_ADMIN_EMAIL = "admin@smartpapermill.com";
const DEFAULT_ADMIN_PASSWORD = "admin123";

async function seedAdminUser() {
    try {
        const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL.toLowerCase() });
        if (!existingAdmin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);

            await User.create({
                email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
                password: hashedPassword,
                role: "admin",
                name: "Plant Administrator"
            });
            console.log(`[Seed] Default admin user seeded successfully (${DEFAULT_ADMIN_EMAIL})`);
        }
    } catch (error) {
        console.error("[Seed] Failed to seed default admin user:", error.message);
    }
}

module.exports = { seedAdminUser, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD };
