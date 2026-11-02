const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ─── DB CONNECTION (cached for serverless) ───────────────────────────────────

let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGODB_URI, { bufferCommands: false })
            .then((m) => m);
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}

// ─── MODELS ──────────────────────────────────────────────────────────────────

const machineSchema = new mongoose.Schema(
    {
        machineName: { type: String, required: true },
        productionLine: { type: String, required: true },
        status: { type: String, enum: ["Running", "Idle", "Maintenance"], default: "Idle" },
        temperature: { type: Number, required: true },
        utilization: { type: Number, required: true, min: 0, max: 100 },
        operatingHours: { type: Number, required: true, min: 0 }
    },
    { timestamps: true }
);

const productionSchema = new mongoose.Schema(
    {
        batchId: { type: String, required: true, unique: true },
        paperType: { type: String, required: true },
        quantity: { type: Number, required: true, min: 0 },
        productionDate: { type: Date, required: true },
        machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine", required: true }
    },
    { timestamps: true }
);

const pulpDataSchema = new mongoose.Schema(
    {
        batchId: { type: String, required: true },
        temperature: { type: Number, required: true },
        pressure: { type: Number, required: true },
        moisture: { type: Number, required: true },
        ph: { type: Number, required: true, min: 0, max: 14 },
        flowRate: { type: Number, required: true },
        status: { type: String, enum: ["Normal", "Warning", "Critical"], default: "Normal" },
        recordedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const qualityInspectionSchema = new mongoose.Schema(
    {
        batchId: { type: String, required: true },
        paperType: { type: String, required: true },
        thickness: { type: Number, required: true },
        moisture: { type: Number, required: true },
        strength: { type: Number, required: true },
        defectCount: { type: Number, required: true, min: 0 },
        qualityStatus: { type: String, enum: ["PASS", "WARNING", "FAIL"], required: true },
        inspectedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const maintenanceSchema = new mongoose.Schema(
    {
        machine: { type: mongoose.Schema.Types.ObjectId, ref: "Machine", required: true },
        maintenanceType: { type: String, enum: ["Preventive", "Corrective", "Emergency"], required: true },
        description: { type: String, required: true },
        scheduledDate: { type: Date, required: true },
        completedDate: { type: Date, default: null },
        technician: { type: String, required: true },
        status: { type: String, enum: ["Scheduled", "In Progress", "Completed", "Overdue"], default: "Scheduled" }
    },
    { timestamps: true }
);

const Machine = mongoose.models.Machine || mongoose.model("Machine", machineSchema);
const Production = mongoose.models.Production || mongoose.model("Production", productionSchema);
const PulpData = mongoose.models.PulpData || mongoose.model("PulpData", pulpDataSchema);
const QualityInspection = mongoose.models.QualityInspection || mongoose.model("QualityInspection", qualityInspectionSchema);
const Maintenance = mongoose.models.Maintenance || mongoose.model("Maintenance", maintenanceSchema);

// ─── EXPRESS APP ─────────────────────────────────────────────────────────────

const app = express();
app.use(cors());
app.use(express.json());

// DB middleware — connect before every request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ message: "Database connection failed", error: err.message });
    }
});

// ─── MACHINES ────────────────────────────────────────────────────────────────

app.get("/api/machines", async (req, res) => {
    try {
        res.json(await Machine.find());
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch machines", error: e.message });
    }
});

app.get("/api/machines/:id", async (req, res) => {
    try {
        const machine = await Machine.findById(req.params.id);
        if (!machine) return res.status(404).json({ message: "Machine not found" });
        res.json(machine);
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch machine", error: e.message });
    }
});

app.post("/api/machines", async (req, res) => {
    try {
        const machine = new Machine(req.body);
        res.status(201).json(await machine.save());
    } catch (e) {
        res.status(400).json({ message: "Unable to add machine", error: e.message });
    }
});

app.put("/api/machines/:id", async (req, res) => {
    try {
        const updated = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Machine not found" });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: "Unable to update machine", error: e.message });
    }
});

app.delete("/api/machines/:id", async (req, res) => {
    try {
        const deleted = await Machine.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Machine not found" });
        res.json({ message: "Machine deleted successfully", machine: deleted });
    } catch (e) {
        res.status(500).json({ message: "Unable to delete machine", error: e.message });
    }
});

// ─── PRODUCTION ──────────────────────────────────────────────────────────────

app.get("/api/production", async (req, res) => {
    try {
        res.json(await Production.find().populate("machine", "machineName productionLine").sort({ productionDate: -1 }));
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch production records", error: e.message });
    }
});

app.get("/api/production/:id", async (req, res) => {
    try {
        const prod = await Production.findById(req.params.id).populate("machine", "machineName productionLine");
        if (!prod) return res.status(404).json({ message: "Production record not found" });
        res.json(prod);
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch production record", error: e.message });
    }
});

app.post("/api/production", async (req, res) => {
    try {
        const saved = await new Production(req.body).save();
        res.status(201).json(await Production.findById(saved._id).populate("machine", "machineName productionLine"));
    } catch (e) {
        res.status(400).json({ message: "Unable to add production record", error: e.message });
    }
});

app.put("/api/production/:id", async (req, res) => {
    try {
        const updated = await Production.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate("machine", "machineName productionLine");
        if (!updated) return res.status(404).json({ message: "Production record not found" });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: "Unable to update production record", error: e.message });
    }
});

