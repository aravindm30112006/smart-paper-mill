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

    if (req.method === "GET") {
        try {
            const maintenance = await Maintenance.find()
                .populate("machine", "machineName productionLine")
                .sort({ scheduledDate: 1 });
            return res.status(200).json(maintenance);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch maintenance records",
                error: error.message
            });
        }
    }

    if (req.method === "POST") {
        try {
            const maintenance = new Maintenance(req.body);
            const savedMaintenance = await maintenance.save();
            const populatedMaintenance = await Maintenance.findById(savedMaintenance._id)
                .populate("machine", "machineName productionLine");
            return res.status(201).json(populatedMaintenance);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to add maintenance record",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
