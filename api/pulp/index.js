const connectDB = require("../_lib/db");
const PulpData = require("../_lib/PulpData");

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
            const pulpData = await PulpData.find().sort({ recordedAt: -1 });
            return res.status(200).json(pulpData);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch pulp data",
                error: error.message
            });
        }
    }

    if (req.method === "POST") {
        try {
            const pulp = new PulpData(req.body);
            const savedPulp = await pulp.save();
            return res.status(201).json(savedPulp);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to add pulp record",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
