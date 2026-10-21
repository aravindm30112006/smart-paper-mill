import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Cpu, Check, AlertTriangle, Plus } from "lucide-react";

function AddMachine() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        machineName: "",
        productionLine: "",
        status: "Idle",
        temperature: "",
        utilization: "",
        operatingHours: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

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
            await axios.post("http://localhost:5000/api/machines", {
                machineName: formData.machineName,
                productionLine: formData.productionLine,
                status: formData.status,
                temperature: Number(formData.temperature),
                utilization: Number(formData.utilization),
                operatingHours: Number(formData.operatingHours)
            });

            setMessage("Machine registered successfully!");
            setFormData({
                machineName: "",
                productionLine: "",
                status: "Idle",
                temperature: "",
                utilization: "",
                operatingHours: ""
            });

            setTimeout(() => {
                navigate("/machines");
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to register machine.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container form-page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <Link to="/machines" className="back-link">
                        <ArrowLeft size={14} />
                        <span>Back to Machines</span>
                    </Link>
                    <h1 className="page-title">Register New Machine</h1>
                    <p className="page-subtitle">
                        Add a new paper machine or line unit to the plant's SCADA surveillance network
                    </p>
                </div>
            </div>

            {message && (
                <div className="alert-banner alert-banner-success">
                    <Check size={16} />
                    <span>{message} Redirecting to fleet view...</span>
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
                        <div className="card-tag">ASSET ENROLLMENT</div>
                        <h2 className="card-title">Machine Specification & Parameters</h2>
                        <p className="card-subtitle">All initial values will be tracked continuously by the mill telemetry engine</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="card-content form-layout">
                    <div className="form-field-grid">
                        <div className="form-field">
                            <label className="form-label">Machine Name *</label>
                            <input
                                className="form-input"
                                type="text"
                                name="machineName"
                                value={formData.machineName}
                                onChange={handleChange}
                                placeholder="e.g. Paper Machine 04"
                                required
                            />
                            <span className="field-hint">Industrial asset tag identifier</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Production Line *</label>
                            <input
                                className="form-input"
                                type="text"
                                name="productionLine"
                                value={formData.productionLine}
                                onChange={handleChange}
                                placeholder="e.g. Production Line D"
                                required
                            />
                            <span className="field-hint">Assigned bay or manufacturing circuit</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Initial Status</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Idle">Idle (Standby)</option>
                                <option value="Running">Running (Active)</option>
                                <option value="Maintenance">Maintenance</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Baseline Temperature (°C) *</label>
                            <input
                                className="form-input"
                                type="number"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                placeholder="e.g. 70"
                                required
                            />
                            <span className="field-hint">Normal operating range 65°C - 80°C</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Initial Utilization (%) *</label>
                            <input
                                className="form-input"
                                type="number"
                                name="utilization"
                                min="0"
                                max="100"
                                value={formData.utilization}
                                onChange={handleChange}
                                placeholder="e.g. 85"
                                required
                            />
                            <span className="field-hint">Rated line capacity percentage</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Initial Operating Hours (h) *</label>
                            <input
                                className="form-input"
                                type="number"
                                name="operatingHours"
                                min="0"
                                value={formData.operatingHours}
                                onChange={handleChange}
                                placeholder="e.g. 0 or accumulated runtime"
                                required
                            />
                            <span className="field-hint">Runtime clock for service intervals</span>
                        </div>
                    </div>

                    <div className="form-card-footer">
                        <Link to="/machines" className="btn btn-outline">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <Plus size={16} />
                            <span>{submitting ? "Registering..." : "Add Machine"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMachine;
