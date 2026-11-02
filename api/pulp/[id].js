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

    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const pulp = await PulpData.findById(id);
            if (!pulp) {
                return res.status(404).json({ message: "Pulp record not found" });
            }
            return res.status(200).json(pulp);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch pulp record",
                error: error.message
            });
        }
    }

    if (req.method === "PUT") {
        try {
            const updatedPulp = await PulpData.findByIdAndUpdate(
                id, req.body,
                { new: true, runValidators: true }
            );
            if (!updatedPulp) {
                return res.status(404).json({ message: "Pulp record not found" });
            }
            return res.status(200).json(updatedPulp);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to update pulp record",
                error: error.message
            });
        }
    }

    if (req.method === "DELETE") {
        try {
            const deletedPulp = await PulpData.findByIdAndDelete(id);
            if (!deletedPulp) {
                return res.status(404).json({ message: "Pulp record not found" });
            }
            return res.status(200).json({ message: "Pulp record deleted successfully" });
        } catch (error) {
            return res.status(500).json({
                message: "Unable to delete pulp record",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
