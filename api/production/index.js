const connectDB = require("../_lib/db");
const Production = require("../_lib/Production");

module.exports = async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    await connectDB();

    // GET /api/production
    if (req.method === "GET") {
        try {
            const production = await Production.find()
                .populate("machine", "machineName productionLine")
                .sort({ productionDate: -1 });
            return res.status(200).json(production);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch production records",
                error: error.message
            });
        }
    }

    // POST /api/production
    if (req.method === "POST") {
        try {
            const production = new Production(req.body);
            const savedProduction = await production.save();
            const populatedProduction = await Production.findById(savedProduction._id)
                .populate("machine", "machineName productionLine");
            return res.status(201).json(populatedProduction);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to add production record",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
