import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Wrench, Check, AlertTriangle, Plus } from "lucide-react";

function AddMaintenance() {
    const navigate = useNavigate();
    const [machines, setMachines] = useState([]);

    const [formData, setFormData] = useState({
        machine: "",
        maintenanceType: "Preventive",
        description: "",
        scheduledDate: new Date().toISOString().substring(0, 10),
        technician: "",
        status: "Scheduled"
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/machines");
                setMachines(response.data || []);
            } catch (err) {
                console.error(err);
                setError("Unable to load machinery list.");
            }
        };

        fetchMachines();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setSubmitting(true);

        try {
            await axios.post("http://localhost:5000/api/maintenance", {
                machine: formData.machine,
                maintenanceType: formData.maintenanceType,
                description: formData.description,
                scheduledDate: formData.scheduledDate,
                technician: formData.technician,
                status: formData.status
            });

            setMessage("Maintenance service work order scheduled successfully!");
            setTimeout(() => {
                navigate("/maintenance");
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to schedule maintenance.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container form-page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <Link to="/maintenance" className="back-link">
                        <ArrowLeft size={14} />
                        <span>Back to Maintenance</span>
                    </Link>
                    <h1 className="page-title">Schedule Maintenance Work Order</h1>
                    <p className="page-subtitle">
                        Dispatch technicians for preventive lubrication, roller alignment, or emergency breakdown repairs
                    </p>
                </div>
            </div>

            {message && (
                <div className="alert-banner alert-banner-success">
                    <Check size={16} />
                    <span>{message} Redirecting to maintenance console...</span>
                </div>
            )}

            {error && (
                <div className="alert-banner alert-banner-critical">
                    <AlertTriangle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <div className="card form-card-elevated">
                <div className="card-header border-bottom">
                    <div className="card-title-group">
                        <div className="card-tag">PLANT RELIABILITY WORK ORDER</div>
                        <h2 className="card-title">Maintenance Task Specification</h2>
                        <p className="card-subtitle">Technicians will be notified and ticket tracked against downtime targets</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="card-content form-layout">
                    <div className="form-field-grid">
                        <div className="form-field">
                            <label className="form-label">Target Machine Unit *</label>
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
                                        {m.machineName} - {m.productionLine}
                                    </option>
                                ))}
                            </select>
                            <span className="field-hint">Equipment receiving service</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Maintenance Classification *</label>
                            <select
                                className="form-select"
                                name="maintenanceType"
                                value={formData.maintenanceType}
                                onChange={handleChange}
                            >
                                <option value="Preventive">Preventive Maintenance (PM)</option>
                                <option value="Corrective">Corrective Repair</option>
                                <option value="Emergency">Emergency Shutdown</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Scheduled Execution Date *</label>
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
                            <label className="form-label">Assigned Lead Technician *</label>
                            <input
                                className="form-input"
                                type="text"
                                name="technician"
                                value={formData.technician}
                                onChange={handleChange}
                                placeholder="e.g. Marcus Vance"
                                required
                            />
                            <span className="field-hint">Certified mill technician name</span>
                        </div>

                        <div className="form-field form-field-full">
                            <label className="form-label">Work Order Status *</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Scheduled">Scheduled (Awaiting slot)</option>
                                <option value="In Progress">In Progress (Active on line)</option>
                                <option value="Completed">Completed</option>
                                <option value="Overdue">Overdue</option>
                            </select>
                        </div>

                        <div className="form-field form-field-full">
                            <label className="form-label">Detailed Work Scope & Checklist *</label>
                            <textarea
                                className="form-textarea"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="e.g. Bearing grease replacement, calendar roller alignment, felt tension inspection..."
                                rows="4"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-card-footer">
                        <Link to="/maintenance" className="btn btn-outline">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <Plus size={16} />
                            <span>{submitting ? "Scheduling..." : "Create Work Order"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMaintenance;
