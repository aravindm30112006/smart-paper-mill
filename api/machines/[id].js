const connectDB = require("../_lib/db");
const Machine = require("../_lib/Machine");

module.exports = async function handler(req, res) {
    // CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    await connectDB();

    const { id } = req.query;

    // GET /api/machines/:id
    if (req.method === "GET") {
        try {
            const machine = await Machine.findById(id);
            if (!machine) {
                return res.status(404).json({ message: "Machine not found" });
            }
            return res.status(200).json(machine);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch machine",
                error: error.message
            });
        }
    }

    // PUT /api/machines/:id
    if (req.method === "PUT") {
        try {
            const updatedMachine = await Machine.findByIdAndUpdate(
                id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedMachine) {
                return res.status(404).json({ message: "Machine not found" });
            }
            return res.status(200).json(updatedMachine);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to update machine",
                error: error.message
            });
        }
    }

    // DELETE /api/machines/:id
    if (req.method === "DELETE") {
        try {
            const deletedMachine = await Machine.findByIdAndDelete(id);
            if (!deletedMachine) {
                return res.status(404).json({ message: "Machine not found" });
            }
            return res.status(200).json({
                message: "Machine deleted successfully",
                machine: deletedMachine
            });
        } catch (error) {
            return res.status(500).json({
                message: "Unable to delete machine",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
