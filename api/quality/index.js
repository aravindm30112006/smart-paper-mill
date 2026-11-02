const connectDB = require("../_lib/db");
const QualityInspection = require("../_lib/QualityInspection");

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    await connectDB();

    if (req.method === "GET") {
        try {
            const quality = await QualityInspection.find()
                .sort({ inspectedAt: -1 });
            return res.status(200).json(quality);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch quality inspections",
                error: error.message
            });
        }
    }

    if (req.method === "POST") {
        try {
            const quality = new QualityInspection(req.body);
            const savedQuality = await quality.save();
            return res.status(201).json(savedQuality);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to add quality inspection",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
