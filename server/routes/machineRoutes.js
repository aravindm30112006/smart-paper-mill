const express = require("express");
const router = express.Router();

const Machine = require("../models/Machine");

// ================================
// GET ALL MACHINES
// ================================

router.get("/", async (req, res) => {
    try {
        const machines = await Machine.find();
        res.json(machines);
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch machines",
            error: error.message
        });
    }
});


// ================================
// GET SINGLE MACHINE
// ================================

router.get("/:id", async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);

        if (!machine) {
            return res.status(404).json({
                message: "Machine not found"
            });
        }

        res.json(machine);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch machine",
            error: error.message
        });
    }
});


// ================================
// ADD MACHINE
// ================================

router.post("/", async (req, res) => {
    try {
        const machine = new Machine(req.body);

        const savedMachine = await machine.save();

        res.status(201).json(savedMachine);

    } catch (error) {
        res.status(400).json({
            message: "Unable to add machine",
            error: error.message
        });
    }
});


// ================================
// UPDATE MACHINE
// ================================

router.put("/:id", async (req, res) => {
    try {
        const updatedMachine = await Machine.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedMachine) {
            return res.status(404).json({
                message: "Machine not found"
            });
        }

        res.json(updatedMachine);

    } catch (error) {
        res.status(400).json({
            message: "Unable to update machine",
            error: error.message
        });
    }
});


// ================================
// DELETE MACHINE
// ================================

router.delete("/:id", async (req, res) => {
    try {
        const deletedMachine = await Machine.findByIdAndDelete(
            req.params.id
        );

        if (!deletedMachine) {
            return res.status(404).json({
                message: "Machine not found"
            });
        }

        res.json({
            message: "Machine deleted successfully",
            machine: deletedMachine
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to delete machine",
            error: error.message
        });
    }
});

module.exports = router;