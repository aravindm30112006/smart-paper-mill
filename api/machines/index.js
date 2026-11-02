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

    // GET /api/machines
    if (req.method === "GET") {
        try {
            const machines = await Machine.find();
            return res.status(200).json(machines);
        } catch (error) {
            return res.status(500).json({
                message: "Unable to fetch machines",
                error: error.message
            });
        }
    }

    // POST /api/machines
    if (req.method === "POST") {
        try {
            const machine = new Machine(req.body);
            const savedMachine = await machine.save();
            return res.status(201).json(savedMachine);
        } catch (error) {
            return res.status(400).json({
                message: "Unable to add machine",
                error: error.message
            });
        }
    }

    return res.status(405).json({ message: "Method not allowed" });
};
