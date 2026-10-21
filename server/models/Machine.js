const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
    {
        machineName: {
            type: String,
            required: true
        },

        productionLine: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Running", "Idle", "Maintenance"],
            default: "Idle"
        },

        temperature: {
            type: Number,
            required: true
        },

        utilization: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },

        operatingHours: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Machine", machineSchema);