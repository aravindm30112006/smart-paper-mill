const express = require("express");
const QualityInspection = require("../models/QualityInspection");

const router = express.Router();

// GET all quality inspections
router.get("/", async (req, res) => {
    try {
        const quality = await QualityInspection.find()
            .sort({ inspectedAt: -1 });

        res.json(quality);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching quality inspections",
            error: error.message
        });
    }
});

// GET quality inspection by ID
router.get("/:id", async (req, res) => {
    try {
        const quality = await QualityInspection.findById(req.params.id);

        if (!quality) {
            return res.status(404).json({
                message: "Quality inspection not found"
            });
        }

        res.json(quality);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching quality inspection",
            error: error.message
        });
    }
});

// ADD quality inspection
router.post("/", async (req, res) => {
    try {
        const {
            batchId,
            paperType,
            thickness,
            moisture,
            strength,
            defectCount
        } = req.body;

        let qualityStatus;

        if (defectCount <= 5) {
            qualityStatus = "PASS";
        } else if (defectCount <= 10) {
            qualityStatus = "WARNING";
        } else {
            qualityStatus = "FAIL";
        }

        const quality = new QualityInspection({
            batchId,
            paperType,
            thickness,
            moisture,
            strength,
            defectCount,
            qualityStatus
        });

        const savedQuality = await quality.save();

        res.status(201).json(savedQuality);
    } catch (error) {
        res.status(500).json({
            message: "Error adding quality inspection",
            error: error.message
        });
    }
});

// UPDATE quality inspection
router.put("/:id", async (req, res) => {
    try {
        const {
            batchId,
            paperType,
            thickness,
            moisture,
            strength,
            defectCount
        } = req.body;

        let qualityStatus;

        if (defectCount <= 5) {
            qualityStatus = "PASS";
        } else if (defectCount <= 10) {
            qualityStatus = "WARNING";
        } else {
            qualityStatus = "FAIL";
        }

        const quality = await QualityInspection.findByIdAndUpdate(
            req.params.id,
            {
                batchId,
                paperType,
                thickness,
                moisture,
                strength,
                defectCount,
                qualityStatus
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!quality) {
            return res.status(404).json({
                message: "Quality inspection not found"
            });
        }

        res.json(quality);
    } catch (error) {
        res.status(500).json({
            message: "Error updating quality inspection",
            error: error.message
        });
    }
});

// DELETE quality inspection
router.delete("/:id", async (req, res) => {
    try {
        const quality = await QualityInspection.findByIdAndDelete(
            req.params.id
        );

        if (!quality) {
            return res.status(404).json({
                message: "Quality inspection not found"
            });
        }

        res.json({
            message: "Quality inspection deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting quality inspection",
            error: error.message
        });
    }
});

module.exports = router;