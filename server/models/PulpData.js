const mongoose = require("mongoose");

const pulpDataSchema = new mongoose.Schema(
    {
        batchId: {
            type: String,
            required: true
        },

        temperature: {
            type: Number,
            required: true
        },

        pressure: {
            type: Number,
            required: true
        },

        moisture: {
            type: Number,
            required: true
        },

        ph: {
            type: Number,
            required: true,
            min: 0,
            max: 14
        },

        flowRate: {
            type: Number,
            required: true
        },

        status: {
            type: String,
            enum: ["Normal", "Warning", "Critical"],
            default: "Normal"
        },

        recordedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("PulpData", pulpDataSchema);