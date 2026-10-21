import { useEffect, useState } from "react";
import axios from "axios";

function Alerts() {
    const [alertData, setAlertData] = useState({
        totalAlerts: 0,
        criticalAlerts: 0,
        warningAlerts: 0,
        alerts: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchAlerts = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                "http://localhost:5000/api/alerts"
            );

            setAlertData(response.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load alert data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();

        const interval = setInterval(() => {
            fetchAlerts();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const getAlertClass = (severity) => {
        if (severity === "Critical") {
            return "alert-severity critical";
        }

        return "alert-severity warning";
    };

    const getAlertIcon = (severity) => {
        if (severity === "Critical") {
            return "🚨";
        }

        return "⚠️";
    };

    const formatTime = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading-state">
                    Loading alerts...
                </div>
            </div>
        );
    }

    return (
        <div className="page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Alerts & Notifications</h1>
                    <p>
                        Monitor critical conditions and system warnings
                    </p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={fetchAlerts}
                >
                    ↻ Refresh
                </button>
            </div>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {/* Alert Summary */}
            <div className="summary-grid">

                <div className="summary-card">
                    <div className="summary-card-icon">
                        🔔
                    </div>

                    <div>
                        <span>Total Alerts</span>
                        <strong>{alertData.totalAlerts}</strong>
                    </div>
                </div>

                <div className="summary-card alert-critical-card">
                    <div className="summary-card-icon fail-icon">
                        🚨
                    </div>

                    <div>
                        <span>Critical Alerts</span>
                        <strong>
                            {alertData.criticalAlerts}
                        </strong>
                    </div>
                </div>

                <div className="summary-card alert-warning-card">
                    <div className="summary-card-icon warning-icon">
                        ⚠️
                    </div>

                    <div>
                        <span>Warnings</span>
                        <strong>
                            {alertData.warningAlerts}
                        </strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-card-icon pass-icon">
                        ✓
                    </div>

                    <div>
                        <span>System Status</span>
                        <strong>
                            {alertData.criticalAlerts > 0
                                ? "Attention"
                                : "Normal"}
                        </strong>
                    </div>
                </div>

            </div>

            {/* Alert Section */}
            <div className="section-header">
                <div>
                    <h2>Active Alerts</h2>
                    <p>
                        Automatically generated from machine,
                        quality and maintenance conditions
                    </p>
                </div>
            </div>

            {alertData.alerts.length === 0 ? (
                <div className="empty-state">

                    <div className="empty-icon">
                        ✓
                    </div>

                    <h3>No Active Alerts</h3>

                    <p>
                        All monitored systems are currently operating
                        within normal conditions.
                    </p>

                </div>
            ) : (
                <div className="alerts-list">

                    {alertData.alerts.map((alert, index) => (
                        <div
                            className={`alert-card ${
                                alert.severity === "Critical"
                                    ? "critical-alert"
                                    : "warning-alert"
                            }`}
                            key={alert._id || index}
                        >

                            <div className="alert-icon">
                                {getAlertIcon(alert.severity)}
                            </div>

                            <div className="alert-content">

                                <div className="alert-top-row">

                                    <h3>
                                        {alert.title ||
                                            alert.message ||
                                            "System Alert"}
                                    </h3>

                                    <span
                                        className={getAlertClass(
                                            alert.severity
                                        )}
                                    >
                                        {alert.severity}
                                    </span>

                                </div>

                                <p>
                                    {alert.message}
                                </p>

                                <div className="alert-meta">

                                    {alert.machine && (
                                        <span>
                                            🏭{" "}
                                            {typeof alert.machine ===
                                            "object"
                                                ? alert.machine.machineName
                                                : alert.machine}
                                        </span>
                                    )}

                                    {alert.batchId && (
                                        <span>
                                            📦 {alert.batchId}
                                        </span>
                                    )}

                                    {alert.source && (
                                        <span>
                                            📍 {alert.source}
                                        </span>
                                    )}

                                    {alert.createdAt && (
                                        <span>
                                            🕒{" "}
                                            {formatTime(
                                                alert.createdAt
                                            )}
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            )}

            {/* Alert Rules */}
            <div className="alert-rules">

                <div className="alert-rules-header">
                    <div>
                        <h2>Alert Monitoring Rules</h2>
                        <p>
                            Conditions currently monitored by the system
                        </p>
                    </div>
                </div>

                <div className="alert-rule-grid">

                    <div className="alert-rule critical-rule">
                        <div className="rule-icon">
                            🌡️
                        </div>

                        <div>
                            <strong>High Temperature</strong>
                            <p>
                                Machine temperature ≥ 85°C
                            </p>
                        </div>
                    </div>

                    <div className="alert-rule warning-rule">
                        <div className="rule-icon">
                            📉
                        </div>

                        <div>
                            <strong>Low Utilization</strong>
                            <p>
                                Running machine utilization &lt; 20%
                            </p>
                        </div>
                    </div>

                    <div className="alert-rule critical-rule">
                        <div className="rule-icon">
                            ❌
                        </div>

                        <div>
                            <strong>Quality Failure</strong>
                            <p>
                                Quality inspection status is FAIL
                            </p>
                        </div>
                    </div>

                    <div className="alert-rule warning-rule">
                        <div className="rule-icon">
                            ⚙️
                        </div>

                        <div>
                            <strong>Maintenance Activity</strong>
                            <p>
                                Machine is under maintenance
                            </p>
                        </div>
                    </div>

                    <div className="alert-rule critical-rule">
                        <div className="rule-icon">
                            ⏰
                        </div>

                        <div>
                            <strong>Overdue Maintenance</strong>
                            <p>
                                Maintenance status is Overdue
                            </p>
                        </div>
                    </div>

                    <div className="alert-rule warning-rule">
                        <div className="rule-icon">
                            ⚠️
                        </div>

                        <div>
                            <strong>Quality Warning</strong>
                            <p>
                                Quality inspection status is WARNING
                            </p>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Alerts;