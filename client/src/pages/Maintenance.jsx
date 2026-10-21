import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Maintenance() {
    const [maintenance, setMaintenance] = useState([]);
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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

            setMaintenance(maintenanceRes.data);
            setMachines(machinesRes.data);
            setError("");
        } catch (err) {
            console.error(err);
            setError("Unable to load maintenance data.");
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
            await axios.delete(
                `http://localhost:5000/api/maintenance/${id}`
            );

            fetchData();
        } catch (err) {
            console.error(err);
            alert("Failed to delete maintenance record.");
        }
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getMachineName = (machine) => {
        if (!machine) return "Unknown";

        if (typeof machine === "object") {
            return machine.machineName || "Unknown";
        }

        const foundMachine = machines.find(
            (m) => m._id === machine
        );

        return foundMachine
            ? foundMachine.machineName
            : "Unknown";
    };

    const scheduledCount = maintenance.filter(
        (item) => item.status === "Scheduled"
    ).length;

    const inProgressCount = maintenance.filter(
        (item) => item.status === "In Progress"
    ).length;

    const completedCount = maintenance.filter(
        (item) => item.status === "Completed"
    ).length;

    const overdueCount = maintenance.filter(
        (item) => item.status === "Overdue"
    ).length;

    const getStatusClass = (status) => {
        switch (status) {
            case "Scheduled":
                return "maintenance-status maintenance-scheduled";

            case "In Progress":
                return "maintenance-status maintenance-in-progress";

            case "Completed":
                return "maintenance-status maintenance-completed";

            case "Overdue":
                return "maintenance-status maintenance-overdue";

            default:
                return "maintenance-status";
        }
    };

    if (loading) {
        return (
            <div className="page">
                <div className="loading-state">
                    Loading maintenance data...
                </div>
            </div>
        );
    }

    return (
        <div className="page">

            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1>Maintenance</h1>
                    <p>
                        Schedule and monitor machine maintenance activities
                    </p>
                </div>

                <Link
                    to="/add-maintenance"
                    className="primary-btn"
                >
                    + Add Maintenance
                </Link>
            </div>

            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div className="summary-grid">

                <div className="summary-card">
                    <div className="summary-card-icon">
                        🔧
                    </div>

                    <div>
                        <span>Total Maintenance</span>
                        <strong>{maintenance.length}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-card-icon">
                        📅
                    </div>

                    <div>
                        <span>Scheduled</span>
                        <strong>{scheduledCount}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-card-icon warning-icon">
                        ⚙️
                    </div>

                    <div>
                        <span>In Progress</span>
                        <strong>{inProgressCount}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-card-icon pass-icon">
                        ✓
                    </div>

                    <div>
                        <span>Completed</span>
                        <strong>{completedCount}</strong>
                    </div>
                </div>

                <div className="summary-card">
                    <div className="summary-card-icon fail-icon">
                        !
                    </div>

                    <div>
                        <span>Overdue</span>
                        <strong>{overdueCount}</strong>
                    </div>
                </div>

            </div>

            {/* Edit Panel */}
            {editingId && (
                <div className="edit-panel">

                    <div className="section-header">
                        <div>
                            <h2>Edit Maintenance</h2>
                            <p>
                                Update maintenance schedule and status
                            </p>
                        </div>

                        <button
                            className="secondary-btn"
                            onClick={cancelEdit}
                        >
                            Cancel
                        </button>
                    </div>

                    <form
                        className="form-grid"
                        onSubmit={handleUpdate}
                    >

                        <div className="form-group">
                            <label>Machine</label>

                            <select
                                name="machine"
                                value={formData.machine}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select Machine
                                </option>

                                {machines.map((machine) => (
                                    <option
                                        key={machine._id}
                                        value={machine._id}
                                    >
                                        {machine.machineName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Maintenance Type</label>

                            <select
                                name="maintenanceType"
                                value={formData.maintenanceType}
                                onChange={handleChange}
                                required
                            >
                                <option value="Preventive">
                                    Preventive
                                </option>

                                <option value="Corrective">
                                    Corrective
                                </option>

                                <option value="Emergency">
                                    Emergency
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Scheduled Date</label>

                            <input
                                type="date"
                                name="scheduledDate"
                                value={formData.scheduledDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Completed Date</label>

                            <input
                                type="date"
                                name="completedDate"
                                value={formData.completedDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Technician</label>

                            <input
                                type="text"
                                name="technician"
                                value={formData.technician}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Scheduled">
                                    Scheduled
                                </option>

                                <option value="In Progress">
                                    In Progress
                                </option>

                                <option value="Completed">
                                    Completed
                                </option>

                                <option value="Overdue">
                                    Overdue
                                </option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="form-actions full-width">
                            <button
                                type="button"
                                className="secondary-btn"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-btn"
                            >
                                Update Maintenance
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {/* Maintenance Table */}
            <div className="section-header">
                <div>
                    <h2>Maintenance Records</h2>
                    <p>
                        Track scheduled and completed machine maintenance
                    </p>
                </div>
            </div>

            {maintenance.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🔧</div>

                    <h3>No maintenance records</h3>

                    <p>
                        Add your first maintenance activity to get started.
                    </p>

                    <Link
                        to="/add-maintenance"
                        className="primary-btn"
                    >
                        + Add Maintenance
                    </Link>
                </div>
            ) : (
                <div className="table-container">

                    <table className="data-table">

                        <thead>
                            <tr>
                                <th>Machine</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Scheduled</th>
                                <th>Completed</th>
                                <th>Technician</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {maintenance.map((item) => (
                                <tr key={item._id}>

                                    <td>
                                        <strong>
                                            {getMachineName(item.machine)}
                                        </strong>
                                    </td>

                                    <td>
                                        <span className="maintenance-type-badge">
                                            {item.maintenanceType}
                                        </span>
                                    </td>

                                    <td className="description-cell">
                                        {item.description}
                                    </td>

                                    <td>
                                        {formatDate(item.scheduledDate)}
                                    </td>

                                    <td>
                                        {formatDate(item.completedDate)}
                                    </td>

                                    <td>
                                        {item.technician}
                                    </td>

                                    <td>
                                        <span
                                            className={getStatusClass(
                                                item.status
                                            )}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="table-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    handleDelete(item._id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>

                </div>
            )}

        </div>
    );
}

export default Maintenance;