app.delete("/api/production/:id", async (req, res) => {
    try {
        const deleted = await Production.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Production record not found" });
        res.json({ message: "Production record deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: "Unable to delete production record", error: e.message });
    }
});

// ─── PULP ────────────────────────────────────────────────────────────────────

app.get("/api/pulp", async (req, res) => {
    try {
        res.json(await PulpData.find().sort({ recordedAt: -1 }));
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch pulp data", error: e.message });
    }
});

app.get("/api/pulp/:id", async (req, res) => {
    try {
        const pulp = await PulpData.findById(req.params.id);
        if (!pulp) return res.status(404).json({ message: "Pulp record not found" });
        res.json(pulp);
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch pulp record", error: e.message });
    }
});

app.post("/api/pulp", async (req, res) => {
    try {
        res.status(201).json(await new PulpData(req.body).save());
    } catch (e) {
        res.status(400).json({ message: "Unable to add pulp record", error: e.message });
    }
});

app.put("/api/pulp/:id", async (req, res) => {
    try {
        const updated = await PulpData.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ message: "Pulp record not found" });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: "Unable to update pulp record", error: e.message });
    }
});

app.delete("/api/pulp/:id", async (req, res) => {
    try {
        const deleted = await PulpData.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Pulp record not found" });
        res.json({ message: "Pulp record deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: "Unable to delete pulp record", error: e.message });
    }
});

// ─── QUALITY ─────────────────────────────────────────────────────────────────

app.get("/api/quality", async (req, res) => {
    try {
        res.json(await QualityInspection.find().sort({ inspectedAt: -1 }));
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch quality inspections", error: e.message });
    }
});

app.get("/api/quality/:id", async (req, res) => {
    try {
        const q = await QualityInspection.findById(req.params.id);
        if (!q) return res.status(404).json({ message: "Quality inspection not found" });
        res.json(q);
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch quality inspection", error: e.message });
    }
});

app.post("/api/quality", async (req, res) => {
    try {
        res.status(201).json(await new QualityInspection(req.body).save());
    } catch (e) {
        res.status(400).json({ message: "Unable to add quality inspection", error: e.message });
    }
});

app.put("/api/quality/:id", async (req, res) => {
    try {
        const q = await QualityInspection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!q) return res.status(404).json({ message: "Quality inspection not found" });
        res.json(q);
    } catch (e) {
        res.status(500).json({ message: "Error updating quality inspection", error: e.message });
    }
});

app.delete("/api/quality/:id", async (req, res) => {
    try {
        const q = await QualityInspection.findByIdAndDelete(req.params.id);
        if (!q) return res.status(404).json({ message: "Quality inspection not found" });
        res.json({ message: "Quality inspection deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: "Error deleting quality inspection", error: e.message });
    }
});

// ─── MAINTENANCE ─────────────────────────────────────────────────────────────

app.get("/api/maintenance", async (req, res) => {
    try {
        res.json(await Maintenance.find().populate("machine", "machineName productionLine").sort({ scheduledDate: 1 }));
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch maintenance records", error: e.message });
    }
});

app.get("/api/maintenance/:id", async (req, res) => {
    try {
        const m = await Maintenance.findById(req.params.id).populate("machine", "machineName productionLine");
        if (!m) return res.status(404).json({ message: "Maintenance record not found" });
        res.json(m);
    } catch (e) {
        res.status(500).json({ message: "Unable to fetch maintenance record", error: e.message });
    }
});

app.post("/api/maintenance", async (req, res) => {
    try {
        const saved = await new Maintenance(req.body).save();
        res.status(201).json(await Maintenance.findById(saved._id).populate("machine", "machineName productionLine"));
    } catch (e) {
        res.status(400).json({ message: "Unable to add maintenance record", error: e.message });
    }
});

app.put("/api/maintenance/:id", async (req, res) => {
    try {
        const updated = await Maintenance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate("machine", "machineName productionLine");
        if (!updated) return res.status(404).json({ message: "Maintenance record not found" });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: "Unable to update maintenance record", error: e.message });
    }
});

app.delete("/api/maintenance/:id", async (req, res) => {
    try {
        const deleted = await Maintenance.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Maintenance record not found" });
        res.json({ message: "Maintenance record deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: "Unable to delete maintenance record", error: e.message });
    }
});

// ─── ALERTS ──────────────────────────────────────────────────────────────────

app.get("/api/alerts", async (req, res) => {
    try {
        const machines = await Machine.find();
        const quality = await QualityInspection.find().sort({ inspectedAt: -1 });
        const maintenance = await Maintenance.find()
            .populate("machine", "machineName productionLine")
            .sort({ scheduledDate: 1 });

        const alerts = [];

        machines.forEach((machine) => {
            if (machine.temperature >= 85) {
                alerts.push({ type: "Temperature", severity: "Critical", title: "High Machine Temperature", message: `${machine.machineName} temperature is ${machine.temperature}°C`, machine: machine.machineName });
            }
            if (machine.utilization < 20 && machine.status === "Running") {
                alerts.push({ type: "Utilization", severity: "Warning", title: "Low Machine Utilization", message: `${machine.machineName} utilization is ${machine.utilization}%`, machine: machine.machineName });
            }
            if (machine.status === "Maintenance") {
                alerts.push({ type: "Maintenance", severity: "Warning", title: "Machine Under Maintenance", message: `${machine.machineName} is currently under maintenance`, machine: machine.machineName });
            }
        });

        quality.forEach((inspection) => {
            if (inspection.qualityStatus === "FAIL") {
                alerts.push({ type: "Quality", severity: "Critical", title: "Quality Inspection Failed", message: `${inspection.batchId} has ${inspection.defectCount} defects`, batchId: inspection.batchId });
            }
            if (inspection.qualityStatus === "WARNING") {
                alerts.push({ type: "Quality", severity: "Warning", title: "Quality Warning", message: `${inspection.batchId} requires quality attention`, batchId: inspection.batchId });
            }
        });

        maintenance.forEach((item) => {
            if (item.status === "Overdue") {
                alerts.push({ type: "Maintenance", severity: "Critical", title: "Maintenance Overdue", message: `${item.machine?.machineName || "Machine"} maintenance is overdue`, machine: item.machine?.machineName });
            }
            if (item.status === "In Progress") {
                alerts.push({ type: "Maintenance", severity: "Warning", title: "Maintenance In Progress", message: `${item.machine?.machineName || "Machine"} is currently being serviced`, machine: item.machine?.machineName });
            }
        });

        res.json({
            totalAlerts: alerts.length,
            criticalAlerts: alerts.filter((a) => a.severity === "Critical").length,
            warningAlerts: alerts.filter((a) => a.severity === "Warning").length,
            alerts
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to generate alerts", error: e.message });
    }
});

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

app.get("/api", (req, res) => {
    res.json({ message: "Smart Paper Mill API is running", database: "MongoDB Atlas" });
});

module.exports = app;
