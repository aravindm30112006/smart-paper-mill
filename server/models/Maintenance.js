const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
    {
        machine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Machine",
            required: true
        },

        maintenanceType: {
            type: String,
            enum: ["Preventive", "Corrective", "Emergency"],
            required: true
        },

        description: {
            type: String,
            required: true
        },

        scheduledDate: {
            type: Date,
            required: true
        },

        completedDate: {
            type: Date,
            default: null
        },

        technician: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["Scheduled", "In Progress", "Completed", "Overdue"],
            default: "Scheduled"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Maintenance", maintenanceSchema);