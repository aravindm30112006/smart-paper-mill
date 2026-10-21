import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Activity,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    Check,
    Search,
    LayoutGrid,
    List,
    Gauge,
    Thermometer,
    Clock,
    Layers,
    Cpu,
    AlertTriangle,
    Power
} from "lucide-react";

function Machines() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'table'

    const [editingMachine, setEditingMachine] = useState(null);

    const [formData, setFormData] = useState({
        machineName: "",
        productionLine: "",
        status: "Idle",
        temperature: "",
        utilization: "",
        operatingHours: ""
    });

    const fetchMachines = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/machines"
            );

            setMachines(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load machine data. Check server connectivity.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    const startEdit = (machine) => {
        setEditingMachine(machine._id);

        setFormData({
            machineName: machine.machineName,
            productionLine: machine.productionLine,
            status: machine.status,
            temperature: machine.temperature,
            utilization: machine.utilization,
            operatingHours: machine.operatingHours
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const cancelEdit = () => {
        setEditingMachine(null);

        setFormData({
            machineName: "",
            productionLine: "",
            status: "Idle",
            temperature: "",
            utilization: "",
            operatingHours: ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const updateMachine = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `http://localhost:5000/api/machines/${editingMachine}`,
                {
                    ...formData,
                    temperature: Number(formData.temperature),
                    utilization: Number(formData.utilization),
                    operatingHours: Number(formData.operatingHours)
                }
            );

            cancelEdit();
            fetchMachines();
        } catch (err) {
            console.error(err);
            alert("Failed to update machine. " + (err.response?.data?.message || ""));
        }
    };

    const deleteMachine = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this machine? This action cannot be undone."
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/machines/${id}`
            );

            fetchMachines();
        } catch (err) {
            console.error(err);
            alert("Failed to delete machine.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Running":
                return (
                    <span className="badge badge-running">
                        <span className="status-dot-pulse"></span>
                        Running
                    </span>
                );
            case "Maintenance":
                return (
                    <span className="badge badge-maintenance">
                        <span className="status-dot"></span>
                        Maintenance
                    </span>
                );
            case "Offline":
                return (
                    <span className="badge badge-offline">
                        <span className="status-dot"></span>
                        Offline
                    </span>
                );
            default:
                return (
                    <span className="badge badge-idle">
                        <span className="status-dot"></span>
                        {status || "Idle"}
                    </span>
                );
        }
    };

    // Filter logic
    const filteredMachines = machines.filter((machine) => {
        const matchesSearch =
            machine.machineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            machine.productionLine?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "ALL" || machine.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const runningCount = machines.filter((m) => m.status === "Running").length;
    const maintenanceCount = machines.filter((m) => m.status === "Maintenance").length;
    const idleCount = machines.filter((m) => m.status === "Idle").length;
    const offlineCount = machines.filter((m) => m.status === "Offline").length;

    if (loading && machines.length === 0) {
        return (
            <div className="page-loading-skeleton">
                <div className="spinner-industrial"></div>
                <span>Polling telemetry data...</span>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* PAGE HEADER */}
            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-eyebrow">
                        <span>Monitoring & Telemetry</span>
                        <span className="eyebrow-divider">/</span>
                        <span>Equipment</span>
                    </div>
                    <h1 className="page-title">Machines & Production Lines</h1>
                    <p className="page-subtitle">
                        Real-time telemetry, thermal profiles, and utilization tracking across paper mill lines
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchMachines}
                        title="Reload machine states"
                    >
                        <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
                        <span>Refresh</span>
                    </button>
                    <Link to="/add-machine" className="btn btn-primary">
                        <Plus size={16} />
                        <span>Add Machine</span>
                    </Link>
                </div>
            </div>

            {/* SUMMARY KPIS */}
            <div className="kpi-grid">
                <div className="kpi-card" onClick={() => setStatusFilter("ALL")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">TOTAL UNITS</span>
                        <div className="kpi-icon-wrapper kpi-icon-navy">
                            <Cpu size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">{machines.length}</div>
                        <span className="kpi-hint">Configured plant machinery</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("Running")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">ACTIVE / RUNNING</span>
                        <div className="kpi-icon-wrapper kpi-icon-green">
                            <Activity size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-running">{runningCount}</div>
                        <span className="kpi-hint">
                            {machines.length > 0 ? `${Math.round((runningCount / machines.length) * 100)}% online capacity` : "0%"}
                        </span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("Maintenance")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">UNDER MAINTENANCE</span>
                        <div className="kpi-icon-wrapper kpi-icon-amber">
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-maintenance">{maintenanceCount}</div>
                        <span className="kpi-hint">Scheduled or emergency service</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("Idle")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">STANDBY / IDLE</span>
                        <div className="kpi-icon-wrapper kpi-icon-gray">
                            <Power size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-idle">{idleCount + offlineCount}</div>
                        <span className="kpi-hint">Ready for next production shift</span>
                    </div>
                </div>
            </div>

            {/* EDIT DRAWER / FORM */}
            {editingMachine && (
                <div className="edit-banner-card">
                    <div className="edit-banner-header">
                        <div className="edit-banner-title-group">
                            <div className="edit-banner-tag">EDIT MODE</div>
                            <h3>Configure Machine Parameters</h3>
                            <p>Update line assignment, status, operating temperatures and targets</p>
                        </div>
                        <button className="btn-icon" onClick={cancelEdit} title="Cancel editing">
                            <X size={18} />
                        </button>
                    </div>

                    <form className="form-grid" onSubmit={updateMachine}>
                        <div className="form-field">
                            <label className="form-label">Machine Name</label>
                            <input
                                className="form-input"
                                type="text"
                                name="machineName"
                                value={formData.machineName}
                                onChange={handleChange}
                                placeholder="e.g. Paper Machine 01"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Production Line</label>
                            <input
                                className="form-input"
                                type="text"
                                name="productionLine"
                                value={formData.productionLine}
                                onChange={handleChange}
                                placeholder="e.g. Production Line A"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Current Status</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Running">Running</option>
                                <option value="Idle">Idle</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Operating Temperature (°C)</label>
                            <input
                                className="form-input"
                                type="number"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                placeholder="e.g. 72"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Utilization Rate (%)</label>
                            <input
                                className="form-input"
                                type="number"
                                name="utilization"
                                min="0"
                                max="100"
                                value={formData.utilization}
                                onChange={handleChange}
                                placeholder="0 - 100"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Accumulated Hours (h)</label>
                            <input
                                className="form-input"
                                type="number"
                                name="operatingHours"
                                value={formData.operatingHours}
                                onChange={handleChange}
                                placeholder="e.g. 1240"
                                required
                            />
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

            {/* ERROR NOTIFICATION */}
            {error && (
                <div className="alert-banner alert-banner-critical">
                    <AlertTriangle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* CONTROLS BAR: SEARCH, FILTER, VIEW SWITCH */}
            <div className="table-controls-bar">
                <div className="filter-group-left">
                    <div className="search-input-wrapper">
                        <Search size={15} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Filter by machine or line..."
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
                        {["ALL", "Running", "Maintenance", "Idle"].map((st) => (
                            <button
                                key={st}
                                className={`status-tab ${statusFilter === st ? "active" : ""}`}
                                onClick={() => setStatusFilter(st)}
                            >
                                {st === "ALL" ? "All Units" : st}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="view-switch-group">
                    <button
                        className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                        onClick={() => setViewMode("grid")}
                        title="Grid View"
                    >
                        <LayoutGrid size={16} />
                    </button>
                    <button
                        className={`view-btn ${viewMode === "table" ? "active" : ""}`}
                        onClick={() => setViewMode("table")}
                        title="Table View"
                    >
                        <List size={16} />
                    </button>
                </div>
            </div>

            {/* MACHINE CARDS GRID */}
            {viewMode === "grid" ? (
                <div className="machine-grid">
                    {filteredMachines.map((machine) => {
                        const tempVal = Number(machine.temperature || 0);
                        const isHot = tempVal >= 85;
                        const utilVal = Math.min(Math.max(Number(machine.utilization || 0), 0), 100);

                        return (
                            <div className="machine-card" key={machine._id}>
                                <div className="machine-card-header">
                                    <div className="machine-card-title-wrap">
                                        <div className="machine-avatar">
                                            <Cpu size={18} />
                                        </div>
                                        <div>
                                            <h3 className="machine-card-name">{machine.machineName}</h3>
                                            <span className="machine-card-line">
                                                <Layers size={12} />
                                                {machine.productionLine}
                                            </span>
                                        </div>
                                    </div>
                                    {getStatusBadge(machine.status)}
                                </div>

                                <div className="machine-telemetry-grid">
                                    <div className="telemetry-item">
                                        <div className="telemetry-label">
                                            <Thermometer size={13} className={isHot ? "text-critical" : ""} />
                                            <span>Temperature</span>
                                        </div>
                                        <div className={`telemetry-val ${isHot ? "text-critical" : ""}`}>
                                            {machine.temperature}°C
                                        </div>
                                    </div>

                                    <div className="telemetry-item">
                                        <div className="telemetry-label">
                                            <Gauge size={13} />
                                            <span>Efficiency</span>
                                        </div>
                                        <div className="telemetry-val">
                                            {machine.utilization}%
                                        </div>
                                    </div>

                                    <div className="telemetry-item">
                                        <div className="telemetry-label">
                                            <Clock size={13} />
                                            <span>Runtime</span>
                                        </div>
                                        <div className="telemetry-val">
                                            {Number(machine.operatingHours || 0).toLocaleString()} h
                                        </div>
                                    </div>
                                </div>

                                <div className="utilization-meter-block">
                                    <div className="utilization-meter-header">
                                        <span className="meter-label">Active Utilization</span>
                                        <span className="meter-value">{utilVal}%</span>
                                    </div>
                                    <div className="meter-track">
                                        <div
                                            className={`meter-fill ${
                                                utilVal > 80 ? "fill-optimal" : utilVal > 40 ? "fill-normal" : "fill-low"
                                            }`}
                                            style={{ width: `${utilVal}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="card-actions-footer">
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => startEdit(machine)}
                                    >
                                        <Pencil size={13} />
                                        <span>Edit</span>
                                    </button>
                                    <button
                                        className="btn btn-destructive-ghost btn-sm"
                                        onClick={() => deleteMachine(machine._id)}
                                        title="Delete machine"
                                    >
                                        <Trash2 size={13} />
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* ENTERPRISE TABLE VIEW */
                <div className="table-wrapper">
                    <table className="enterprise-table">
                        <thead>
                            <tr>
                                <th>Machine Name</th>
                                <th>Production Line</th>
                                <th>Status</th>
                                <th>Temperature</th>
                                <th>Utilization</th>
                                <th>Operating Hours</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMachines.map((machine) => {
                                const isHot = Number(machine.temperature || 0) >= 85;
                                return (
                                    <tr key={machine._id}>
                                        <td>
                                            <div className="table-entity">
                                                <div className="entity-icon">
                                                    <Cpu size={14} />
                                                </div>
                                                <span className="font-semibold text-primary">{machine.machineName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-secondary">{machine.productionLine}</span>
                                        </td>
                                        <td>{getStatusBadge(machine.status)}</td>
                                        <td>
                                            <span className={`inline-flex items-center gap-1 font-mono ${isHot ? "text-critical font-semibold" : "text-secondary"}`}>
                                                <Thermometer size={13} />
                                                {machine.temperature}°C
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-util-cell">
                                                <div className="table-meter-track">
                                                    <div
                                                        className="table-meter-fill"
                                                        style={{ width: `${Math.min(machine.utilization || 0, 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-mono">{machine.utilization}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="font-mono text-secondary">
                                                {Number(machine.operatingHours || 0).toLocaleString()} h
                                            </span>
                                        </td>
                                        <td>
                                            <div className="table-actions-end">
                                                <button
                                                    className="btn-table-action"
                                                    onClick={() => startEdit(machine)}
                                                    title="Edit configuration"
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    className="btn-table-action text-critical"
                                                    onClick={() => deleteMachine(machine._id)}
                                                    title="Delete machine"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* EMPTY STATE */}
            {filteredMachines.length === 0 && (
                <div className="empty-state-card">
                    <div className="empty-state-icon">
                        <Cpu size={32} />
                    </div>
                    <h3>No Machines Found</h3>
                    <p>
                        {searchTerm || statusFilter !== "ALL"
                            ? "No machines matched your current filter criteria."
                            : "No industrial machines are currently registered in the database."}
                    </p>
                    {searchTerm || statusFilter !== "ALL" ? (
                        <button
                            className="btn btn-secondary"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("ALL");
                            }}
                        >
                            Reset Filters
                        </button>
                    ) : (
                        <Link to="/add-machine" className="btn btn-primary">
                            <Plus size={16} />
                            <span>Add New Machine</span>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}

export default Machines;
