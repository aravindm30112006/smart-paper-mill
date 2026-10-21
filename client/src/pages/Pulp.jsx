import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Pulp() {
    const [pulpData, setPulpData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingPulp, setEditingPulp] = useState(null);

    const [formData, setFormData] = useState({
        batchId: "",
        temperature: "",
        pressure: "",
        moisture: "",
        ph: "",
        flowRate: "",
        status: "Normal"
    });

    // =====================================================
    // FETCH PULP DATA
    // =====================================================

    const fetchPulpData = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/pulp"
            );

            setPulpData(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load pulp monitoring data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPulpData();
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
        setEditingPulp(item._id);

        setFormData({
            batchId: item.batchId || "",
            temperature: item.temperature ?? "",
            pressure: item.pressure ?? "",
            moisture: item.moisture ?? "",
            ph: item.ph ?? "",
            flowRate: item.flowRate ?? "",
            status: item.status || "Normal"
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const cancelEdit = () => {
        setEditingPulp(null);

        setFormData({
            batchId: "",
            temperature: "",
            pressure: "",
            moisture: "",
            ph: "",
            flowRate: "",
            status: "Normal"
        });
    };

    const updatePulp = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `http://localhost:5000/api/pulp/${editingPulp}`,
                {
                    batchId: formData.batchId,
                    temperature: Number(formData.temperature),
                    pressure: Number(formData.pressure),
                    moisture: Number(formData.moisture),
                    ph: Number(formData.ph),
                    flowRate: Number(formData.flowRate),
                    status: formData.status
                }
            );

            alert("Pulp data updated successfully.");

            cancelEdit();
            fetchPulpData();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                    "Failed to update pulp data."
            );
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deletePulp = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this pulp record?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/pulp/${id}`
            );

            alert("Pulp data deleted successfully.");

            fetchPulpData();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                    "Failed to delete pulp data."
            );
        }
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (status) => {
        if (status === "Normal") {
            return "pulp-normal";
        }

        if (status === "Warning") {
            return "pulp-warning";
        }

        if (status === "Critical") {
            return "pulp-critical";
        }

        return "";
    };

    // =====================================================
    // SUMMARY
    // =====================================================

    const normalCount = pulpData.filter(
        (item) => item.status === "Normal"
    ).length;

    const warningCount = pulpData.filter(
        (item) => item.status === "Warning"
    ).length;

    const criticalCount = pulpData.filter(
        (item) => item.status === "Critical"
    ).length;

    const latestRecord =
        pulpData.length > 0
            ? pulpData[0]
            : null;

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>

                <p>
                    Loading pulp monitoring data...
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
                        Operations / Pulp Monitoring
                    </div>

                    <h2>
                        Pulp Monitoring
                    </h2>

                    <p>
                        Monitor pulp processing parameters and
                        operating conditions
                    </p>

                </div>

                <Link
                    to="/add-pulp"
                    className="primary-btn"
                >
                    <span>+</span>
                    Add Pulp Data
                </Link>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="summary-grid">

                <div className="summary-card">

                    <span className="summary-label">
                        Total Records
                    </span>

                    <strong>
                        {pulpData.length}
                    </strong>

                </div>


                <div className="summary-card">

                    <span className="summary-label">
                        Normal
                    </span>

                    <strong className="text-green">
                        {normalCount}
                    </strong>

                </div>


                <div className="summary-card">

                    <span className="summary-label">
                        Warning
                    </span>

                    <strong className="text-orange">
                        {warningCount}
                    </strong>

                </div>


                <div className="summary-card">

                    <span className="summary-label">
                        Critical
                    </span>

                    <strong
                        style={{
                            color: "#dc2626"
                        }}
                    >
                        {criticalCount}
                    </strong>

                </div>

            </div>


            {/* =================================================
                LATEST READING
            ================================================= */}

            {latestRecord && (

                <div className="latest-pulp-card">

                    <div className="latest-pulp-header">

                        <div>

                            <h3>
                                Latest Pulp Reading
                            </h3>

                            <p>
                                Current processing parameters
                            </p>

                        </div>

                        <span
                            className={`pulp-status-badge ${getStatusClass(
                                latestRecord.status
                            )}`}
                        >
                            {latestRecord.status}
                        </span>

                    </div>


                    <div className="pulp-metrics">

                        <div className="pulp-metric">

                            <span>
                                Batch
                            </span>

                            <strong>
                                {latestRecord.batchId}
                            </strong>

                        </div>

                        <div className="pulp-metric">

                            <span>
                                Temperature
                            </span>

                            <strong>
                                {latestRecord.temperature}°C
                            </strong>

                        </div>

                        <div className="pulp-metric">

                            <span>
                                Pressure
                            </span>

                            <strong>
                                {latestRecord.pressure} bar
                            </strong>

                        </div>

                        <div className="pulp-metric">

                            <span>
                                Moisture
                            </span>

                            <strong>
                                {latestRecord.moisture}%
                            </strong>

                        </div>

                        <div className="pulp-metric">

                            <span>
                                pH
                            </span>

                            <strong>
                                {latestRecord.ph}
                            </strong>

                        </div>

                        <div className="pulp-metric">

                            <span>
                                Flow Rate
                            </span>

                            <strong>
                                {latestRecord.flowRate}
                            </strong>

                        </div>

                    </div>

                </div>

            )}


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

            {editingPulp && (

                <div className="edit-panel">

                    <div className="edit-panel-header">

                        <div>

                            <h3>
                                Edit Pulp Data
                            </h3>

                            <p>
                                Update pulp processing parameters.
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
                        onSubmit={updatePulp}
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
                                Temperature (°C)
                            </label>

                            <input
                                type="number"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Pressure (bar)
                            </label>

                            <input
                                type="number"
                                step="0.1"
                                name="pressure"
                                value={formData.pressure}
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
                                name="moisture"
                                value={formData.moisture}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                pH
                            </label>

                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                max="14"
                                name="ph"
                                value={formData.ph}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Flow Rate
                            </label>

                            <input
                                type="number"
                                name="flowRate"
                                value={formData.flowRate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >

                                <option value="Normal">
                                    Normal
                                </option>

                                <option value="Warning">
                                    Warning
                                </option>

                                <option value="Critical">
                                    Critical
                                </option>

                            </select>

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
                        Pulp Processing History
                    </h3>

                    <p>
                        Recorded pulp processing parameters
                    </p>

                </div>

                <button
                    className="secondary-btn"
                    onClick={fetchPulpData}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =================================================
                TABLE
            ================================================= */}

            <div className="table-container">

                {pulpData.length > 0 ? (

                    <table className="data-table">

                        <thead>

                            <tr>

                                <th>
                                    Batch ID
                                </th>

                                <th>
                                    Temperature
                                </th>

                                <th>
                                    Pressure
                                </th>

                                <th>
                                    Moisture
                                </th>

                                <th>
                                    pH
                                </th>

                                <th>
                                    Flow Rate
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Recorded
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {pulpData.map((item) => (

                                <tr key={item._id}>

                                    <td>
                                        <strong>
                                            {item.batchId}
                                        </strong>
                                    </td>

                                    <td>
                                        {item.temperature}°C
                                    </td>

                                    <td>
                                        {item.pressure} bar
                                    </td>

                                    <td>
                                        {item.moisture}%
                                    </td>

                                    <td>
                                        {item.ph}
                                    </td>

                                    <td>
                                        {item.flowRate}
                                    </td>

                                    <td>

                                        <span
                                            className={`pulp-status-badge ${getStatusClass(
                                                item.status
                                            )}`}
                                        >
                                            {item.status}
                                        </span>

                                    </td>

                                    <td>
                                        {item.recordedAt
                                            ? new Date(
                                                  item.recordedAt
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
                                                    deletePulp(
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
                            ◉
                        </div>

                        <h3>
                            No Pulp Data
                        </h3>

                        <p>
                            Add your first pulp monitoring
                            record to start tracking conditions.
                        </p>

                        <Link
                            to="/add-pulp"
                            className="primary-btn"
                        >
                            + Add Pulp Data
                        </Link>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Pulp;