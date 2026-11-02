const connectDB = require("../_lib/db");
const Maintenance = require("../_lib/Maintenance");

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
            const maintenance = await Maintenance.findById(id)
                .populate("machine", "machineName productionLine");
            if (!maintenance) {
                return res.status(404).json({ message: "Maintenance record not found" });
            }
            return res.status(200).json(maintenance);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch maintenance record",
                error: error.message
            });
        }
    }

    if (req.method === "PUT") {
        try {
            const updatedMaintenance = await Maintenance.findByIdAndUpdate(
                id, req.body,
                { new: true, runValidators: true }
            ).populate("machine", "machineName productionLine");
            if (!updatedMaintenance) {
                return res.status(404).json({ message: "Maintenance record not found" });
            }
            return res.status(200).json(updatedMaintenance);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to update maintenance record",
                error: error.message
            });
        }
    }

    if (req.method === "DELETE") {
        try {
            const deletedMaintenance = await Maintenance.findByIdAndDelete(id);
            if (!deletedMaintenance) {
                return res.status(404).json({ message: "Maintenance record not found" });
            }
            return res.status(200).json({ message: "Maintenance record deleted successfully" });
        } catch (error) {
            return res.status(500).json({
                message: "Unable to delete maintenance record",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
