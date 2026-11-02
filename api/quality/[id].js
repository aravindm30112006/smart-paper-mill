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

    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const quality = await QualityInspection.findById(id);
            if (!quality) {
                return res.status(404).json({ message: "Quality inspection not found" });
            }
            return res.status(200).json(quality);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch quality inspection",
                error: error.message
            });
        }
    }

    if (req.method === "PUT") {
        try {
            const quality = await QualityInspection.findByIdAndUpdate(
                id, req.body,
                { new: true, runValidators: true }
            );
            if (!quality) {
                return res.status(404).json({ message: "Quality inspection not found" });
            }
            return res.status(200).json(quality);
        } catch (error) {
            return res.status(500).json({
                message: "Error updating quality inspection",
                error: error.message
            });
        }
    }

    if (req.method === "DELETE") {
        try {
            const quality = await QualityInspection.findByIdAndDelete(id);
            if (!quality) {
                return res.status(404).json({ message: "Quality inspection not found" });
            }
            return res.status(200).json({ message: "Quality inspection deleted successfully" });
        } catch (error) {
            return res.status(500).json({
                message: "Error deleting quality inspection",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
