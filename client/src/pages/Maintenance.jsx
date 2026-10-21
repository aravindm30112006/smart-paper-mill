import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Wrench,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    Check,
    Search,
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle2,
    Cpu,
    User,
    FileText
} from "lucide-react";

function Maintenance() {
    const [maintenance, setMaintenance] = useState([]);
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        machine: "",
        maintenanceType: "Preventive",
        description: "",
        scheduledDate: "",
        completedDate: "",
        technician: "",
        status: "Scheduled"
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const [maintenanceRes, machinesRes] = await Promise.all([
                axios.get("http://localhost:5000/api/maintenance"),
                axios.get("http://localhost:5000/api/machines")
            ]);

            setMaintenance(maintenanceRes.data || []);
            setMachines(machinesRes.data || []);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load maintenance records.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const getMachineId = (machine) => {
        if (!machine) return "";
        return typeof machine === "object" ? machine._id : machine;
    };

    const handleEdit = (item) => {
        setEditingId(item._id);

        setFormData({
            machine: getMachineId(item.machine),
            maintenanceType: item.maintenanceType || "Preventive",
            description: item.description || "",
            scheduledDate: item.scheduledDate
                ? item.scheduledDate.substring(0, 10)
                : "",
            completedDate: item.completedDate
                ? item.completedDate.substring(0, 10)
                : "",
            technician: item.technician || "",
            status: item.status || "Scheduled"
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({
            machine: "",
            maintenanceType: "Preventive",
            description: "",
            scheduledDate: "",
            completedDate: "",
            technician: "",
            status: "Scheduled"
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `http://localhost:5000/api/maintenance/${editingId}`,
                {
                    ...formData,
                    completedDate: formData.completedDate || null
                }
            );

            cancelEdit();
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to update maintenance record.");
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this maintenance record?"
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/maintenance/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to delete maintenance record.");
        }
    };

    const getMachineName = (machine) => {
        if (!machine) return "Unassigned Machine";
        if (typeof machine === "object") {
            return machine.machineName || "Unassigned Machine";
        }
        const found = machines.find((m) => m._id === machine);
        return found ? found.machineName : "Unassigned Machine";
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "Scheduled":
                return <span className="badge badge-info">Scheduled</span>;
            case "In Progress":
                return <span className="badge badge-maintenance">In Progress</span>;
            case "Completed":
                return (
                    <span className="badge badge-running">
                        <CheckCircle2 size={11} />
                        Completed
                    </span>
                );
            case "Overdue":
                return (
                    <span className="badge badge-critical">
                        <AlertTriangle size={11} />
                        Overdue
                    </span>
                );
            default:
                return <span className="badge badge-idle">{status}</span>;
        }
    };

    // Summary counts
    const scheduledCount = maintenance.filter((i) => i.status === "Scheduled").length;
    const inProgressCount = maintenance.filter((i) => i.status === "In Progress").length;
    const completedCount = maintenance.filter((i) => i.status === "Completed").length;
    const overdueCount = maintenance.filter((i) => i.status === "Overdue").length;

    // Filter logic
    const filteredMaintenance = useMemo(() => {
        return maintenance.filter((item) => {
            const mName = getMachineName(item.machine);
            const matchesSearch =
                mName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.technician?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.maintenanceType?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "ALL" || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [maintenance, machines, searchTerm, statusFilter]);

    if (loading && maintenance.length === 0) {
        return (
            <div className="page-loading-skeleton">
                <div className="spinner-industrial"></div>
                <span>Checking maintenance schedules...</span>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* PAGE HEADER */}
            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-eyebrow">
                        <span>Plant Reliability</span>
                        <span className="eyebrow-divider">/</span>
                        <span>Equipment Maintenance</span>
                    </div>
                    <h1 className="page-title">Maintenance & Work Orders</h1>
                    <p className="page-subtitle">
                        Preventive maintenance calendars, emergency technician work orders, and historical logs
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchData}
                        title="Reload work orders"
                    >
                        <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
                        <span>Refresh</span>
                    </button>
                    <Link to="/add-maintenance" className="btn btn-primary">
                        <Plus size={16} />
                        <span>Schedule Service</span>
                    </Link>
                </div>
            </div>

            {/* SUMMARY KPIS */}
            <div className="kpi-grid">
                <div className="kpi-card" onClick={() => setStatusFilter("ALL")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">TOTAL ORDERS</span>
                        <div className="kpi-icon-wrapper kpi-icon-navy">
                            <Wrench size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">{maintenance.length}</div>
                        <span className="kpi-hint">Logged maintenance tickets</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("Scheduled")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">SCHEDULED</span>
                        <div className="kpi-icon-wrapper kpi-icon-blue">
                            <Calendar size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-blue">{scheduledCount}</div>
                        <span className="kpi-hint">Upcoming planned shutdowns</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("In Progress")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">IN PROGRESS</span>
                        <div className="kpi-icon-wrapper kpi-icon-amber">
                            <Clock size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-amber">{inProgressCount}</div>
                        <span className="kpi-hint">Currently on shop floor</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("Overdue")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">OVERDUE TICKETS</span>
                        <div className="kpi-icon-wrapper kpi-icon-critical">
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-critical">{overdueCount}</div>
                        <span className="kpi-hint">Requires immediate dispatch</span>
                    </div>
                </div>
            </div>

            {/* EDIT DRAWER / FORM */}
            {editingId && (
                <div className="edit-banner-card">
                    <div className="edit-banner-header">
                        <div className="edit-banner-title-group">
                            <div className="edit-banner-tag">EDIT WORK ORDER</div>
                            <h3>Update Maintenance Record</h3>
                            <p>Modify service dates, assigned technician, or task completion status</p>
                        </div>
                        <button className="btn-icon" onClick={cancelEdit} title="Cancel">
                            <X size={18} />
                        </button>
                    </div>

                    <form className="form-grid" onSubmit={handleUpdate}>
                        <div className="form-field">
                            <label className="form-label">Target Machine</label>
                            <select
                                className="form-select"
                                name="machine"
                                value={formData.machine}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Machine...</option>
                                {machines.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.machineName} ({m.productionLine})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Maintenance Classification</label>
                            <select
                                className="form-select"
                                name="maintenanceType"
                                value={formData.maintenanceType}
                                onChange={handleChange}
                                required
                            >
                                <option value="Preventive">Preventive Maintenance</option>
                                <option value="Corrective">Corrective Repair</option>
                                <option value="Emergency">Emergency Shutdown</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Scheduled Date</label>
                            <input
                                className="form-input"
                                type="date"
                                name="scheduledDate"
                                value={formData.scheduledDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Completion Date (optional)</label>
                            <input
                                className="form-input"
                                type="date"
                                name="completedDate"
                                value={formData.completedDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Lead Technician</label>
                            <input
                                className="form-input"
                                type="text"
                                name="technician"
                                value={formData.technician}
                                onChange={handleChange}
                                placeholder="Technician name"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Order Status</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Scheduled">Scheduled</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>

                        <div className="form-field form-field-full">
                            <label className="form-label">Work Scope & Procedure Description</label>
                            <textarea
                                className="form-textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Detail parts replaced, lubricants applied, or inspections conducted..."
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

            {/* CONTROLS BAR: SEARCH & STATUS FILTER */}
            <div className="table-controls-bar">
                <div className="filter-group-left">
                    <div className="search-input-wrapper">
                        <Search size={15} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by machine, technician, or description..."
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
                        {["ALL", "Scheduled", "In Progress", "Completed", "Overdue"].map((st) => (
                            <button
                                key={st}
                                className={`status-tab ${statusFilter === st ? "active" : ""}`}
                                onClick={() => setStatusFilter(st)}
                            >
                                {st === "ALL" ? "All Tickets" : st}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-secondary text-xs font-mono">
                    Showing {filteredMaintenance.length} of {maintenance.length} orders
                </div>
            </div>

            {/* MAINTENANCE TABLE */}
            <div className="table-wrapper">
                {filteredMaintenance.length > 0 ? (
                    <table className="enterprise-table">
                        <thead>
                            <tr>
                                <th>Target Machine</th>
                                <th>Service Type</th>
                                <th>Scope Description</th>
                                <th>Scheduled</th>
                                <th>Completed</th>
                                <th>Technician</th>
                                <th>Status</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMaintenance.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="table-entity">
                                            <div className="entity-icon entity-icon-navy">
                                                <Cpu size={13} />
                                            </div>
                                            <span className="font-semibold text-primary">
                                                {getMachineName(item.machine)}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-idle">
                                            {item.maintenanceType}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-secondary text-truncate max-w-xs" title={item.description}>
                                            {item.description}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-secondary font-mono text-xs">
                                            {item.scheduledDate
                                                ? new Date(item.scheduledDate).toLocaleDateString("en-IN", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric"
                                                  })
                                                : "-"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-secondary font-mono text-xs">
                                            {item.completedDate
                                                ? new Date(item.completedDate).toLocaleDateString("en-IN", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric"
                                                  })
                                                : "—"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="inline-flex items-center gap-1 text-secondary text-xs">
                                            <User size={12} className="text-muted" />
                                            {item.technician || "Unassigned"}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(item.status)}</td>
                                    <td>
                                        <div className="table-actions-end">
                                            <button
                                                className="btn-table-action"
                                                onClick={() => handleEdit(item)}
                                                title="Edit order"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="btn-table-action text-critical"
                                                onClick={() => handleDelete(item._id)}
                                                title="Delete order"
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
                            <Wrench size={32} />
                        </div>
                        <h3>No Maintenance Records Found</h3>
                        <p>No work orders match the current filter or search criteria.</p>
                        <Link to="/add-maintenance" className="btn btn-primary">
                            <Plus size={16} />
                            <span>Schedule Maintenance</span>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Maintenance;
