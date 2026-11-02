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

    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const production = await Production.findById(id)
                .populate("machine", "machineName productionLine");
            if (!production) {
                return res.status(404).json({ message: "Production record not found" });
            }
            return res.status(200).json(production);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch production record",
                error: error.message
            });
        }
    }

    if (req.method === "PUT") {
        try {
            const updatedProduction = await Production.findByIdAndUpdate(
                id, req.body,
                { new: true, runValidators: true }
            ).populate("machine", "machineName productionLine");
            if (!updatedProduction) {
                return res.status(404).json({ message: "Production record not found" });
            }
            return res.status(200).json(updatedProduction);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to update production record",
                error: error.message
            });
        }
    }

    if (req.method === "DELETE") {
        try {
            const deletedProduction = await Production.findByIdAndDelete(id);
            if (!deletedProduction) {
                return res.status(404).json({ message: "Production record not found" });
            }
            return res.status(200).json({ message: "Production record deleted successfully" });
        } catch (error) {
            return res.status(500).json({
                message: "Unable to delete production record",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
