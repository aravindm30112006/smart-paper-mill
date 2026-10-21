import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Droplets, Check, AlertTriangle, Plus } from "lucide-react";

function AddPulp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        batchId: "",
        temperature: "",
        pressure: "",
        moisture: "",
        ph: "",
        flowRate: "",
        status: "Normal"
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
            await axios.post("http://localhost:5000/api/pulp", {
                batchId: formData.batchId,
                temperature: Number(formData.temperature),
                pressure: Number(formData.pressure),
                moisture: Number(formData.moisture),
                ph: Number(formData.ph),
                flowRate: Number(formData.flowRate),
                status: formData.status
            });

            setMessage("Pulp monitoring reading logged successfully!");
            setTimeout(() => {
                navigate("/pulp");
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to add pulp reading.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container form-page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <Link to="/pulp" className="back-link">
                        <ArrowLeft size={14} />
                        <span>Back to Pulp Monitoring</span>
                    </Link>
                    <h1 className="page-title">Log Pulp Process Reading</h1>
                    <p className="page-subtitle">
                        Record digestion slurry temperature, hydraulic head pressure, moisture, pH, and flow rate
                    </p>
                </div>
            </div>

            {message && (
                <div className="alert-banner alert-banner-success">
                    <Check size={16} />
                    <span>{message} Redirecting to pulp telemetry...</span>
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
                        <div className="card-tag">DIGESTION & REFINING TELEMETRY</div>
                        <h2 className="card-title">Chemical & Hydraulic Parameters</h2>
                        <p className="card-subtitle">Verify sensor readings against digester console instrumentation</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="card-content form-layout">
                    <div className="form-field-grid">
                        <div className="form-field">
                            <label className="form-label">Associated Batch ID *</label>
                            <input
                                className="form-input"
                                type="text"
                                name="batchId"
                                value={formData.batchId}
                                onChange={handleChange}
                                placeholder="e.g. BATCH005"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Slurry Temperature (°C) *</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                placeholder="e.g. 71.5"
                                required
                            />
                            <span className="field-hint">Optimal digestion: 68°C - 76°C</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Head Pressure (bar) *</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                name="pressure"
                                value={formData.pressure}
                                onChange={handleChange}
                                placeholder="e.g. 4.2"
                                required
                            />
                            <span className="field-hint">Recommended: 3.8 - 4.6 bar</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Fiber Moisture (%) *</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                name="moisture"
                                value={formData.moisture}
                                onChange={handleChange}
                                placeholder="e.g. 6.4"
                                required
                            />
                            <span className="field-hint">Target: 5.8% - 6.8%</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">pH Value (0 – 14) *</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                min="0"
                                max="14"
                                name="ph"
                                value={formData.ph}
                                onChange={handleChange}
                                placeholder="e.g. 7.1"
                                required
                            />
                            <span className="field-hint">Target neutral buffer: 6.9 - 7.3</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Slurry Flow Rate (L/min) *</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                name="flowRate"
                                value={formData.flowRate}
                                onChange={handleChange}
                                placeholder="e.g. 850"
                                required
                            />
                            <span className="field-hint">Feed line pump throughput</span>
                        </div>

                        <div className="form-field form-field-full">
                            <label className="form-label">Process Condition State *</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Normal">Normal (Operating within control bounds)</option>
                                <option value="Warning">Warning (Approaching excursion limits)</option>
                                <option value="Critical">Critical (Exceeded safe thresholds)</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-card-footer">
                        <Link to="/pulp" className="btn btn-outline">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <Plus size={16} />
                            <span>{submitting ? "Logging..." : "Log Pulp Reading"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPulp;
