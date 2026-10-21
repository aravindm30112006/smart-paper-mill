import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
    AreaChart,
    Area
} from "recharts";
import {
    Activity,
    Layers,
    Cpu,
    ShieldCheck,
    Wrench,
    AlertTriangle,
    RefreshCw,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowUpRight,
    Gauge,
    Thermometer,
    Package,
    Calendar,
    ChevronRight,
    Sliders
} from "lucide-react";

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
    const [lastUpdated, setLastUpdated] = useState(new Date());

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

            setMachines(machinesRes.data || []);
            setProduction(productionRes.data || []);
            setQuality(qualityRes.data || []);
            setMaintenance(maintenanceRes.data || []);
            setAlerts(alertsRes.data || { totalAlerts: 0, criticalAlerts: 0, warningAlerts: 0, alerts: [] });
            setError("");
            setLastUpdated(new Date());
        } catch (err) {
            console.error(err);
            setError("Unable to connect to Smart Paper Mill server. Verify backend connectivity.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000);
        return () => clearInterval(interval);
    }, []);

    // KPIs Calculations
    const totalProduction = useMemo(() => {
        return production.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    }, [production]);

    const runningMachines = useMemo(() => {
        return machines.filter((m) => m.status === "Running").length;
    }, [machines]);

    const machineAvailabilityRate = useMemo(() => {
        if (!machines.length) return "0.0";
        return ((runningMachines / machines.length) * 100).toFixed(1);
    }, [machines, runningMachines]);

    const passedQuality = useMemo(() => {
        return quality.filter((item) => item.qualityStatus === "PASS").length;
    }, [quality]);

    const qualityPassRate = useMemo(() => {
        if (!quality.length) return "0.0";
        return ((passedQuality / quality.length) * 100).toFixed(1);
    }, [quality, passedQuality]);

    const activeMaintenance = useMemo(() => {
        return maintenance.filter(
            (item) => item.status === "Scheduled" || item.status === "In Progress" || item.status === "Overdue"
        ).length;
    }, [maintenance]);

    const averageUtilization = useMemo(() => {
        if (!machines.length) return "0.0";
        const sum = machines.reduce((acc, m) => acc + Number(m.utilization || 0), 0);
        return (sum / machines.length).toFixed(1);
    }, [machines]);

    // Chart Data
    const productionChartData = useMemo(() => {
        return production.slice(-8).map((item) => ({
            batch: item.batchId || "Batch",
            quantity: Number(item.quantity || 0),
            paperType: item.paperType || "Standard"
        }));
    }, [production]);

    const qualityChartData = useMemo(() => {
        const pass = quality.filter((item) => item.qualityStatus === "PASS").length;
        const warn = quality.filter((item) => item.qualityStatus === "WARNING").length;
        const fail = quality.filter((item) => item.qualityStatus === "FAIL").length;
        return [
            { name: "Pass", value: pass, color: "#16a34a" },
            { name: "Warning", value: warn, color: "#d97706" },
            { name: "Fail", value: fail, color: "#dc2626" }
        ];
    }, [quality]);

    // Recent activity timeline
    const recentActivity = useMemo(() => {
        const list = [];
        production.slice(-3).forEach((p) => {
            list.push({
                id: `prod-${p._id}`,
                type: "production",
                title: `Batch ${p.batchId} produced`,
                detail: `${Number(p.quantity || 0).toLocaleString()} kg · ${p.paperType || "Paper"}`,
                date: p.productionDate || p.createdAt || new Date(),
                badge: "Production"
            });
        });
        maintenance.slice(-3).forEach((m) => {
            list.push({
                id: `maint-${m._id}`,
                type: "maintenance",
                title: `${m.maintenanceType} on ${m.machine?.machineName || "Machine"}`,
                detail: `Assigned: ${m.technician || "Staff"} · Status: ${m.status}`,
                date: m.scheduledDate || m.createdAt || new Date(),
                badge: "Maintenance"
            });
        });
        quality.slice(-3).forEach((q) => {
            list.push({
                id: `qual-${q._id}`,
                type: "quality",
                title: `Inspection for ${q.batchId}`,
                detail: `Status: ${q.qualityStatus} · ${q.defectCount || 0} defect(s)`,
                date: q.inspectedAt || q.createdAt || new Date(),
                badge: "Quality"
            });
        });

        // Sort by date desc
        return list.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
    }, [production, maintenance, quality]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="chart-tooltip-industrial">
                    <div className="chart-tooltip-title">{label}</div>
                    <div className="chart-tooltip-row">
                        <span>Output:</span>
                        <strong>{Number(data.quantity || 0).toLocaleString()} kg</strong>
                    </div>
                    {data.paperType && (
                        <div className="chart-tooltip-sub">Grade: {data.paperType}</div>
                    )}
                </div>
            );
        }
        return null;
    };

    if (loading && machines.length === 0) {
        return (
            <div className="page-loading-skeleton">
                <div className="spinner-industrial"></div>
                <span>Connecting to Smart Paper Mill SCADA...</span>
            </div>
        );
    }

    return (
        <div className="page-container dashboard-layout">
            {/* DASHBOARD HEADER */}
            <div className="dashboard-header-bar">
                <div className="header-meta">
                    <div className="page-eyebrow">
                        <span>Plant SCADA Overview</span>
                        <span className="eyebrow-divider">/</span>
                        <span>Mill Operations Center</span>
                    </div>
                    <h1 className="dashboard-headline">Production Operations & Plant Telemetry</h1>
                    <p className="dashboard-subheadline">
                        Real-time industrial surveillance of paper machinery, mill output, quality checks, and alerts
                    </p>
                </div>

                <div className="dashboard-header-controls">
                    <div className="live-status-pill">
                        <span className="live-status-dot"></span>
                        <span className="live-status-text">SCADA Live</span>
                        <span className="live-status-time">
                            {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                    </div>

                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={fetchDashboardData}
                        title="Force sync data"
                    >
                        <RefreshCw size={14} className={loading ? "spin-icon" : ""} />
                        <span>Sync</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert-banner alert-banner-critical">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* 1. PRODUCTION OVERVIEW & PRODUCTION KPIS */}
            <div className="kpi-grid">
                {/* Total Production */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">TOTAL PRODUCTION</span>
                        <div className="kpi-icon-wrapper kpi-icon-navy">
                            <Layers size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">
                            {totalProduction.toLocaleString()}
                            <span className="kpi-unit"> kg</span>
                        </div>
                        <div className="kpi-footer-metric">
                            <span className="text-secondary font-medium">{production.length} Batches recorded</span>
                        </div>
                    </div>
                </div>

                {/* Fleet Availability */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">FLEET AVAILABILITY</span>
                        <div className="kpi-icon-wrapper kpi-icon-green">
                            <Activity size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-running">
                            {runningMachines}
                            <span className="kpi-unit"> / {machines.length} active</span>
                        </div>
                        <div className="kpi-footer-metric">
                            <span className="kpi-progress-text">{machineAvailabilityRate}% operational</span>
                        </div>
                    </div>
                </div>

                {/* Machine Utilization */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">AVG UTILIZATION</span>
                        <div className="kpi-icon-wrapper kpi-icon-blue">
                            <Gauge size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">
                            {averageUtilization}
                            <span className="kpi-unit">%</span>
                        </div>
                        <div className="kpi-footer-metric">
                            <span className="text-muted">Target threshold ≥ 80%</span>
                        </div>
                    </div>
                </div>

                {/* Quality Pass Rate */}
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">QUALITY PASS RATE</span>
                        <div className="kpi-icon-wrapper kpi-icon-green">
                            <ShieldCheck size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-running">
                            {qualityPassRate}
                            <span className="kpi-unit">%</span>
                        </div>
                        <div className="kpi-footer-metric">
                            <span className="text-secondary">{passedQuality} of {quality.length} inspections passed</span>
                        </div>
                    </div>
                </div>

                {/* Active Alerts */}
                <div className="kpi-card kpi-card-alert">
                    <div className="kpi-header">
                        <span className="kpi-label">SYSTEM ALERTS</span>
                        <div className={`kpi-icon-wrapper ${alerts.criticalAlerts > 0 ? "kpi-icon-critical" : "kpi-icon-amber"}`}>
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className={`kpi-value ${alerts.criticalAlerts > 0 ? "text-critical" : "text-amber"}`}>
                            {alerts.totalAlerts}
                        </div>
                        <div className="kpi-footer-metric">
                            <span className="text-critical font-semibold">{alerts.criticalAlerts} critical</span>
                            <span className="text-muted"> · {alerts.warningAlerts} warning</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* DASHBOARD SECTION: MAIN PRODUCTION TREND CHART & TELEMETRY */}
            <div className="dashboard-grid-two-to-one">
                {/* 7. PRODUCTION TREND CHART */}
                <div className="card chart-card">
                    <div className="card-header border-bottom">
                        <div className="card-title-group">
                            <div className="card-tag">PRODUCTION METRICS</div>
                            <h2 className="card-title">Production Trend by Batch</h2>
                            <p className="card-subtitle">Output weight distribution across recent manufacturing runs</p>
                        </div>
                        <Link to="/production" className="card-action-link">
                            <span>View All Batches</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="card-content chart-container-inner">
                        {productionChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={290}>
                                <BarChart data={productionChartData} margin={{ top: 16, right: 10, left: -10, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="batch"
                                        tick={{ fill: "#64748b", fontSize: 11 }}
                                        axisLine={{ stroke: "#cbd5e1" }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fill: "#64748b", fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar
                                        dataKey="quantity"
                                        fill="#1e40af"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={48}
                                        isAnimationActive={false}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-chart-state">
                                <Package size={28} className="text-muted" />
                                <span>No production batch data available to chart</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. QUALITY METRICS (DONUT & BREAKDOWN) */}
                <div className="card chart-card">
                    <div className="card-header border-bottom">
                        <div className="card-title-group">
                            <div className="card-tag">QUALITY CONTROL</div>
                            <h2 className="card-title">Inspection Results</h2>
                            <p className="card-subtitle">Pass vs Warning vs Defect classification</p>
                        </div>
                        <Link to="/quality" className="card-action-link">
                            <span>Inspections</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="card-content quality-donut-wrapper">
                        {quality.length > 0 ? (
                            <div className="donut-flex">
                                <div className="donut-relative">
                                    <PieChart width={160} height={160}>
                                        <Pie
                                            data={qualityChartData}
                                            innerRadius={50}
                                            outerRadius={75}
                                            paddingAngle={3}
                                            dataKey="value"
                                            isAnimationActive={false}
                                        >
                                            {qualityChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                    <div className="donut-center-metric">
                                        <span className="donut-center-val">{qualityPassRate}%</span>
                                        <span className="donut-center-lbl">Pass Rate</span>
                                    </div>
                                </div>

                                <div className="donut-legend-industrial">
                                    <div className="legend-item">
                                        <span className="legend-marker marker-pass"></span>
                                        <span className="legend-name">Pass (0–5 defects)</span>
                                        <strong className="legend-count text-running">
                                            {qualityChartData[0].value}
                                        </strong>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-marker marker-warn"></span>
                                        <span className="legend-name">Warning (6–10)</span>
                                        <strong className="legend-count text-amber">
                                            {qualityChartData[1].value}
                                        </strong>
                                    </div>
                                    <div className="legend-item">
                                        <span className="legend-marker marker-fail"></span>
                                        <span className="legend-name">Fail (&gt; 10)</span>
                                        <strong className="legend-count text-critical">
                                            {qualityChartData[2].value}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-chart-state">
                                <ShieldCheck size={28} className="text-muted" />
                                <span>No quality inspection records logged</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* DASHBOARD SECTION: MACHINE STATUS & ACTIVE ALERTS */}
            <div className="dashboard-grid-half">
                {/* 2. MACHINE STATUS */}
                <div className="card">
                    <div className="card-header border-bottom">
                        <div className="card-title-group">
                            <div className="card-tag">EQUIPMENT STATUS</div>
                            <h2 className="card-title">Live Machine Telemetry</h2>
                            <p className="card-subtitle">Operational line conditions, thermals, and loading</p>
                        </div>
                        <Link to="/machines" className="card-action-link">
                            <span>Manage Fleet</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="card-content p-0">
                        <div className="machine-telemetry-list">
                            {machines.slice(0, 5).map((machine) => {
                                const isHot = Number(machine.temperature || 0) >= 85;
                                const isRunning = machine.status === "Running";
                                const isMaint = machine.status === "Maintenance";

                                return (
                                    <div className="machine-telemetry-row" key={machine._id}>
                                        <div className="machine-row-indicator">
                                            <span
                                                className={`status-pip ${
                                                    isRunning
                                                        ? "status-pip-running"
                                                        : isMaint
                                                        ? "status-pip-maintenance"
                                                        : "status-pip-idle"
                                                }`}
                                            ></span>
                                        </div>

                                        <div className="machine-row-identity">
                                            <span className="machine-row-name">{machine.machineName}</span>
                                            <span className="machine-row-line">{machine.productionLine}</span>
                                        </div>

                                        <div className="machine-row-metrics">
                                            <div className="machine-metric-col">
                                                <span className="col-label">Temp</span>
                                                <span className={`col-val ${isHot ? "text-critical font-bold" : ""}`}>
                                                    <Thermometer size={12} className={isHot ? "text-critical" : "text-muted"} />
                                                    {machine.temperature}°C
                                                </span>
                                            </div>

                                            <div className="machine-metric-col">
                                                <span className="col-label">Utilization</span>
                                                <span className="col-val font-mono">{machine.utilization}%</span>
                                            </div>
                                        </div>

                                        <div className="machine-row-status-badge">
                                            <span
                                                className={`badge ${
                                                    isRunning
                                                        ? "badge-running"
                                                        : isMaint
                                                        ? "badge-maintenance"
                                                        : "badge-idle"
                                                }`}
                                            >
                                                {machine.status}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {machines.length === 0 && (
                                <div className="empty-inner-state">
                                    <Cpu size={24} className="text-muted" />
                                    <span>No machinery registered in mill database</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 6. ACTIVE ALERTS */}
                <div className="card">
                    <div className="card-header border-bottom">
                        <div className="card-title-group">
                            <div className="card-tag">INCIDENTS & SURVEILLANCE</div>
                            <h2 className="card-title">Active System Alerts</h2>
                            <p className="card-subtitle">Conditions requiring operator attention or intervention</p>
                        </div>
                        <Link to="/alerts" className="card-action-link">
                            <span>Alert Center</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="card-content p-0">
                        <div className="alert-feed-list">
                            {alerts.alerts.slice(0, 5).map((alert, idx) => {
                                const isCritical = alert.severity === "Critical";
                                return (
                                    <div
                                        key={alert._id || idx}
                                        className={`alert-feed-row ${isCritical ? "alert-row-critical" : "alert-row-warning"}`}
                                    >
                                        <div className="alert-feed-icon">
                                            {isCritical ? (
                                                <XCircle size={16} className="text-critical" />
                                            ) : (
                                                <AlertTriangle size={16} className="text-amber" />
                                            )}
                                        </div>

                                        <div className="alert-feed-body">
                                            <div className="alert-feed-header">
                                                <span className="alert-feed-title">{alert.title || "Plant Alert"}</span>
                                                <span
                                                    className={`badge ${isCritical ? "badge-critical" : "badge-maintenance"}`}
                                                >
                                                    {alert.severity}
                                                </span>
                                            </div>
                                            <p className="alert-feed-desc">{alert.message}</p>
                                            {(alert.machine || alert.batchId) && (
                                                <div className="alert-feed-meta">
                                                    {alert.machine && <span>Target: {alert.machine}</span>}
                                                    {alert.batchId && <span>Batch: {alert.batchId}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {alerts.alerts.length === 0 && (
                                <div className="empty-inner-state">
                                    <CheckCircle2 size={24} className="text-running" />
                                    <span>All plant operations normal. No active alerts.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* DASHBOARD SECTION: MAINTENANCE STATUS & RECENT ACTIVITY */}
            <div className="dashboard-grid-half">
                {/* 5. MAINTENANCE STATUS */}
                <div className="card">
                    <div className="card-header border-bottom">
                        <div className="card-title-group">
                            <div className="card-tag">PREVENTIVE SERVICE</div>
                            <h2 className="card-title">Maintenance Schedule</h2>
                            <p className="card-subtitle">Upcoming and ongoing technician service dispatches</p>
                        </div>
                        <Link to="/maintenance" className="card-action-link">
                            <span>Full Schedule</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="card-content p-0">
                        <div className="schedule-list">
                            {maintenance.slice(0, 4).map((item) => {
                                const isDone = item.status === "Completed";
                                const isProg = item.status === "In Progress";
                                const isOverdue = item.status === "Overdue";

                                return (
                                    <div className="schedule-row" key={item._id}>
                                        <div className="schedule-date-badge">
                                            <Calendar size={13} className="text-muted" />
                                            <span>
                                                {item.scheduledDate
                                                    ? new Date(item.scheduledDate).toLocaleDateString("en-IN", {
                                                          day: "2-digit",
                                                          month: "short"
                                                      })
                                                    : "-"}
                                            </span>
                                        </div>

                                        <div className="schedule-detail">
                                            <div className="schedule-name">
                                                {item.machine?.machineName || "Industrial Unit"}
                                            </div>
                                            <div className="schedule-sub">
                                                {item.maintenanceType} · Tech: {item.technician || "Unassigned"}
                                            </div>
                                        </div>

                                        <span
                                            className={`badge ${
                                                isDone
                                                    ? "badge-running"
                                                    : isProg
                                                    ? "badge-info"
                                                    : isOverdue
                                                    ? "badge-critical"
                                                    : "badge-idle"
                                            }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                );
                            })}

                            {maintenance.length === 0 && (
                                <div className="empty-inner-state">
                                    <Wrench size={24} className="text-muted" />
                                    <span>No maintenance orders currently scheduled</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 8. RECENT ACTIVITY */}
                <div className="card">
                    <div className="card-header border-bottom">
                        <div className="card-title-group">
                            <div className="card-tag">AUDIT TRAIL</div>
                            <h2 className="card-title">Recent Operational Activity</h2>
                            <p className="card-subtitle">Latest batch dispatches, quality inspections, and services</p>
                        </div>
                    </div>

                    <div className="card-content p-0">
                        <div className="activity-feed">
                            {recentActivity.map((act) => (
                                <div className="activity-item" key={act.id}>
                                    <div className="activity-icon-col">
                                        <div
                                            className={`activity-bullet ${
                                                act.type === "production"
                                                    ? "bullet-navy"
                                                    : act.type === "quality"
                                                    ? "bullet-green"
                                                    : "bullet-amber"
                                            }`}
                                        ></div>
                                    </div>
                                    <div className="activity-content-col">
                                        <div className="activity-title-row">
                                            <span className="activity-item-title">{act.title}</span>
                                            <span className="activity-time">
                                                {new Date(act.date).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short"
                                                })}
                                            </span>
                                        </div>
                                        <div className="activity-item-detail">{act.detail}</div>
                                    </div>
                                </div>
                            ))}

                            {recentActivity.length === 0 && (
                                <div className="empty-inner-state">
                                    <Clock size={24} className="text-muted" />
                                    <span>No recent plant activity recorded</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* DASHBOARD FOOTER CALLOUT */}
            <div className="dashboard-footer-status">
                <div className="footer-status-item">
                    <span className="footer-dot-green"></span>
                    <span>Smart Paper Mill SCADA v2.4</span>
                </div>
                <div className="footer-divider">•</div>
                <div>Data poller active (30s cadence)</div>
                <div className="footer-divider">•</div>
                <div>ISO 9001 / TAPPI Standard Compliant</div>
            </div>
        </div>
    );
}

export default Dashboard;
