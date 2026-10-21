import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Layers, Check, AlertTriangle, Plus } from "lucide-react";

function AddProduction() {
    const navigate = useNavigate();
    const [machines, setMachines] = useState([]);

    const [formData, setFormData] = useState({
        batchId: "",
        paperType: "A4",
        quantity: "",
        productionDate: new Date().toISOString().substring(0, 10),
        machine: ""
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
                setError("Unable to load machine list.");
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
            await axios.post("http://localhost:5000/api/production", {
                batchId: formData.batchId,
                paperType: formData.paperType,
                quantity: Number(formData.quantity),
                productionDate: formData.productionDate,
                machine: formData.machine
            });

            setMessage("Production batch logged successfully!");
            setTimeout(() => {
                navigate("/production");
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to add production batch.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container form-page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <Link to="/production" className="back-link">
                        <ArrowLeft size={14} />
                        <span>Back to Production</span>
                    </Link>
                    <h1 className="page-title">Add Production Batch</h1>
                    <p className="page-subtitle">
                        Record manufacturing output, allocate industrial machinery, and generate batch tracking
                    </p>
                </div>
            </div>

            {message && (
                <div className="alert-banner alert-banner-success">
                    <Check size={16} />
                    <span>{message} Redirecting to batch log...</span>
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
                        <div className="card-tag">BATCH LOGGING</div>
                        <h2 className="card-title">Batch Output Specifications</h2>
                        <p className="card-subtitle">Ensure quantity and machine allocation match shop-floor dispatch sheets</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="card-content form-layout">
                    <div className="form-field-grid">
                        <div className="form-field">
                            <label className="form-label">Batch Identifier *</label>
                            <input
                                className="form-input"
                                type="text"
                                name="batchId"
                                value={formData.batchId}
                                onChange={handleChange}
                                placeholder="e.g. BATCH005"
                                required
                            />
                            <span className="field-hint">Unique plant run tracking code</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Paper Grade / Specification *</label>
                            <select
                                className="form-select"
                                name="paperType"
                                value={formData.paperType}
                                onChange={handleChange}
                            >
                                <option value="A4">A4 Copy / Office</option>
                                <option value="A3">A3 Drawing / Heavy</option>
                                <option value="A5">A5 Booklet</option>
                                <option value="Newsprint">Standard Newsprint</option>
                                <option value="Packaging">Industrial Packaging</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Output Quantity (kg) *</label>
                            <input
                                className="form-input"
                                type="number"
                                name="quantity"
                                min="1"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="e.g. 15000"
                                required
                            />
                            <span className="field-hint">Net finished paper roll weight</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Production Run Date *</label>
                            <input
                                className="form-input"
                                type="date"
                                name="productionDate"
                                value={formData.productionDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field form-field-full">
                            <label className="form-label">Allocated Production Machine *</label>
                            <select
                                className="form-select"
                                name="machine"
                                value={formData.machine}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Paper Machine Line...</option>
                                {machines.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.machineName} - {m.productionLine} (Current: {m.status})
                                    </option>
                                ))}
                            </select>
                            <span className="field-hint">Line dedicated to this manufacturing run</span>
                        </div>
                    </div>

                    <div className="form-card-footer">
                        <Link to="/production" className="btn btn-outline">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <Plus size={16} />
                            <span>{submitting ? "Logging..." : "Create Production Batch"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProduction;
