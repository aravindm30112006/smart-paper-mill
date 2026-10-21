const express = require("express");
const router = express.Router();

const PulpData = require("../models/PulpData");

// GET ALL PULP DATA
router.get("/", async (req, res) => {
    try {
        const pulpData = await PulpData.find()
            .sort({ recordedAt: -1 });

        res.json(pulpData);
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch pulp data",
            error: error.message
        });
    }
});


// GET SINGLE PULP RECORD
router.get("/:id", async (req, res) => {
    try {
        const pulp = await PulpData.findById(req.params.id);

        if (!pulp) {
            return res.status(404).json({
                message: "Pulp record not found"
            });
        }

        res.json(pulp);
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch pulp record",
            error: error.message
        });
    }
});


// ADD PULP DATA
router.post("/", async (req, res) => {
    try {
        const pulp = new PulpData(req.body);

        const savedPulp = await pulp.save();

        res.status(201).json(savedPulp);
    } catch (error) {
        res.status(400).json({
            message: "Unable to add pulp data",
            error: error.message
        });
    }
});


// UPDATE PULP DATA
router.put("/:id", async (req, res) => {
    try {
        const updatedPulp =
            await PulpData.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedPulp) {
            return res.status(404).json({
                message: "Pulp record not found"
            });
        }

        res.json(updatedPulp);
    } catch (error) {
        res.status(400).json({
            message: "Unable to update pulp data",
            error: error.message
        });
    }
});


// DELETE PULP DATA
router.delete("/:id", async (req, res) => {
    try {
        const deletedPulp =
            await PulpData.findByIdAndDelete(
                req.params.id
            );

        if (!deletedPulp) {
            return res.status(404).json({
                message: "Pulp record not found"
            });
        }

        res.json({
            message: "Pulp record deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to delete pulp data",
            error: error.message
        });
    }
});

module.exports = router;