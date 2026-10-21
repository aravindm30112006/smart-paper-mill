import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Droplets,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    Check,
    Search,
    Thermometer,
    Gauge,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Sparkles,
    Sliders
} from "lucide-react";

function Pulp() {
    const [pulpData, setPulpData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [editingPulp, setEditingPulp] = useState(null);

    const [formData, setFormData] = useState({
        batchId: "",
        temperature: "",
        pressure: "",
        moisture: "",
        ph: "",
        flowRate: "",
        status: "Normal"
    });

    const fetchPulpData = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("http://localhost:5000/api/pulp");
            setPulpData(response.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load pulp monitoring data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPulpData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const startEdit = (item) => {
        setEditingPulp(item._id);

        setFormData({
            batchId: item.batchId || "",
            temperature: item.temperature ?? "",
            pressure: item.pressure ?? "",
            moisture: item.moisture ?? "",
            ph: item.ph ?? "",
            flowRate: item.flowRate ?? "",
            status: item.status || "Normal"
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const cancelEdit = () => {
        setEditingPulp(null);
        setFormData({
            batchId: "",
            temperature: "",
            pressure: "",
            moisture: "",
            ph: "",
            flowRate: "",
            status: "Normal"
        });
    };

    const updatePulp = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:5000/api/pulp/${editingPulp}`, {
                batchId: formData.batchId,
                temperature: Number(formData.temperature),
                pressure: Number(formData.pressure),
                moisture: Number(formData.moisture),
                ph: Number(formData.ph),
                flowRate: Number(formData.flowRate),
                status: formData.status
            });

            cancelEdit();
            fetchPulpData();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update pulp data.");
        }
    };

    const deletePulp = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this pulp record?"
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/pulp/${id}`);
            fetchPulpData();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete pulp data.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Normal":
                return (
                    <span className="badge badge-running">
                        <CheckCircle2 size={11} />
                        Normal
                    </span>
                );
            case "Warning":
                return (
                    <span className="badge badge-maintenance">
                        <AlertTriangle size={11} />
                        Warning
                    </span>
                );
            case "Critical":
                return (
                    <span className="badge badge-critical">
                        <AlertTriangle size={11} />
                        Critical
                    </span>
                );
            default:
                return <span className="badge badge-idle">{status}</span>;
        }
    };

    // Summary calculations
    const normalCount = pulpData.filter((i) => i.status === "Normal").length;
    const warningCount = pulpData.filter((i) => i.status === "Warning").length;
    const criticalCount = pulpData.filter((i) => i.status === "Critical").length;
    const latestRecord = pulpData.length > 0 ? pulpData[0] : null;

    // Filter logic
    const filteredPulp = useMemo(() => {
        return pulpData.filter((item) => {
            const matchesSearch = item.batchId
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "ALL" || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [pulpData, searchTerm, statusFilter]);

    if (loading && pulpData.length === 0) {
        return (
            <div className="page-loading-skeleton">
                <div className="spinner-industrial"></div>
                <span>Sampling pulp sensors & telemetry...</span>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* PAGE HEADER */}
            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-eyebrow">
                        <span>Chemical Process</span>
                        <span className="eyebrow-divider">/</span>
                        <span>Digestion & Refining</span>
                    </div>
                    <h1 className="page-title">Pulp Monitoring</h1>
                    <p className="page-subtitle">
                        Continuous telemetry for slurry temperature, hydraulic pressure, moisture, pH balance, and flow rate
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchPulpData}
                        title="Refresh pulp readings"
                    >
                        <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
                        <span>Refresh</span>
                    </button>
                    <Link to="/add-pulp" className="btn btn-primary">
                        <Plus size={16} />
                        <span>Log Reading</span>
                    </Link>
                </div>
            </div>

            {/* SUMMARY KPIS */}
            <div className="kpi-grid">
                <div className="kpi-card" onClick={() => setStatusFilter("ALL")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">TOTAL READINGS</span>
                        <div className="kpi-icon-wrapper kpi-icon-navy">
                            <Droplets size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">{pulpData.length}</div>
                        <span className="kpi-hint">Digester log points</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("Normal")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">NORMAL CONDITIONS</span>
                        <div className="kpi-icon-wrapper kpi-icon-green">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-running">{normalCount}</div>
                        <span className="kpi-hint">Within optimal tolerance</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("Warning")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">SUB-OPTIMAL WARNINGS</span>
                        <div className="kpi-icon-wrapper kpi-icon-amber">
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-amber">{warningCount}</div>
                        <span className="kpi-hint">Requires titration or flow adjust</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("Critical")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">CRITICAL PROCESS EXCURSIONS</span>
                        <div className="kpi-icon-wrapper kpi-icon-critical">
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-critical">{criticalCount}</div>
                        <span className="kpi-hint">Immediate operator intervention</span>
                    </div>
                </div>
            </div>

            {/* LATEST READING SPOTLIGHT CARD */}
            {latestRecord && (
                <div className="card spotlight-card">
                    <div className="card-header border-bottom">
                        <div className="card-title-group">
                            <div className="card-tag">LIVE PROCESS INLINE</div>
                            <h2 className="card-title">Latest Pulp Reading: {latestRecord.batchId}</h2>
                            <p className="card-subtitle">
                                Recorded at {latestRecord.recordedAt ? new Date(latestRecord.recordedAt).toLocaleString("en-IN") : "Recent"}
                            </p>
                        </div>
                        {getStatusBadge(latestRecord.status)}
                    </div>

                    <div className="card-content">
                        <div className="spotlight-metric-grid">
                            <div className="spotlight-metric-item">
                                <span className="metric-header-label">
                                    <Thermometer size={14} className="text-muted" />
                                    <span>Temperature</span>
                                </span>
                                <div className="metric-primary-val">{latestRecord.temperature}°C</div>
                                <span className="metric-sub-val">Ideal: 65°C – 75°C</span>
                            </div>

                            <div className="spotlight-metric-item">
                                <span className="metric-header-label">
                                    <Gauge size={14} className="text-muted" />
                                    <span>Pressure</span>
                                </span>
                                <div className="metric-primary-val">{latestRecord.pressure} bar</div>
                                <span className="metric-sub-val">Tolerance: 3.5 – 5.0 bar</span>
                            </div>

                            <div className="spotlight-metric-item">
                                <span className="metric-header-label">
                                    <Droplets size={14} className="text-muted" />
                                    <span>Moisture</span>
                                </span>
                                <div className="metric-primary-val">{latestRecord.moisture}%</div>
                                <span className="metric-sub-val">Refiner Target: 5.5% – 7.0%</span>
                            </div>

                            <div className="spotlight-metric-item">
                                <span className="metric-header-label">
                                    <Sparkles size={14} className="text-muted" />
                                    <span>pH Level</span>
                                </span>
                                <div className="metric-primary-val">{latestRecord.ph}</div>
                                <span className="metric-sub-val">Neutral: 6.8 – 7.4</span>
                            </div>

                            <div className="spotlight-metric-item">
                                <span className="metric-header-label">
                                    <Activity size={14} className="text-muted" />
                                    <span>Slurry Flow Rate</span>
                                </span>
                                <div className="metric-primary-val">{latestRecord.flowRate}</div>
                                <span className="metric-sub-val">Liters / min</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT DRAWER / FORM */}
            {editingPulp && (
                <div className="edit-banner-card">
                    <div className="edit-banner-header">
                        <div className="edit-banner-title-group">
                            <div className="edit-banner-tag">EDIT PULP DATA</div>
                            <h3>Modify Process Reading: {formData.batchId}</h3>
                            <p>Correct sensor measurements, pH level or operating state</p>
                        </div>
                        <button className="btn-icon" onClick={cancelEdit} title="Cancel">
                            <X size={18} />
                        </button>
                    </div>

                    <form className="form-grid" onSubmit={updatePulp}>
                        <div className="form-field">
                            <label className="form-label">Batch ID</label>
                            <input
                                className="form-input"
                                type="text"
                                name="batchId"
                                value={formData.batchId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Temperature (°C)</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Pressure (bar)</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                name="pressure"
                                value={formData.pressure}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Moisture (%)</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                name="moisture"
                                value={formData.moisture}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">pH Level (0–14)</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                min="0"
                                max="14"
                                name="ph"
                                value={formData.ph}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Flow Rate (L/min)</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                name="flowRate"
                                value={formData.flowRate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Process State</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Normal">Normal</option>
                                <option value="Warning">Warning</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>

                        <div className="form-actions-full">
                            <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <Check size={16} />
                                <span>Save Changes</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* CONTROLS BAR: SEARCH & STATUS FILTER */}
            <div className="table-controls-bar">
                <div className="filter-group-left">
                    <div className="search-input-wrapper">
                        <Search size={15} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by batch ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button className="search-clear" onClick={() => setSearchTerm("")}>
                                <X size={13} />
                            </button>
                        )}
                    </div>

                    <div className="status-tabs">
                        {["ALL", "Normal", "Warning", "Critical"].map((st) => (
                            <button
                                key={st}
                                className={`status-tab ${statusFilter === st ? "active" : ""}`}
                                onClick={() => setStatusFilter(st)}
                            >
                                {st === "ALL" ? "All Readings" : st}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-secondary text-xs font-mono">
                    Showing {filteredPulp.length} of {pulpData.length} records
                </div>
            </div>

            {/* PULP TABLE */}
            <div className="table-wrapper">
                {filteredPulp.length > 0 ? (
                    <table className="enterprise-table">
                        <thead>
                            <tr>
                                <th>Batch ID</th>
                                <th>Temperature</th>
                                <th>Pressure</th>
                                <th>Moisture</th>
                                <th>pH</th>
                                <th>Flow Rate</th>
                                <th>Status</th>
                                <th>Timestamp</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPulp.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <span className="font-mono font-semibold text-primary">
                                            {item.batchId}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-secondary">
                                            {item.temperature}°C
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-secondary">
                                            {item.pressure} bar
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-secondary">
                                            {item.moisture}%
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-secondary">
                                            {item.ph}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-secondary">
                                            {item.flowRate} L/min
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td>
                                        <span className="text-secondary font-mono text-xs">
                                            {item.recordedAt
                                                ? new Date(item.recordedAt).toLocaleString("en-IN", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      hour: "2-digit",
                                                      minute: "2-digit"
                                                  })
                                                : "-"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions-end">
                                            <button
                                                className="btn-table-action"
                                                onClick={() => startEdit(item)}
                                                title="Edit record"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="btn-table-action text-critical"
                                                onClick={() => deletePulp(item._id)}
                                                title="Delete record"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state-card">
                        <div className="empty-state-icon">
                            <Droplets size={32} />
                        </div>
                        <h3>No Pulp Readings Found</h3>
                        <p>No chemical sensor data recorded matching current filter parameters.</p>
                        <Link to="/add-pulp" className="btn btn-primary">
                            <Plus size={16} />
                            <span>Log New Reading</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Pulp;
