const express = require("express");
const router = express.Router();

const Maintenance = require("../models/Maintenance");

// ========================================
// GET ALL MAINTENANCE RECORDS
// ========================================

router.get("/", async (req, res) => {
    try {
        const maintenance = await Maintenance.find()
            .populate("machine", "machineName productionLine")
            .sort({ scheduledDate: 1 });

        res.json(maintenance);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch maintenance records",
            error: error.message
        });
    }
});


// ========================================
// GET SINGLE MAINTENANCE RECORD
// ========================================

router.get("/:id", async (req, res) => {
    try {
        const maintenance =
            await Maintenance.findById(req.params.id)
                .populate(
                    "machine",
                    "machineName productionLine"
                );

        if (!maintenance) {
            return res.status(404).json({
                message: "Maintenance record not found"
            });
        }

        res.json(maintenance);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch maintenance record",
            error: error.message
        });
    }
});


// ========================================
// ADD MAINTENANCE
// ========================================

router.post("/", async (req, res) => {
    try {
        const maintenance =
            new Maintenance(req.body);

        const savedMaintenance =
            await maintenance.save();

        const populatedMaintenance =
            await Maintenance.findById(
                savedMaintenance._id
            ).populate(
                "machine",
                "machineName productionLine"
            );

        res.status(201).json(
            populatedMaintenance
        );

    } catch (error) {
        res.status(400).json({
            message: "Unable to add maintenance record",
            error: error.message
        });
    }
});


// ========================================
// UPDATE MAINTENANCE
// ========================================

router.put("/:id", async (req, res) => {
    try {
        const updatedMaintenance =
            await Maintenance.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            ).populate(
                "machine",
                "machineName productionLine"
            );

        if (!updatedMaintenance) {
            return res.status(404).json({
                message: "Maintenance record not found"
            });
        }

        res.json(updatedMaintenance);

    } catch (error) {
        res.status(400).json({
            message: "Unable to update maintenance record",
            error: error.message
        });
    }
});


// ========================================
// DELETE MAINTENANCE
// ========================================

router.delete("/:id", async (req, res) => {
    try {
        const deletedMaintenance =
            await Maintenance.findByIdAndDelete(
                req.params.id
            );

        if (!deletedMaintenance) {
            return res.status(404).json({
                message: "Maintenance record not found"
            });
        }

        res.json({
            message:
                "Maintenance record deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message:
                "Unable to delete maintenance record",
            error: error.message
        });
    }
});


module.exports = router;