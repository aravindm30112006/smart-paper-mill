import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    ShieldCheck,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    Check,
    Search,
    AlertTriangle,
    XCircle,
    CheckCircle2,
    Info,
    SlidersHorizontal,
    FileCheck
} from "lucide-react";

function Quality() {
    const [quality, setQuality] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [editingQuality, setEditingQuality] = useState(null);

    const [formData, setFormData] = useState({
        batchId: "",
        paperType: "",
        thickness: "",
        moisture: "",
        strength: "",
        defectCount: ""
    });

    const fetchQuality = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get("http://localhost:5000/api/quality");
            setQuality(response.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load quality inspection data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuality();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const startEdit = (item) => {
        setEditingQuality(item._id);

        setFormData({
            batchId: item.batchId || "",
            paperType: item.paperType || "",
            thickness: item.thickness ?? "",
            moisture: item.moisture ?? "",
            strength: item.strength ?? "",
            defectCount: item.defectCount ?? ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const cancelEdit = () => {
        setEditingQuality(null);
        setFormData({
            batchId: "",
            paperType: "",
            thickness: "",
            moisture: "",
            strength: "",
            defectCount: ""
        });
    };

    const updateQuality = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `http://localhost:5000/api/quality/${editingQuality}`,
                {
                    batchId: formData.batchId,
                    paperType: formData.paperType,
                    thickness: Number(formData.thickness),
                    moisture: Number(formData.moisture),
                    strength: Number(formData.strength),
                    defectCount: Number(formData.defectCount)
                }
            );

            cancelEdit();
            fetchQuality();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update quality inspection.");
        }
    };

    const deleteQuality = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this quality inspection record?"
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/quality/${id}`);
            fetchQuality();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete quality inspection.");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "PASS":
                return (
                    <span className="badge badge-running">
                        <CheckCircle2 size={11} />
                        PASS
                    </span>
                );
            case "WARNING":
                return (
                    <span className="badge badge-maintenance">
                        <AlertTriangle size={11} />
                        WARNING
                    </span>
                );
            case "FAIL":
                return (
                    <span className="badge badge-critical">
                        <XCircle size={11} />
                        FAIL
                    </span>
                );
            default:
                return <span className="badge badge-idle">{status}</span>;
        }
    };

    // Summary calculations
    const passCount = quality.filter((i) => i.qualityStatus === "PASS").length;
    const warningCount = quality.filter((i) => i.qualityStatus === "WARNING").length;
    const failCount = quality.filter((i) => i.qualityStatus === "FAIL").length;
    const totalCount = quality.length;
    const passRate = totalCount > 0 ? ((passCount / totalCount) * 100).toFixed(1) : "0.0";

    // Filter logic
    const filteredQuality = useMemo(() => {
        return quality.filter((item) => {
            const matchesSearch =
                item.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.paperType?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus =
                statusFilter === "ALL" || item.qualityStatus === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [quality, searchTerm, statusFilter]);

    if (loading && quality.length === 0) {
        return (
            <div className="page-loading-skeleton">
                <div className="spinner-industrial"></div>
                <span>Auditing paper inspection sheets...</span>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* PAGE HEADER */}
            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-eyebrow">
                        <span>Quality Assurance</span>
                        <span className="eyebrow-divider">/</span>
                        <span>Inspection Logs</span>
                    </div>
                    <h1 className="page-title">Quality Assurance & Inspection</h1>
                    <p className="page-subtitle">
                        Standard testing criteria, caliper thickness, tensile strength, and defect classification
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchQuality}
                        title="Reload quality records"
                    >
                        <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
                        <span>Refresh</span>
                    </button>
                    <Link to="/add-quality" className="btn btn-primary">
                        <Plus size={16} />
                        <span>New Inspection</span>
                    </Link>
                </div>
            </div>

            {/* SUMMARY KPIS */}
            <div className="kpi-grid">
                <div className="kpi-card" onClick={() => setStatusFilter("PASS")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">PASSED BATCHES</span>
                        <div className="kpi-icon-wrapper kpi-icon-green">
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-running">{passCount}</div>
                        <span className="kpi-hint">0–5 defects per roll</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("WARNING")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">WARNINGS</span>
                        <div className="kpi-icon-wrapper kpi-icon-amber">
                            <AlertTriangle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-amber">{warningCount}</div>
                        <span className="kpi-hint">6–10 defects (requires review)</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("FAIL")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">FAILED BATCHES</span>
                        <div className="kpi-icon-wrapper kpi-icon-critical">
                            <XCircle size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-critical">{failCount}</div>
                        <span className="kpi-hint">&gt;10 defects (rejected/repulp)</span>
                    </div>
                </div>

                <div className="kpi-card" onClick={() => setStatusFilter("ALL")} role="button" tabIndex={0}>
                    <div className="kpi-header">
                        <span className="kpi-label">OVERALL PASS RATE</span>
                        <div className="kpi-icon-wrapper kpi-icon-navy">
                            <ShieldCheck size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">{passRate}%</div>
                        <div className="meter-track mt-1">
                            <div
                                className="meter-fill fill-optimal"
                                style={{ width: `${Math.min(Number(passRate), 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* EDIT DRAWER / FORM */}
            {editingQuality && (
                <div className="edit-banner-card">
                    <div className="edit-banner-header">
                        <div className="edit-banner-title-group">
                            <div className="edit-banner-tag">EDIT INSPECTION</div>
                            <h3>Modify Quality Report: {formData.batchId}</h3>
                            <p>Update physical measurement parameters and recorded defect numbers</p>
                        </div>
                        <button className="btn-icon" onClick={cancelEdit} title="Cancel">
                            <X size={18} />
                        </button>
                    </div>

                    <form className="form-grid" onSubmit={updateQuality}>
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
                            <label className="form-label">Paper Type / Grade</label>
                            <input
                                className="form-input"
                                type="text"
                                name="paperType"
                                value={formData.paperType}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Caliper Thickness (mm)</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.01"
                                min="0"
                                name="thickness"
                                value={formData.thickness}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Moisture Content (%)</label>
                            <input
                                className="form-input"
                                type="number"
                                step="0.1"
                                min="0"
                                name="moisture"
                                value={formData.moisture}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Tensile Strength (kN/m)</label>
                            <input
                                className="form-input"
                                type="number"
                                min="0"
                                name="strength"
                                value={formData.strength}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Defect Count</label>
                            <input
                                className="form-input"
                                type="number"
                                min="0"
                                name="defectCount"
                                value={formData.defectCount}
                                onChange={handleChange}
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
                            placeholder="Filter by batch or paper type..."
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
                        {["ALL", "PASS", "WARNING", "FAIL"].map((st) => (
                            <button
                                key={st}
                                className={`status-tab ${statusFilter === st ? "active" : ""}`}
                                onClick={() => setStatusFilter(st)}
                            >
                                {st === "ALL" ? "All Results" : st}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-secondary text-xs font-mono">
                    Showing {filteredQuality.length} of {quality.length} inspections
                </div>
            </div>

            {/* QUALITY TABLE */}
            <div className="table-wrapper">
                {filteredQuality.length > 0 ? (
                    <table className="enterprise-table">
                        <thead>
                            <tr>
                                <th>Batch Identifier</th>
                                <th>Grade</th>
                                <th>Thickness</th>
                                <th>Moisture</th>
                                <th>Strength</th>
                                <th>Defect Count</th>
                                <th>Quality Classification</th>
                                <th>Inspected At</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredQuality.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <span className="font-mono font-semibold text-primary">
                                            {item.batchId}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-secondary">{item.paperType}</span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-secondary">{item.thickness} mm</span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-secondary">{item.moisture}%</span>
                                    </td>
                                    <td>
                                        <span className="font-mono text-secondary">{item.strength}</span>
                                    </td>
                                    <td>
                                        <span
                                            className={`font-mono font-semibold ${
                                                Number(item.defectCount || 0) > 10
                                                    ? "text-critical"
                                                    : Number(item.defectCount || 0) > 5
                                                    ? "text-amber"
                                                    : "text-running"
                                            }`}
                                        >
                                            {item.defectCount}
                                        </span>
                                    </td>
                                    <td>{getStatusBadge(item.qualityStatus)}</td>
                                    <td>
                                        <span className="text-secondary font-mono text-xs">
                                            {item.inspectedAt
                                                ? new Date(item.inspectedAt).toLocaleString("en-IN", {
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
                                                title="Edit inspection"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="btn-table-action text-critical"
                                                onClick={() => deleteQuality(item._id)}
                                                title="Delete inspection"
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
                            <ShieldCheck size={32} />
                        </div>
                        <h3>No Quality Inspection Records</h3>
                        <p>No tests logged matching your active criteria.</p>
                        <Link to="/add-quality" className="btn btn-primary">
                            <Plus size={16} />
                            <span>Log Inspection</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* QUALITY SPECIFICATION REFERENCE CARDS */}
            <div className="card mt-4">
                <div className="card-header border-bottom">
                    <div className="card-title-group">
                        <div className="card-tag">TAPPI / ISO CRITERIA</div>
                        <h2 className="card-title">Defect Classification Framework</h2>
                        <p className="card-subtitle">Automated compliance grading applied during inspection entry</p>
                    </div>
                </div>

                <div className="card-content">
                    <div className="rules-grid">
                        <div className="rule-card rule-card-pass">
                            <div className="rule-badge-col">
                                <CheckCircle2 size={16} className="text-running" />
                            </div>
                            <div>
                                <h4 className="rule-title text-running">PASS (Grade A)</h4>
                                <p className="rule-desc">0 – 5 defects. Cleared for export packaging and customer dispatch.</p>
                            </div>
                        </div>

                        <div className="rule-card rule-card-warning">
                            <div className="rule-badge-col">
                                <AlertTriangle size={16} className="text-amber" />
                            </div>
                            <div>
                                <h4 className="rule-title text-amber">WARNING (Grade B)</h4>
                                <p className="rule-desc">6 – 10 defects. Secondary re-inspection or domestic packaging diversion.</p>
                            </div>
                        </div>

                        <div className="rule-card rule-card-critical">
                            <div className="rule-badge-col">
                                <XCircle size={16} className="text-critical" />
                            </div>
                            <div>
                                <h4 className="rule-title text-critical">FAIL (Reject)</h4>
                                <p className="rule-desc">&gt; 10 defects. Batch quarantine and automatic routing to repulping chest.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Quality;
