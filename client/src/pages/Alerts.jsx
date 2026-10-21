import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
    AlertTriangle,
    XCircle,
    CheckCircle2,
    RefreshCw,
    Search,
    Thermometer,
    Gauge,
    ShieldAlert,
    Wrench,
    Clock,
    Cpu,
    Package,
    Bell,
    Filter,
    Info
} from "lucide-react";

function Alerts() {
    const [alertData, setAlertData] = useState({
        totalAlerts: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        alerts: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [severityFilter, setSeverityFilter] = useState("ALL");

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/alerts");
            setAlertData(response.data || { totalAlerts: 0, criticalAlerts: 0, warningAlerts: 0, alerts: [] });
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to retrieve alarm surveillance data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredAlerts = useMemo(() => {
        return (alertData.alerts || []).filter((alert) => {
            const matchesSearch =
                (alert.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (alert.message || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (typeof alert.machine === "object" ? alert.machine?.machineName : alert.machine || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                (alert.batchId || "").toLowerCase().includes(searchTerm.toLowerCase());

            const matchesSeverity =
                severityFilter === "ALL" || alert.severity === severityFilter;

            return matchesSearch && matchesSeverity;
        });
    }, [alertData.alerts, searchTerm, severityFilter]);

    if (loading && (!alertData.alerts || alertData.alerts.length === 0)) {
        return (
            <div className="page-loading-skeleton">
                <div className="spinner-industrial"></div>
                <span>Scanning active alarms & telemetry tripwires...</span>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* PAGE HEADER */}
            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-eyebrow">
                        <span>Fault Detection & Safety</span>
                        <span className="eyebrow-divider">/</span>
                        <span>SCADA Alarm Console</span>
                    </div>
                    <h1 className="page-title">Active Alerts & Notifications</h1>
                    <p className="page-subtitle">
                        Automated threshold surveillance across machine thermals, line availability, and quality gates
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchAlerts}
                        title="Poll active alarms"
                    >
                        <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
                        <span>Refresh Alarms</span>
                    </button>
                </div>
            </div>

            {/* SUMMARY KPIS */}
            <div className="kpi-grid">
                <div className="kpi-card" onClick={() => setSeverityFilter("ALL")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">TOTAL ALARMS</span>
                        <div className="kpi-icon-wrapper kpi-icon-navy">
                            <Bell size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">{alertData.totalAlerts}</div>
                        <span className="kpi-hint">Aggregated system events</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setSeverityFilter("Critical")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">CRITICAL SEVERITY</span>
                        <div className="kpi-icon-wrapper kpi-icon-critical">
                            <XCircle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-critical">{alertData.criticalAlerts}</div>
                        <span className="kpi-hint">Requires immediate plant action</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setSeverityFilter("Warning")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">WARNINGS</span>
                        <div className="kpi-icon-wrapper kpi-icon-amber">
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-amber">{alertData.warningAlerts}</div>
                        <span className="kpi-hint">Operating near trip limit</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">FACILITY STATUS</span>
                        <div
                            className={`kpi-icon-wrapper ${
                                alertData.criticalAlerts > 0 ? "kpi-icon-critical" : "kpi-icon-green"
                            }`}
                        >
                            {alertData.criticalAlerts > 0 ? (
                                <AlertTriangle size={16} />
                            ) : (
                                <CheckCircle2 size={16} />
                            )}
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div
                            className={`kpi-value ${
                                alertData.criticalAlerts > 0 ? "text-critical" : "text-running"
                            }`}
                        >
                            {alertData.criticalAlerts > 0 ? "Intervention" : "Optimal"}
                        </div>
                        <span className="kpi-hint">
                            {alertData.criticalAlerts > 0
                                ? "Critical tripwires triggered"
                                : "All monitored nodes nominal"}
                        </span>
                    </div>
                </div>
            </div>

            {/* CONTROLS BAR: SEARCH & SEVERITY FILTER */}
            <div className="table-controls-bar">
                <div className="filter-group-left">
                    <div className="search-input-wrapper">
                        <Search size={15} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search alerts by title, machine, batch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="status-tabs">
                        {["ALL", "Critical", "Warning"].map((sev) => (
                            <button
                                key={sev}
                                className={`status-tab ${severityFilter === sev ? "active" : ""}`}
                                onClick={() => setSeverityFilter(sev)}
                            >
                                {sev === "ALL" ? "All Alarms" : sev}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-secondary text-xs font-mono">
                    Showing {filteredAlerts.length} active alarms
                </div>
            </div>

            {/* ALERTS FEED CONTAINER */}
            <div className="alerts-container">
                {filteredAlerts.length > 0 ? (
                    <div className="alert-list-grid">
                        {filteredAlerts.map((alert, idx) => {
                            const isCritical = alert.severity === "Critical";
                            const machineName =
                                typeof alert.machine === "object"
                                    ? alert.machine?.machineName
                                    : alert.machine;

                            return (
                                <div
                                    key={alert._id || idx}
                                    className={`alert-card-industrial ${
                                        isCritical ? "alert-card-critical" : "alert-card-warning"
                                    }`}
                                >
                                    <div className="alert-card-icon-col">
                                        <div
                                            className={`alert-icon-box ${
                                                isCritical ? "icon-box-critical" : "icon-box-warning"
                                            }`}
                                        >
                                            {isCritical ? (
                                                <XCircle size={18} />
                                            ) : (
                                                <AlertTriangle size={18} />
                                            )}
                                        </div>
                                    </div>

                                    <div className="alert-card-content">
                                        <div className="alert-card-header">
                                            <div className="alert-title-wrap">
                                                <h3 className="alert-title">
                                                    {alert.title || "System Notification"}
                                                </h3>
                                                {alert.type && (
                                                    <span className="alert-type-tag">{alert.type}</span>
                                                )}
                                            </div>

                                            <span
                                                className={`badge ${
                                                    isCritical ? "badge-critical" : "badge-maintenance"
                                                }`}
                                            >
                                                {alert.severity}
                                            </span>
                                        </div>

                                        <p className="alert-description">{alert.message}</p>

                                        <div className="alert-metadata-row">
                                            {machineName && (
                                                <span className="metadata-tag">
                                                    <Cpu size={12} />
                                                    <span>{machineName}</span>
                                                </span>
                                            )}
                                            {alert.batchId && (
                                                <span className="metadata-tag">
                                                    <Package size={12} />
                                                    <span>{alert.batchId}</span>
                                                </span>
                                            )}
                                            {alert.createdAt && (
                                                <span className="metadata-tag metadata-time">
                                                    <Clock size={12} />
                                                    <span>
                                                        {new Date(alert.createdAt).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit"
                                                        })}
                                                    </span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="empty-state-card">
                        <div className="empty-state-icon text-running">
                            <CheckCircle2 size={36} />
                        </div>
                        <h3>Zero Active Alarms</h3>
                        <p>All machinery, paper rolls, and digesters are operating within certified safety margins.</p>
                    </div>
                )}
            </div>

            {/* ALERT RULES & SURVEILLANCE MATRIX */}
            <div className="card mt-4">
                <div className="card-header border-bottom">
                    <div className="card-title-group">
                        <div className="card-tag">SAFETY PROTOCOLS</div>
                        <h2 className="card-title">Telemetry Tripwire Specifications</h2>
                        <p className="card-subtitle">Sensors monitored 24/7 across the mill's SCADA infrastructure</p>
                    </div>
                </div>

                <div className="card-content">
                    <div className="alert-rules-grid">
                        <div className="rule-box rule-box-critical">
                            <div className="rule-icon-row">
                                <Thermometer size={16} className="text-critical" />
                                <span className="rule-severity-pill badge-critical">Critical</span>
                            </div>
                            <h4 className="rule-name">Thermal Threshold Exceeded</h4>
                            <p className="rule-details">Triggers when cylinder or bearing temperature reaches &ge; 85°C.</p>
                        </div>

                        <div className="rule-box rule-box-warning">
                            <div className="rule-icon-row">
                                <Gauge size={16} className="text-amber" />
                                <span className="rule-severity-pill badge-maintenance">Warning</span>
                            </div>
                            <h4 className="rule-name">Depressed Utilization</h4>
                            <p className="rule-details">Triggers when an active running machine falls below 20% throughput.</p>
                        </div>

                        <div className="rule-box rule-box-critical">
                            <div className="rule-icon-row">
                                <ShieldAlert size={16} className="text-critical" />
                                <span className="rule-severity-pill badge-critical">Critical</span>
                            </div>
                            <h4 className="rule-name">Quality Assurance Rejection</h4>
                            <p className="rule-details">Triggers whenever an inspected paper batch receives a FAIL status.</p>
                        </div>

                        <div className="rule-box rule-box-warning">
                            <div className="rule-icon-row">
                                <Wrench size={16} className="text-amber" />
                                <span className="rule-severity-pill badge-maintenance">Warning</span>
                            </div>
                            <h4 className="rule-name">Active Maintenance Intervention</h4>
                            <p className="rule-details">Triggers while technicians are servicing machinery in the shop.</p>
                        </div>

                        <div className="rule-box rule-box-critical">
                            <div className="rule-icon-row">
                                <Clock size={16} className="text-critical" />
                                <span className="rule-severity-pill badge-critical">Critical</span>
                            </div>
                            <h4 className="rule-name">Overdue Preventive Service</h4>
                            <p className="rule-details">Triggers when a scheduled maintenance window passes without completion.</p>
                        </div>

                        <div className="rule-box rule-box-warning">
                            <div className="rule-icon-row">
                                <AlertTriangle size={16} className="text-amber" />
                                <span className="rule-severity-pill badge-maintenance">Warning</span>
                            </div>
                            <h4 className="rule-name">Quality Tolerance Advisory</h4>
                            <p className="rule-details">Triggers when defect density is between 6 and 10 defects per roll.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Alerts;
