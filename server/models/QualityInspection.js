const mongoose = require("mongoose");

const qualityInspectionSchema = new mongoose.Schema(
    {
        batchId: {
            type: String,
            required: true
        },

        paperType: {
            type: String,
            required: true
        },

        thickness: {
            type: Number,
            required: true
        },

        moisture: {
            type: Number,
            required: true
        },

        strength: {
            type: Number,
            required: true
        },

        defectCount: {
            type: Number,
            required: true,
            min: 0
        },

        qualityStatus: {
            type: String,
            enum: ["PASS", "WARNING", "FAIL"],
            required: true
        },

        inspectedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "QualityInspection",
    qualityInspectionSchema
);