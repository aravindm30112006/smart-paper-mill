const express = require("express");

const Machine = require("../models/Machine");
const QualityInspection = require("../models/QualityInspection");
const Maintenance = require("../models/Maintenance");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const machines = await Machine.find();

        const quality = await QualityInspection.find()
            .sort({ inspectedAt: -1 });

        const maintenance = await Maintenance.find()
            .populate("machine", "machineName productionLine")
            .sort({ scheduledDate: 1 });

        const alerts = [];

        // Machine alerts
        machines.forEach((machine) => {

            if (machine.temperature >= 85) {
                alerts.push({
                    type: "Temperature",
                    severity: "Critical",
                    title: "High Machine Temperature",
                    message: `${machine.machineName} temperature is ${machine.temperature}°C`,
                    machine: machine.machineName
                });
            }

            if (
                machine.utilization < 20 &&
                machine.status === "Running"
            ) {
                alerts.push({
                    type: "Utilization",
                    severity: "Warning",
                    title: "Low Machine Utilization",
                    message: `${machine.machineName} utilization is ${machine.utilization}%`,
                    machine: machine.machineName
                });
            }

            if (machine.status === "Maintenance") {
                alerts.push({
                    type: "Maintenance",
                    severity: "Warning",
                    title: "Machine Under Maintenance",
                    message: `${machine.machineName} is currently under maintenance`,
                    machine: machine.machineName
                });
            }
        });

        // Quality alerts
        quality.forEach((inspection) => {

            if (inspection.qualityStatus === "FAIL") {
                alerts.push({
                    type: "Quality",
                    severity: "Critical",
                    title: "Quality Inspection Failed",
                    message: `${inspection.batchId} has ${inspection.defectCount} defects`,
                    batchId: inspection.batchId
                });
            }

            if (inspection.qualityStatus === "WARNING") {
                alerts.push({
                    type: "Quality",
                    severity: "Warning",
                    title: "Quality Warning",
                    message: `${inspection.batchId} requires quality attention`,
                    batchId: inspection.batchId
                });
            }
        });

        // Maintenance alerts
        maintenance.forEach((item) => {

            if (item.status === "Overdue") {
                alerts.push({
                    type: "Maintenance",
                    severity: "Critical",
                    title: "Maintenance Overdue",
                    message: `${item.machine?.machineName || "Machine"} maintenance is overdue`,
                    machine: item.machine?.machineName
                });
            }

            if (item.status === "In Progress") {
                alerts.push({
                    type: "Maintenance",
                    severity: "Warning",
                    title: "Maintenance In Progress",
                    message: `${item.machine?.machineName || "Machine"} is currently being serviced`,
                    machine: item.machine?.machineName
                });
            }
        });

        res.json({
            totalAlerts: alerts.length,
            criticalAlerts: alerts.filter(
                (alert) => alert.severity === "Critical"
            ).length,
            warningAlerts: alerts.filter(
                (alert) => alert.severity === "Warning"
            ).length,
            alerts
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to generate alerts",
            error: error.message
        });
    }
});

module.exports = router;