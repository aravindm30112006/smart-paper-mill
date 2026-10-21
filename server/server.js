const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const machineRoutes = require("./routes/machineRoutes");
const productionRoutes = require("./routes/productionRoutes");
const pulpRoutes = require("./routes/pulpRoutes");
const qualityRoutes = require("./routes/qualityRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const alertRoutes = require("./routes/alertRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/machines", machineRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/pulp", pulpRoutes);
app.use("/api/quality", qualityRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/alerts", alertRoutes);


// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Smart Paper Mill API is running",
        database: "MongoDB"
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});