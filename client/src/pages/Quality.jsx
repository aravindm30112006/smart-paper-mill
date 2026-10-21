import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Quality() {
    const [quality, setQuality] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingQuality, setEditingQuality] = useState(null);

    const [formData, setFormData] = useState({
        batchId: "",
        paperType: "",
        thickness: "",
        moisture: "",
        strength: "",
        defectCount: ""
    });

    // =====================================================
    // FETCH QUALITY DATA
    // =====================================================

    const fetchQuality = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/quality"
            );

            setQuality(response.data);
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

    // =====================================================
    // FORM HANDLING
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================================
    // EDIT
    // =====================================================

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

            alert("Quality inspection updated successfully.");

            cancelEdit();
            fetchQuality();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                    "Failed to update quality inspection."
            );
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deleteQuality = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this quality inspection?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/quality/${id}`
            );

            alert("Quality inspection deleted successfully.");

            fetchQuality();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                    "Failed to delete quality inspection."
            );
        }
    };

    // =====================================================
    // STATUS HELPERS
    // =====================================================

    const getStatusClass = (status) => {
        if (status === "PASS") {
            return "quality-pass";
        }

        if (status === "WARNING") {
            return "quality-warning";
        }

        if (status === "FAIL") {
            return "quality-fail";
        }

        return "";
    };

    const getStatusIcon = (status) => {
        if (status === "PASS") {
            return "✓";
        }

        if (status === "WARNING") {
            return "!";
        }

        if (status === "FAIL") {
            return "×";
        }

        return "";
    };

    // =====================================================
    // SUMMARY
    // =====================================================

    const passCount = quality.filter(
        (item) => item.qualityStatus === "PASS"
    ).length;

    const warningCount = quality.filter(
        (item) => item.qualityStatus === "WARNING"
    ).length;

    const failCount = quality.filter(
        (item) => item.qualityStatus === "FAIL"
    ).length;

    const totalCount = quality.length;

    const passRate =
        totalCount > 0
            ? ((passCount / totalCount) * 100).toFixed(1)
            : "0.0";

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>

                <p>
                    Loading quality inspection data...
                </p>
            </div>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="page">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-header">

                <div>

                    <div className="breadcrumb">
                        Quality / Inspection
                    </div>

                    <h2>
                        Quality Inspection
                    </h2>

                    <p>
                        Monitor paper quality and inspection results
                    </p>

                </div>

                <Link
                    to="/add-quality"
                    className="primary-btn"
                >
                    <span>+</span>
                    New Inspection
                </Link>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="summary-grid">

                <div className="summary-card quality-summary-card">

                    <div className="summary-card-icon pass-icon">
                        ✓
                    </div>

                    <div>
                        <span className="summary-label">
                            Passed
                        </span>

                        <strong className="text-green">
                            {passCount}
                        </strong>
                    </div>

                </div>


                <div className="summary-card quality-summary-card">

                    <div className="summary-card-icon warning-icon">
                        !
                    </div>

                    <div>
                        <span className="summary-label">
                            Warning
                        </span>

                        <strong className="text-orange">
                            {warningCount}
                        </strong>
                    </div>

                </div>


                <div className="summary-card quality-summary-card">

                    <div className="summary-card-icon fail-icon">
                        ×
                    </div>

                    <div>
                        <span className="summary-label">
                            Failed
                        </span>

                        <strong className="text-red">
                            {failCount}
                        </strong>
                    </div>

                </div>


                <div className="summary-card">

                    <span className="summary-label">
                        Pass Rate
                    </span>

                    <strong>
                        {passRate}%
                    </strong>

                    <div className="quality-mini-bar">
                        <div
                            style={{
                                width: `${passRate}%`
                            }}
                        ></div>
                    </div>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* =================================================
                EDIT PANEL
            ================================================= */}

            {editingQuality && (

                <div className="edit-panel">

                    <div className="edit-panel-header">

                        <div>

                            <h3>
                                Edit Quality Inspection
                            </h3>

                            <p>
                                Update inspection measurements and
                                defect information.
                            </p>

                        </div>

                        <button
                            className="close-btn"
                            onClick={cancelEdit}
                        >
                            ×
                        </button>

                    </div>


                    <form
                        className="form-grid"
                        onSubmit={updateQuality}
                    >

                        <div className="form-group">

                            <label>
                                Batch ID
                            </label>

                            <input
                                type="text"
                                name="batchId"
                                value={formData.batchId}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Paper Type
                            </label>

                            <input
                                type="text"
                                name="paperType"
                                value={formData.paperType}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Thickness (mm)
                            </label>

                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                name="thickness"
                                value={formData.thickness}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Moisture (%)
                            </label>

                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                name="moisture"
                                value={formData.moisture}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Strength
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="strength"
                                value={formData.strength}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Defect Count
                            </label>

                            <input
                                type="number"
                                min="0"
                                name="defectCount"
                                value={formData.defectCount}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-actions">

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
                                Save Changes
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =================================================
                TABLE HEADER
            ================================================= */}

            <div className="section-header">

                <div>

                    <h3>
                        Inspection Records
                    </h3>

                    <p>
                        Quality measurements and inspection status
                    </p>

                </div>

                <button
                    className="secondary-btn"
                    onClick={fetchQuality}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =================================================
                QUALITY TABLE
            ================================================= */}

            <div className="table-container">

                {quality.length > 0 ? (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Batch ID
                                </th>

                                <th>
                                    Paper Type
                                </th>

                                <th>
                                    Thickness
                                </th>

                                <th>
                                    Moisture
                                </th>

                                <th>
                                    Strength
                                </th>

                                <th>
                                    Defects
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Inspected
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {quality.map((item) => (

                                <tr key={item._id}>

                                    <td>
                                        <strong>
                                            {item.batchId}
                                        </strong>
                                    </td>

                                    <td>
                                        {item.paperType}
                                    </td>

                                    <td>
                                        {item.thickness} mm
                                    </td>

                                    <td>
                                        {item.moisture}%
                                    </td>

                                    <td>
                                        {item.strength}
                                    </td>

                                    <td>
                                        {item.defectCount}
                                    </td>

                                    <td>

                                        <span
                                            className={`quality-status-badge ${getStatusClass(
                                                item.qualityStatus
                                            )}`}
                                        >

                                            <span className="quality-status-icon">
                                                {getStatusIcon(
                                                    item.qualityStatus
                                                )}
                                            </span>

                                            {item.qualityStatus}

                                        </span>

                                    </td>

                                    <td>
                                        {item.inspectedAt
                                            ? new Date(
                                                  item.inspectedAt
                                              ).toLocaleString(
                                                  "en-IN"
                                              )
                                            : "-"}
                                    </td>

                                    <td>

                                        <div className="table-actions">

                                            <button
                                                className="edit-btn"
                                                onClick={() =>
                                                    startEdit(item)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteQuality(
                                                        item._id
                                                    )
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

                ) : (

                    <div className="empty-state">

                        <div className="empty-icon">
                            ✓
                        </div>

                        <h3>
                            No Quality Inspections
                        </h3>

                        <p>
                            Add your first quality inspection
                            to start monitoring paper quality.
                        </p>

                        <Link
                            to="/add-quality"
                            className="primary-btn"
                        >
                            + New Inspection
                        </Link>

                    </div>

                )}

            </div>


            {/* =================================================
                QUALITY RULES
            ================================================= */}

            <div className="quality-rules">

                <div className="quality-rules-header">

                    <div>
                        <h3>
                            Quality Classification
                        </h3>

                        <p>
                            Automatic classification based on
                            defect count
                        </p>
                    </div>

                </div>

                <div className="quality-rule-grid">

                    <div className="quality-rule pass-rule">

                        <span className="rule-icon">
                            ✓
                        </span>

                        <div>

                            <strong>
                                PASS
                            </strong>

                            <span>
                                0–5 defects
                            </span>

                        </div>

                    </div>


                    <div className="quality-rule warning-rule">

                        <span className="rule-icon">
                            !
                        </span>

                        <div>

                            <strong>
                                WARNING
                            </strong>

                            <span>
                                6–10 defects
                            </span>

                        </div>

                    </div>


                    <div className="quality-rule fail-rule">

                        <span className="rule-icon">
                            ×
                        </span>

                        <div>

                            <strong>
                                FAIL
                            </strong>

                            <span>
                                More than 10 defects
                            </span>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Quality;