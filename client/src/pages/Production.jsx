import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Layers,
    Plus,
    RefreshCw,
    Pencil,
    Trash2,
    X,
    Check,
    Search,
    Package,
    Calendar,
    Cpu,
    ArrowUpDown,
    Filter,
    FileSpreadsheet,
    Scale
} from "lucide-react";

function Production() {
    const [production, setProduction] = useState([]);
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [paperTypeFilter, setPaperTypeFilter] = useState("ALL");

    const [editingProduction, setEditingProduction] = useState(null);

    const [formData, setFormData] = useState({
        batchId: "",
        paperType: "",
        quantity: "",
        productionDate: "",
        machine: ""
    });

    const fetchProduction = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/production"
            );

            setProduction(response.data || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load production records.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMachines = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/machines"
            );
            setMachines(response.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProduction();
        fetchMachines();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const startEdit = (item) => {
        setEditingProduction(item._id);

        setFormData({
            batchId: item.batchId || "",
            paperType: item.paperType || "",
            quantity: item.quantity || "",
            productionDate: item.productionDate
                ? item.productionDate.substring(0, 10)
                : "",
            machine:
                typeof item.machine === "object"
                    ? item.machine._id
                    : item.machine || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const cancelEdit = () => {
        setEditingProduction(null);
        setFormData({
            batchId: "",
            paperType: "",
            quantity: "",
            productionDate: "",
            machine: ""
        });
    };

    const updateProduction = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `http://localhost:5000/api/production/${editingProduction}`,
                {
                    batchId: formData.batchId,
                    paperType: formData.paperType,
                    quantity: Number(formData.quantity),
                    productionDate: formData.productionDate,
                    machine: formData.machine
                }
            );

            cancelEdit();
            fetchProduction();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update production record.");
        }
    };

    const deleteProduction = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this production record?"
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/production/${id}`);
            fetchProduction();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete production record.");
        }
    };

    // Summary calculations
    const totalProduction = useMemo(() => {
        return production.reduce((total, item) => total + Number(item.quantity || 0), 0);
    }, [production]);

    const totalBatches = production.length;
    const averageProduction = totalBatches > 0 ? Math.round(totalProduction / totalBatches) : 0;

    // Filtered data
    const filteredProduction = useMemo(() => {
        return production.filter((item) => {
            const matchesSearch =
                item.batchId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.paperType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (typeof item.machine === "object" &&
                    item.machine?.machineName?.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesType =
                paperTypeFilter === "ALL" || item.paperType === paperTypeFilter;

            return matchesSearch && matchesType;
        });
    }, [production, searchTerm, paperTypeFilter]);

    if (loading && production.length === 0) {
        return (
            <div className="page-loading-skeleton">
                <div className="spinner-industrial"></div>
                <span>Loading production batch logs...</span>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* PAGE HEADER */}
            <div className="page-header">
                <div className="page-header-content">
                    <div className="page-eyebrow">
                        <span>Mill Operations</span>
                        <span className="eyebrow-divider">/</span>
                        <span>Batch Production</span>
                    </div>
                    <h1 className="page-title">Production Batches</h1>
                    <p className="page-subtitle">
                        Monitor paper output volume, scheduled machine allocation, and batch traceability
                    </p>
                </div>

                <div className="page-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={fetchProduction}
                        title="Reload production records"
                    >
                        <RefreshCw size={15} className={loading ? "spin-icon" : ""} />
                        <span>Refresh</span>
                    </button>
                    <Link to="/add-production" className="btn btn-primary">
                        <Plus size={16} />
                        <span>Add Batch</span>
                    </Link>
                </div>
            </div>

            {/* SUMMARY KPIS */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">GROSS OUTPUT</span>
                        <div className="kpi-icon-wrapper kpi-icon-navy">
                            <Layers size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">
                            {totalProduction.toLocaleString()}
                            <span className="kpi-unit"> kg</span>
                        </div>
                        <span className="kpi-hint">Total volume manufactured</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">TOTAL BATCHES</span>
                        <div className="kpi-icon-wrapper kpi-icon-blue">
                            <Package size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">{totalBatches}</div>
                        <span className="kpi-hint">Processed and closed runs</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">AVG BATCH YIELD</span>
                        <div className="kpi-icon-wrapper kpi-icon-navy">
                            <Scale size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value">
                            {averageProduction.toLocaleString()}
                            <span className="kpi-unit"> kg</span>
                        </div>
                        <span className="kpi-hint">Average run capacity per batch</span>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-header">
                        <span className="kpi-label">PLANT STATUS</span>
                        <div className="kpi-icon-wrapper kpi-icon-green">
                            <Check size={16} />
                        </div>
                    </div>
                    <div className="kpi-body">
                        <div className="kpi-value text-running">Nominal</div>
                        <span className="kpi-hint">Lines operating at schedule</span>
                    </div>
                </div>
            </div>

            {/* EDIT DRAWER / FORM */}
            {editingProduction && (
                <div className="edit-banner-card">
                    <div className="edit-banner-header">
                        <div className="edit-banner-title-group">
                            <div className="edit-banner-tag">EDIT RECORD</div>
                            <h3>Modify Production Batch</h3>
                            <p>Update assigned machine line, quantity weight, or batch specifications</p>
                        </div>
                        <button className="btn-icon" onClick={cancelEdit} title="Cancel">
                            <X size={18} />
                        </button>
                    </div>

                    <form className="form-grid" onSubmit={updateProduction}>
                        <div className="form-field">
                            <label className="form-label">Batch Identifier</label>
                            <input
                                className="form-input"
                                type="text"
                                name="batchId"
                                value={formData.batchId}
                                onChange={handleChange}
                                placeholder="e.g. BATCH001"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Paper Grade / Type</label>
                            <select
                                className="form-select"
                                name="paperType"
                                value={formData.paperType}
                                onChange={handleChange}
                                required
                            >
                                <option value="A4">A4 Standard</option>
                                <option value="A3">A3 Drawing/Ledger</option>
                                <option value="A5">A5 Booklet</option>
                                <option value="Newsprint">Newsprint</option>
                                <option value="Packaging">Industrial Packaging</option>
                            </select>
                        </div>

                        <div className="form-field">
                            <label className="form-label">Production Quantity (kg)</label>
                            <input
                                className="form-input"
                                type="number"
                                name="quantity"
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Weight in kg"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Production Run Date</label>
                            <input
                                className="form-input"
                                type="date"
                                name="productionDate"
                                value={formData.productionDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-label">Allocated Paper Machine</label>
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
                        </div>

                        <div className="form-actions-full">
                            <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <Check size={16} />
                                <span>Save Batch Updates</span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ERROR */}
            {error && (
                <div className="alert-banner alert-banner-critical">
                    <span>{error}</span>
                </div>
            )}

            {/* CONTROLS BAR: SEARCH & FILTER */}
            <div className="table-controls-bar">
                <div className="filter-group-left">
                    <div className="search-input-wrapper">
                        <Search size={15} className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by batch, paper type, machine..."
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
                        {["ALL", "A4", "A3", "Newsprint", "Packaging"].map((type) => (
                            <button
                                key={type}
                                className={`status-tab ${paperTypeFilter === type ? "active" : ""}`}
                                onClick={() => setPaperTypeFilter(type)}
                            >
                                {type === "ALL" ? "All Grades" : type}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="text-secondary text-xs font-mono">
                    Showing {filteredProduction.length} of {production.length} batches
                </div>
            </div>

            {/* PRODUCTION TABLE */}
            <div className="table-wrapper">
                {filteredProduction.length > 0 ? (
                    <table className="enterprise-table">
                        <thead>
                            <tr>
                                <th>Batch Identifier</th>
                                <th>Paper Grade</th>
                                <th>Quantity Output</th>
                                <th>Run Date</th>
                                <th>Assigned Machine</th>
                                <th>Production Line</th>
                                <th className="text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProduction.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className="table-entity">
                                            <div className="entity-icon entity-icon-navy">
                                                <Package size={13} />
                                            </div>
                                            <span className="font-mono font-semibold text-primary">
                                                {item.batchId}
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-idle">
                                            {item.paperType || "Standard"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-mono font-semibold text-primary">
                                            {Number(item.quantity || 0).toLocaleString()} kg
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-secondary inline-flex items-center gap-1 font-mono text-xs">
                                            <Calendar size={12} className="text-muted" />
                                            {item.productionDate
                                                ? new Date(item.productionDate).toLocaleDateString("en-IN", {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric"
                                                  })
                                                : "-"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="font-medium text-secondary">
                                            {item.machine?.machineName || "Unassigned"}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-muted text-xs">
                                            {item.machine?.productionLine || "—"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="table-actions-end">
                                            <button
                                                className="btn-table-action"
                                                onClick={() => startEdit(item)}
                                                title="Edit batch record"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="btn-table-action text-critical"
                                                onClick={() => deleteProduction(item._id)}
                                                title="Delete batch record"
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
                            <Layers size={32} />
                        </div>
                        <h3>No Production Batches Found</h3>
                        <p>
                            {searchTerm || paperTypeFilter !== "ALL"
                                ? "No batches match your filter query."
                                : "Start recording production output to build manufacturing history."}
                        </p>
                        {searchTerm || paperTypeFilter !== "ALL" ? (
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setSearchTerm("");
                                    setPaperTypeFilter("ALL");
                                }}
                            >
                                Reset Search Filters
                            </button>
                        ) : (
                            <Link to="/add-production" className="btn btn-primary">
                                <Plus size={16} />
                                <span>Add First Batch</span>
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Production;
