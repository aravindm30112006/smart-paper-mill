import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Production() {
    const [production, setProduction] = useState([]);
    const [machines, setMachines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingProduction, setEditingProduction] = useState(null);

    const [formData, setFormData] = useState({
        batchId: "",
        paperType: "",
        quantity: "",
        productionDate: "",
        machine: ""
    });

    // =====================================================
    // FETCH DATA
    // =====================================================

    const fetchProduction = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/production"
            );

            setProduction(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load production data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchMachines = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/api/machines"
            );

            setMachines(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProduction();
        fetchMachines();
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

            alert("Production record updated successfully.");

            cancelEdit();
            fetchProduction();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                    "Failed to update production record."
            );
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deleteProduction = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this production record?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/production/${id}`
            );

            alert("Production record deleted successfully.");

            fetchProduction();
        } catch (err) {
            console.error(err);

            alert(
                err.response?.data?.message ||
                    "Failed to delete production record."
            );
        }
    };

    // =====================================================
    // SUMMARY CALCULATIONS
    // =====================================================

    const totalProduction = production.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0
    );

    const totalBatches = production.length;

    const averageProduction =
        totalBatches > 0
            ? totalProduction / totalBatches
            : 0;

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>

                <p>
                    Loading production data...
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
                        Operations / Production
                    </div>

                    <h2>
                        Production
                    </h2>

                    <p>
                        Track production batches and manufacturing
                        output
                    </p>

                </div>

                <Link
                    to="/add-production"
                    className="primary-btn"
                >
                    <span>+</span>
                    Add Production
                </Link>

            </div>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="summary-grid">

                <div className="summary-card">

                    <span className="summary-label">
                        Total Production
                    </span>

                    <strong>
                        {totalProduction.toLocaleString()} kg
                    </strong>

                </div>


                <div className="summary-card">

                    <span className="summary-label">
                        Total Batches
                    </span>

                    <strong>
                        {totalBatches}
                    </strong>

                </div>


                <div className="summary-card">

                    <span className="summary-label">
                        Average per Batch
                    </span>

                    <strong>
                        {Math.round(
                            averageProduction
                        ).toLocaleString()} kg
                    </strong>

                </div>


                <div className="summary-card">

                    <span className="summary-label">
                        Production Status
                    </span>

                    <strong className="text-green">
                        Active
                    </strong>

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
                EDIT FORM
            ================================================= */}

            {editingProduction && (

                <div className="edit-panel">

                    <div className="edit-panel-header">

                        <div>

                            <h3>
                                Edit Production
                            </h3>

                            <p>
                                Update production batch information.
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
                        onSubmit={updateProduction}
                    >

                        {/* Batch ID */}

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


                        {/* Paper Type */}

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


                        {/* Quantity */}

                        <div className="form-group">

                            <label>
                                Quantity (kg)
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                min="0"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Production Date */}

                        <div className="form-group">

                            <label>
                                Production Date
                            </label>

                            <input
                                type="date"
                                name="productionDate"
                                value={formData.productionDate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Machine */}

                        <div className="form-group">

                            <label>
                                Machine
                            </label>

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
                                        {" - "}
                                        {machine.productionLine}
                                    </option>

                                ))}

                            </select>

                        </div>


                        {/* Actions */}

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
                PRODUCTION TABLE HEADER
            ================================================= */}

            <div className="section-header">

                <div>

                    <h3>
                        Production Records
                    </h3>

                    <p>
                        Production batches and machine allocation
                    </p>

                </div>

                <button
                    className="secondary-btn"
                    onClick={fetchProduction}
                >
                    ↻ Refresh
                </button>

            </div>


            {/* =================================================
                PRODUCTION TABLE
            ================================================= */}

            <div className="table-container">

                {production.length > 0 ? (

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
                                    Quantity
                                </th>

                                <th>
                                    Production Date
                                </th>

                                <th>
                                    Machine
                                </th>

                                <th>
                                    Production Line
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {production.map((item) => (

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
                                        <strong>
                                            {Number(
                                                item.quantity || 0
                                            ).toLocaleString()}
                                            {" kg"}
                                        </strong>
                                    </td>

                                    <td>
                                        {item.productionDate
                                            ? new Date(
                                                  item.productionDate
                                              ).toLocaleDateString(
                                                  "en-IN"
                                              )
                                            : "-"}
                                    </td>

                                    <td>
                                        {item.machine?.machineName ||
                                            "Unknown"}
                                    </td>

                                    <td>
                                        {item.machine?.productionLine ||
                                            "-"}
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
                                                    deleteProduction(
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
                            📦
                        </div>

                        <h3>
                            No Production Records
                        </h3>

                        <p>
                            Add your first production batch to
                            start tracking output.
                        </p>

                        <Link
                            to="/add-production"
                            className="primary-btn"
                        >
                            + Add Production
                        </Link>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Production;