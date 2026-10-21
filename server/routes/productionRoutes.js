const express = require("express");
const router = express.Router();

const Production = require("../models/Production");

// ========================================
// GET ALL PRODUCTION RECORDS
// ========================================

router.get("/", async (req, res) => {
    try {
        const production = await Production.find()
            .populate("machine", "machineName productionLine")
            .sort({ productionDate: -1 });

        res.json(production);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch production records",
            error: error.message
        });
    }
});


// ========================================
// GET SINGLE PRODUCTION RECORD
// ========================================

router.get("/:id", async (req, res) => {
    try {
        const production = await Production.findById(req.params.id)
            .populate("machine", "machineName productionLine");

        if (!production) {
            return res.status(404).json({
                message: "Production record not found"
            });
        }

        res.json(production);

    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch production record",
            error: error.message
        });
    }
});


// ========================================
// ADD PRODUCTION
// ========================================

router.post("/", async (req, res) => {
    try {
        const production = new Production(req.body);

        const savedProduction = await production.save();

        const populatedProduction =
            await Production.findById(savedProduction._id)
                .populate("machine", "machineName productionLine");

        res.status(201).json(populatedProduction);

    } catch (error) {
        res.status(400).json({
            message: "Unable to add production record",
            error: error.message
        });
    }
});


// ========================================
// UPDATE PRODUCTION
// ========================================

router.put("/:id", async (req, res) => {
    try {
        const updatedProduction =
            await Production.findByIdAndUpdate(
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

        if (!updatedProduction) {
            return res.status(404).json({
                message: "Production record not found"
            });
        }

        res.json(updatedProduction);

    } catch (error) {
        res.status(400).json({
            message: "Unable to update production record",
            error: error.message
        });
    }
});


// ========================================
// DELETE PRODUCTION
// ========================================

router.delete("/:id", async (req, res) => {
    try {
        const deletedProduction =
            await Production.findByIdAndDelete(
                req.params.id
            );

        if (!deletedProduction) {
            return res.status(404).json({
                message: "Production record not found"
            });
        }

        res.json({
            message: "Production record deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Unable to delete production record",
            error: error.message
        });
    }
});


module.exports = router;