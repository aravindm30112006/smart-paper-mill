import { useEffect, useState } from "react";
import axios from "axios";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area
} from "recharts";

function Dashboard() {
    const [machines, setMachines] = useState([]);
    const [production, setProduction] = useState([]);
    const [quality, setQuality] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [alerts, setAlerts] = useState({
        totalAlerts: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        alerts: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardData = async () => {
        try {
            const [
                machinesRes,
                productionRes,
                qualityRes,
                maintenanceRes,
                alertsRes
            ] = await Promise.all([
                axios.get("http://localhost:5000/api/machines"),
                axios.get("http://localhost:5000/api/production"),
                axios.get("http://localhost:5000/api/quality"),
                axios.get("http://localhost:5000/api/maintenance"),
                axios.get("http://localhost:5000/api/alerts")
            ]);

            setMachines(machinesRes.data);
            setProduction(productionRes.data);
            setQuality(qualityRes.data);
            setMaintenance(maintenanceRes.data);
            setAlerts(alertsRes.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to connect to Smart Paper Mill server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();

        const interval = setInterval(fetchDashboardData, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="page">
                <div className="loading-state">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    const totalProduction = production.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const runningMachines = machines.filter(
        (machine) => machine.status === "Running"
    ).length;

    const passedQuality = quality.filter(
        (item) => item.qualityStatus === "PASS"
    ).length;

    const qualityPassRate =
        quality.length > 0
            ? ((passedQuality / quality.length) * 100).toFixed(1)
            : "0.0";

    const activeMaintenance = maintenance.filter(
        (item) =>
            item.status === "Scheduled" ||
            item.status === "In Progress"
    ).length;

    const averageUtilization =
        machines.length > 0
            ? (
                  machines.reduce(
                      (sum, machine) =>
                          sum + Number(machine.utilization || 0),
                      0
                  ) / machines.length
              ).toFixed(1)
            : "0.0";

    const productionChartData = production.map((item) => ({
        batch: item.batchId,
        quantity: Number(item.quantity || 0)
    }));

    const utilizationData = machines.map((machine) => ({
        machine: machine.machineName.replace("Paper ", ""),
        utilization: Number(machine.utilization || 0)
    }));

    const qualityChartData = [
        {
            name: "Passed",
            value: quality.filter(
                (item) => item.qualityStatus === "PASS"
            ).length
        },
        {
            name: "Warning",
            value: quality.filter(
                (item) => item.qualityStatus === "WARNING"
            ).length
        },
        {
            name: "Failed",
            value: quality.filter(
                (item) => item.qualityStatus === "FAIL"
            ).length
        }
    ];

    const QUALITY_COLORS = [
        "#1f8a70",
        "#d6a343",
        "#c94c4c"
    ];

    const getMachineStatusClass = (status) => {
        if (status === "Running") return "status-running";
        if (status === "Maintenance") return "status-maintenance";
        return "status-idle";
    };

    return (
        <div className="classic-dashboard">

            {/* TOP HEADER */}

            <div className="dashboard-heading">

                <div>
                    <div className="dashboard-eyebrow">
                        OPERATIONS CONTROL CENTER
                    </div>

                    <h1>Smart Paper Mill</h1>

                    <p>
                        Production, machine efficiency and quality
                        monitoring
                    </p>
                </div>

                <div className="dashboard-actions">

                    <div className="system-status">
                        <span className="online-dot"></span>
                        System Online
                    </div>

                    <button
                        className="dashboard-refresh"
                        onClick={fetchDashboardData}
                    >
                        ↻ Refresh
                    </button>

                </div>

            </div>

            {error && (
                <div className="dashboard-error">
                    {error}
                </div>
            )}

            {/* KPI STRIP */}

            <div className="classic-kpi-grid">

                <div className="classic-kpi">

                    <div className="kpi-label">
                        TOTAL PRODUCTION
                    </div>

                    <div className="kpi-value">
                        {totalProduction.toLocaleString()}
                        <span> kg</span>
                    </div>

                    <div className="kpi-description">
                        Current production output
                    </div>

                </div>

                <div className="classic-kpi">

                    <div className="kpi-label">
                        MACHINE AVAILABILITY
                    </div>

                    <div className="kpi-value">
                        {runningMachines}
                        <span>
                            {" "}
                            / {machines.length}
                        </span>
                    </div>

                    <div className="kpi-description">
                        Machines currently running
                    </div>

                </div>

                <div className="classic-kpi">

                    <div className="kpi-label">
                        AVG. UTILIZATION
                    </div>

                    <div className="kpi-value">
                        {averageUtilization}
                        <span>%</span>
                    </div>

                    <div className="kpi-description">
                        Across all machines
                    </div>

                </div>

                <div className="classic-kpi">

                    <div className="kpi-label">
                        QUALITY PASS RATE
                    </div>

                    <div className="kpi-value">
                        {qualityPassRate}
                        <span>%</span>
                    </div>

                    <div className="kpi-description">
                        Latest inspections
                    </div>

                </div>

                <div className="classic-kpi alert-kpi">

                    <div className="kpi-label">
                        ACTIVE ALERTS
                    </div>

                    <div className="kpi-value">
                        {alerts.totalAlerts}
                    </div>

                    <div className="kpi-description">
                        {alerts.criticalAlerts} critical
                    </div>

                </div>

            </div>

            {/* SECTION */}

            <div className="dashboard-section-title">
                <div>
                    <h2>Production Performance</h2>
                    <p>
                        Output and machine utilization overview
                    </p>
                </div>
            </div>

            {/* MAIN CHARTS */}

            <div className="classic-chart-grid">

                <div className="classic-panel large-panel">

                    <div className="panel-heading">

                        <div>
                            <h3>Production Output</h3>
                            <span>
                                Quantity produced by batch
                            </span>
                        </div>

                        <div className="panel-unit">
                            KG
                        </div>

                    </div>

                    <div className="chart-area">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <BarChart
                                data={productionChartData}
                                margin={{
                                    top: 10,
                                    right: 15,
                                    left: 0,
                                    bottom: 5
                                }}
                            >
                                <CartesianGrid
                                    stroke="#e8edf2"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="batch"
                                    tick={{
                                        fontSize: 11
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    tick={{
                                        fontSize: 11
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="quantity"
                                    fill="#17324d"
                                    radius={[3, 3, 0, 0]}
                                    barSize={38}
                                />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>

                <div className="classic-panel">

                    <div className="panel-heading">

                        <div>
                            <h3>Machine Utilization</h3>
                            <span>
                                Current operating efficiency
                            </span>
                        </div>

                        <div className="panel-unit">
                            %
                        </div>

                    </div>

                    <div className="chart-area">

                        <ResponsiveContainer
                            width="100%"
                            height={320}
                        >
                            <BarChart
                                data={utilizationData}
                                layout="vertical"
                                margin={{
                                    top: 10,
                                    right: 15,
                                    left: 15,
                                    bottom: 5
                                }}
                            >
                                <CartesianGrid
                                    stroke="#e8edf2"
                                    horizontal={false}
                                />

                                <XAxis
                                    type="number"
                                    domain={[0, 100]}
                                    tick={{
                                        fontSize: 10
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                />

                                <YAxis
                                    type="category"
                                    dataKey="machine"
                                    tick={{
                                        fontSize: 10
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    width={60}
                                />

                                <Tooltip />

                                <Bar
                                    dataKey="utilization"
                                    fill="#397c6a"
                                    radius={[0, 3, 3, 0]}
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>

                    </div>

                </div>

            </div>

            {/* SECOND SECTION */}

            <div className="dashboard-section-title">
                <div>
                    <h2>Plant Overview</h2>
                    <p>
                        Current machine condition and quality status
                    </p>
                </div>
            </div>

            <div className="plant-grid">

                {/* MACHINE STATUS */}

                <div className="classic-panel">

                    <div className="panel-heading">

                        <div>
                            <h3>Machine Status</h3>
                            <span>
                                Live production line condition
                            </span>
                        </div>

                    </div>

                    <div className="machine-status-list">

                        {machines.map((machine) => (

                            <div
                                className="classic-machine-row"
                                key={machine._id}
                            >

                                <div className="machine-indicator">
                                    <span
                                        className={`machine-dot ${getMachineStatusClass(
                                            machine.status
                                        )}`}
                                    ></span>
                                </div>

                                <div className="machine-name">

                                    <strong>
                                        {machine.machineName}
                                    </strong>

                                    <span>
                                        {machine.productionLine}
                                    </span>

                                </div>

                                <div className="machine-temperature">

                                    <span>
                                        Temperature
                                    </span>

                                    <strong>
                                        {machine.temperature}°C
                                    </strong>

                                </div>

                                <div className="machine-utilization">

                                    <div className="utilization-header">
                                        <span>
                                            Utilization
                                        </span>

                                        <strong>
                                            {machine.utilization}%
                                        </strong>
                                    </div>

                                    <div className="classic-progress">
                                        <div
                                            style={{
                                                width: `${Math.min(
                                                    Number(
                                                        machine.utilization ||
                                                            0
                                                    ),
                                                    100
                                                )}%`
                                            }}
                                        ></div>
                                    </div>

                                </div>

                                <span
                                    className={`classic-status ${getMachineStatusClass(
                                        machine.status
                                    )}`}
                                >
                                    {machine.status}
                                </span>

                            </div>

                        ))}

                    </div>

                </div>

                {/* QUALITY */}

                <div className="classic-panel quality-panel">

                    <div className="panel-heading">

                        <div>
                            <h3>Quality Control</h3>
                            <span>
                                Inspection distribution
                            </span>
                        </div>

                    </div>

                    <div className="quality-dashboard-content">

                        <div className="quality-donut">

                            <ResponsiveContainer
                                width="100%"
                                height={220}
                            >
                                <PieChart>

                                    <Pie
                                        data={qualityChartData}
                                        innerRadius={65}
                                        outerRadius={88}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {qualityChartData.map(
                                            (entry, index) => (
                                                <Cell
                                                    key={index}
                                                    fill={
                                                        QUALITY_COLORS[
                                                            index
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip />

                                </PieChart>
                            </ResponsiveContainer>

                            <div className="quality-center">
                                <strong>
                                    {quality.length}
                                </strong>

                                <span>
                                    Inspections
                                </span>
                            </div>

                        </div>

                        <div className="quality-legend">

                            <div>
                                <span className="legend-dot pass-dot"></span>
                                <span>Passed</span>
                                <strong>
                                    {qualityChartData[0].value}
                                </strong>
                            </div>

                            <div>
                                <span className="legend-dot warning-dot"></span>
                                <span>Warning</span>
                                <strong>
                                    {qualityChartData[1].value}
                                </strong>
                            </div>

                            <div>
                                <span className="legend-dot fail-dot"></span>
                                <span>Failed</span>
                                <strong>
                                    {qualityChartData[2].value}
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* THIRD SECTION */}

            <div className="dashboard-section-title">
                <div>
                    <h2>Operational Activity</h2>
                    <p>
                        Maintenance and system alerts requiring attention
                    </p>
                </div>
            </div>

            <div className="activity-grid">

                {/* MAINTENANCE */}

                <div className="classic-panel">

                    <div className="panel-heading">

                        <div>
                            <h3>Maintenance Schedule</h3>
                            <span>
                                Upcoming maintenance activities
                            </span>
                        </div>

                        <div className="activity-count">
                            {activeMaintenance}
                        </div>

                    </div>

                    <div className="maintenance-list">

                        {maintenance
                            .filter(
                                (item) =>
                                    item.status !== "Completed"
                            )
                            .slice(0, 5)
                            .map((item) => (

                                <div
                                    className="classic-maintenance-row"
                                    key={item._id}
                                >

                                    <div className="maintenance-date">

                                        <strong>
                                            {new Date(
                                                item.scheduledDate
                                            ).getDate()}
                                        </strong>

                                        <span>
                                            {new Date(
                                                item.scheduledDate
                                            ).toLocaleDateString(
                                                "en-IN",
                                                {
                                                    month: "short"
                                                }
                                            )}
                                        </span>

                                    </div>

                                    <div className="maintenance-info">

                                        <strong>
                                            {item.machine?.machineName ||
                                                "Machine"}
                                        </strong>

                                        <span>
                                            {item.maintenanceType}
                                            {" · "}
                                            {item.technician}
                                        </span>

                                    </div>

                                    <span
                                        className={`maintenance-label ${
                                            item.status ===
                                            "In Progress"
                                                ? "maintenance-progress"
                                                : item.status ===
                                                  "Overdue"
                                                ? "maintenance-danger"
                                                : "maintenance-planned"
                                        }`}
                                    >
                                        {item.status}
                                    </span>

                                </div>

                            ))}

                        {activeMaintenance === 0 && (
                            <div className="empty-small">
                                No pending maintenance activities.
                            </div>
                        )}

                    </div>

                </div>

                {/* ALERTS */}

                <div className="classic-panel">

                    <div className="panel-heading">

                        <div>
                            <h3>System Alerts</h3>
                            <span>
                                Conditions requiring attention
                            </span>
                        </div>

                        <div className="alert-summary">

                            <span>
                                {alerts.criticalAlerts} Critical
                            </span>

                        </div>

                    </div>

                    <div className="system-alert-list">

                        {alerts.alerts
                            .slice(0, 5)
                            .map((alert, index) => (

                                <div
                                    className="classic-alert-row"
                                    key={
                                        alert._id ||
                                        index
                                    }
                                >

                                    <span
                                        className={`alert-level ${
                                            alert.severity ===
                                            "Critical"
                                                ? "critical-level"
                                                : "warning-level"
                                        }`}
                                    ></span>

                                    <div>

                                        <strong>
                                            {alert.title ||
                                                "System Alert"}
                                        </strong>

                                        <p>
                                            {alert.message}
                                        </p>

                                    </div>

                                    <span
                                        className={`alert-text ${
                                            alert.severity ===
                                            "Critical"
                                                ? "critical-text"
                                                : "warning-text"
                                        }`}
                                    >
                                        {alert.severity}
                                    </span>

                                </div>

                            ))}

                        {alerts.alerts.length === 0 && (
                            <div className="empty-small">
                                No active alerts. All systems normal.
                            </div>
                        )}

                    </div>

                </div>

            </div>

            <div className="dashboard-footer-note">
                Smart Paper Mill Management System
                <span>•</span>
                Data refreshes automatically every 30 seconds
            </div>

        </div>
    );
}

export default Dashboard;