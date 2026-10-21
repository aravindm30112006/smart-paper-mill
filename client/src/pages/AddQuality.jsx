import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Check, AlertTriangle, Plus } from "lucide-react";

function AddQuality() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        batchId: "",
        paperType: "A4",
        thickness: "",
        moisture: "",
        strength: "",
        defectCount: ""
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
            await axios.post("http://localhost:5000/api/quality", {
                batchId: formData.batchId,
                paperType: formData.paperType,
                thickness: Number(formData.thickness),
                moisture: Number(formData.moisture),
                strength: Number(formData.strength),
                defectCount: Number(formData.defectCount)
            });

            setMessage("Quality inspection report submitted successfully!");
            setTimeout(() => {
                navigate("/quality");
            }, 1200);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Unable to add quality inspection.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="page-container form-page-container">
            <div className="page-header">
                <div className="page-header-content">
                    <Link to="/quality" className="back-link">
                        <ArrowLeft size={14} />
                        <span>Back to Quality Inspections</span>
                    </Link>
                    <h1 className="page-title">New Quality Inspection</h1>
                    <p className="page-subtitle">
                        Record laboratory paper sample measurements, mechanical strength, and roll defect counts
                    </p>
                </div>
            </div>

            {message && (
                <div className="alert-banner alert-banner-success">
                    <Check size={16} />
                    <span>{message} Redirecting to inspection sheet...</span>
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
                        <div className="card-tag">TAPPI / ISO 9001 TEST SHEET</div>
                        <h2 className="card-title">Physical Sample Measurements</h2>
                        <p className="card-subtitle">
                            Automatic status (PASS, WARNING, FAIL) will be assigned based on defect count thresholds
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="card-content form-layout">
                    <div className="form-field-grid">
                        <div className="form-field">
                            <label className="form-label">Batch ID *</label>
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
                            <label className="form-label">Paper Grade Specification *</label>
                            <select
                                className="form-select"
                                name="paperType"
                                value={formData.paperType}
                                onChange={handleChange}
                            >
                                <option value="A4">A4 Copy / Office</option>
                                <option value="A3">A3 Drawing / Ledger</option>
                                <option value="A5">A5 Booklet</option>
                                <option value="Newsprint">Standard Newsprint</option>
                                <option value="Packaging">Industrial Packaging</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Caliper Thickness (mm) *</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.01"
                                min="0"
                                name="thickness"
                                value={formData.thickness}
                                onChange={handleChange}
                                placeholder="e.g. 0.10"
                                required
                            />
                            <span className="field-hint">Micrometer measured gauge</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Moisture Content (%) *</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                min="0"
                                name="moisture"
                                value={formData.moisture}
                                onChange={handleChange}
                                placeholder="e.g. 6.2"
                                required
                            />
                            <span className="field-hint">Standard dry-line moisture</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Tensile Strength (kN/m) *</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                min="0"
                                name="strength"
                                value={formData.strength}
                                onChange={handleChange}
                                placeholder="e.g. 82.5"
                                required
                            />
                            <span className="field-hint">Tensile burst test rating</span>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Defect Count (Roll/Ream) *</label>
                            <input
                                className="form-input"
                                type="number"
                                min="0"
                                name="defectCount"
                                value={formData.defectCount}
                                onChange={handleChange}
                                placeholder="e.g. 3"
                                required
                            />
                            <span className="field-hint">0-5: PASS · 6-10: WARNING · &gt;10: FAIL</span>
                        </div>
                    </div>

                    <div className="form-card-footer">
                        <Link to="/quality" className="btn btn-outline">
                            Cancel
                        </Link>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            <Plus size={16} />
                            <span>{submitting ? "Submitting..." : "Submit Inspection"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddQuality;
