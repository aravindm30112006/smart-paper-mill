import { useEffect, useState } from "react";
import axios from "axios";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useLocation
} from "react-router-dom";

import Production from "./pages/Production";
import Pulp from "./pages/Pulp";
import Quality from "./pages/Quality";
import Maintenance from "./pages/Maintenance";
import Dashboard from "./pages/Dashboard";
import Alerts from "./pages/Alerts";

import AddMachine from "./pages/AddMachine";
import AddProduction from "./pages/AddProduction";
import AddPulp from "./pages/AddPulp";
import AddQuality from "./pages/AddQuality";
import AddMaintenance from "./pages/AddMaintenance";

import "./App.css";

/* =========================================================
   MACHINES PAGE
========================================================= */

function Machines() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingMachine, setEditingMachine] = useState(null);

    const [formData, setFormData] = useState({
        machineName: "",
        productionLine: "",
        status: "Idle",
        temperature: "",
        utilization: "",
        operatingHours: ""
    });

    const fetchMachines = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:5000/api/machines"
            );

            setMachines(response.data);
        } catch (err) {
            console.error(err);
            setError("Unable to load machine data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMachines();
    }, []);

    const startEdit = (machine) => {
        setEditingMachine(machine._id);

        setFormData({
            machineName: machine.machineName,
            productionLine: machine.productionLine,
            status: machine.status,
            temperature: machine.temperature,
            utilization: machine.utilization,
            operatingHours: machine.operatingHours
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const cancelEdit = () => {
        setEditingMachine(null);

        setFormData({
            machineName: "",
            productionLine: "",
            status: "Idle",
            temperature: "",
            utilization: "",
            operatingHours: ""
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const updateMachine = async (e) => {
        e.preventDefault();

        try {
            await axios.put(
                `http://localhost:5000/api/machines/${editingMachine}`,
                {
                    ...formData,
                    temperature: Number(formData.temperature),
                    utilization: Number(formData.utilization),
                    operatingHours: Number(formData.operatingHours)
                }
            );

            alert("Machine updated successfully.");

            cancelEdit();
            fetchMachines();
        } catch (err) {
            console.error(err);
            alert("Failed to update machine.");
        }
    };

    const deleteMachine = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this machine?"
        );

        if (!confirmDelete) return;

        try {
            await axios.delete(
                `http://localhost:5000/api/machines/${id}`
            );

            fetchMachines();
        } catch (err) {
            console.error(err);
            alert("Failed to delete machine.");
        }
    };

    const getStatusClass = (status) => {
        if (status === "Running") return "status-running";
        if (status === "Maintenance") return "status-maintenance";
        return "status-idle";
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading machine data...</p>
            </div>
        );
    }

    return (
        <div className="page">

            {/* PAGE HEADER */}

            <div className="page-header">
                <div>
                    <div className="breadcrumb">
                        Monitoring / Machines
                    </div>

                    <h2>Machines</h2>

                    <p>
                        Monitor and manage paper mill machinery
                    </p>
                </div>

                <Link
                    to="/add-machine"
                    className="primary-btn"
                >
                    <span>+</span>
                    Add Machine
                </Link>
            </div>

            {/* EDIT MACHINE */}

            {editingMachine && (
                <div className="edit-panel">

                    <div className="edit-panel-header">
                        <div>
                            <h3>Edit Machine</h3>
                            <p>
                                Update machine configuration and operating
                                parameters.
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
                        onSubmit={updateMachine}
                    >

                        <div className="form-group">
                            <label>Machine Name</label>

                            <input
                                type="text"
                                name="machineName"
                                value={formData.machineName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Production Line</label>

                            <input
                                type="text"
                                name="productionLine"
                                value={formData.productionLine}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="Running">
                                    Running
                                </option>

                                <option value="Idle">
                                    Idle
                                </option>

                                <option value="Maintenance">
                                    Maintenance
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Temperature (°C)</label>

                            <input
                                type="number"
                                name="temperature"
                                value={formData.temperature}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Utilization (%)</label>

                            <input
                                type="number"
                                name="utilization"
                                min="0"
                                max="100"
                                value={formData.utilization}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Operating Hours</label>

                            <input
                                type="number"
                                name="operatingHours"
                                value={formData.operatingHours}
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

            {/* SUMMARY */}

            <div className="summary-grid">

                <div className="summary-card">
                    <span className="summary-label">
                        Total Machines
                    </span>

                    <strong>
                        {machines.length}
                    </strong>
                </div>

                <div className="summary-card">
                    <span className="summary-label">
                        Running
                    </span>

                    <strong className="text-green">
                        {
                            machines.filter(
                                (machine) =>
                                    machine.status === "Running"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span className="summary-label">
                        Maintenance
                    </span>

                    <strong className="text-orange">
                        {
                            machines.filter(
                                (machine) =>
                                    machine.status === "Maintenance"
                            ).length
                        }
                    </strong>
                </div>

                <div className="summary-card">
                    <span className="summary-label">
                        Idle
                    </span>

                    <strong className="text-gray">
                        {
                            machines.filter(
                                (machine) =>
                                    machine.status === "Idle"
                            ).length
                        }
                    </strong>
                </div>

            </div>

            {/* ERROR */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* MACHINE CARDS */}

            <div className="section-header">
                <div>
                    <h3>Machine Overview</h3>
                    <p>
                        Current operating status and performance
                    </p>
                </div>

                <button
                    className="secondary-btn"
                    onClick={fetchMachines}
                >
                    ↻ Refresh
                </button>
            </div>

            <div className="machine-grid">

                {machines.map((machine) => (

                    <div
                        className="machine-card"
                        key={machine._id}
                    >

                        <div className="machine-card-top">

                            <div className="machine-icon">
                                ⚙
                            </div>

                            <span
                                className={`machine-status ${getStatusClass(
                                    machine.status
                                )}`}
                            >
                                <span className="status-dot-small"></span>

                                {machine.status}
                            </span>

                        </div>

                        <h3>
                            {machine.machineName}
                        </h3>

                        <p className="machine-line">
                            {machine.productionLine}
                        </p>

                        <div className="machine-details">

                            <div className="machine-detail">
                                <span>Temperature</span>

                                <strong>
                                    {machine.temperature}°C
                                </strong>
                            </div>

                            <div className="machine-detail">
                                <span>Utilization</span>

                                <strong>
                                    {machine.utilization}%
                                </strong>
                            </div>

                            <div className="machine-detail">
                                <span>Operating Hours</span>

                                <strong>
                                    {machine.operatingHours} h
                                </strong>
                            </div>

                        </div>

                        <div className="utilization-section">

                            <div className="utilization-header">
                                <span>Utilization</span>

                                <strong>
                                    {machine.utilization}%
                                </strong>
                            </div>

                            <div className="utilization-bar">
                                <div
                                    className="utilization-fill"
                                    style={{
                                        width: `${machine.utilization}%`
                                    }}
                                ></div>
                            </div>

                        </div>

                        <div className="machine-actions">

                            <button
                                className="edit-btn"
                                onClick={() =>
                                    startEdit(machine)
                                }
                            >
                                Edit
                            </button>

                            <button
                                className="delete-btn"
                                onClick={() =>
                                    deleteMachine(machine._id)
                                }
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {machines.length === 0 && (
                <div className="empty-state">
                    <div className="empty-icon">⚙</div>

                    <h3>No Machines Found</h3>

                    <p>
                        Add your first paper mill machine to get started.
                    </p>

                    <Link
                        to="/add-machine"
                        className="primary-btn"
                    >
                        + Add Machine
                    </Link>
                </div>
            )}

        </div>
    );
}


/* =========================================================
   SIDEBAR
========================================================= */

function Sidebar() {
    const location = useLocation();

    const menuItems = [
        {
            path: "/",
            label: "Dashboard",
            icon: "▦"
        },
        {
            path: "/machines",
            label: "Machines",
            icon: "⚙"
        },
        {
            path: "/production",
            label: "Production",
            icon: "▤"
        },
        {
            path: "/pulp",
            label: "Pulp Monitoring",
            icon: "◉"
        },
        {
            path: "/quality",
            label: "Quality",
            icon: "✓"
        },
        {
            path: "/maintenance",
            label: "Maintenance",
            icon: "🔧"
        },
        {
            path: "/alerts",
            label: "Alerts",
            icon: "⚠"
        }
    ];

    return (
        <aside className="sidebar">

            <div className="sidebar-brand">

                <div className="sidebar-logo">
                    🏭
                </div>

                <div>
                    <h2>Smart Paper Mill</h2>

                    <span>
                        Industrial Control
                    </span>
                </div>

            </div>

            <div className="sidebar-section-title">
                MAIN MENU
            </div>

            <nav className="sidebar-nav">

                {menuItems.map((item) => {

                    const active =
                        location.pathname === item.path ||
                        (
                            item.path !== "/" &&
                            location.pathname.startsWith(item.path)
                        );

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={
                                active
                                    ? "sidebar-link active"
                                    : "sidebar-link"
                            }
                        >

                            <span className="sidebar-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.label}
                            </span>

                        </Link>
                    );

                })}

            </nav>

            <div className="sidebar-bottom">

                <div className="online-card">

                    <span className="online-indicator"></span>

                    <div>
                        <strong>System Online</strong>
                        <small>All services connected</small>
                    </div>

                </div>

            </div>

        </aside>
    );
}


/* =========================================================
   TOP HEADER
========================================================= */

function TopHeader() {

    const location = useLocation();

    const pageTitles = {
        "/": "Dashboard",
        "/machines": "Machines",
        "/production": "Production",
        "/pulp": "Pulp Monitoring",
        "/quality": "Quality Inspection",
        "/maintenance": "Maintenance",
        "/alerts": "Alerts",
        "/add-machine": "Add Machine",
        "/add-production": "Add Production",
        "/add-pulp": "Add Pulp Data",
        "/add-quality": "Add Quality Inspection",
        "/add-maintenance": "Schedule Maintenance"
    };

    const title =
        pageTitles[location.pathname] || "Smart Paper Mill";

    return (
        <header className="top-header">

            <div>

                <div className="top-breadcrumb">
                    Smart Paper Mill / {title}
                </div>

                <h1>
                    {title}
                </h1>

            </div>

            <div className="header-right">

                <div className="system-online">

                    <span></span>

                    System Online

                </div>

                <div className="header-date">
                    Industrial Monitoring
                </div>

            </div>

        </header>
    );
}


/* =========================================================
   APP
========================================================= */

function App() {

    return (
        <BrowserRouter>

            <div className="app-layout">

                <Sidebar />

                <div className="main-area">

                    <TopHeader />

                    <main className="content">

                        <Routes>

                            <Route
                                path="/"
                                element={<Dashboard />}
                            />

                            <Route
                                path="/machines"
                                element={<Machines />}
                            />

                            <Route
                                path="/production"
                                element={<Production />}
                            />

                            <Route
                                path="/pulp"
                                element={<Pulp />}
                            />

                            <Route
                                path="/quality"
                                element={<Quality />}
                            />

                            <Route
                                path="/maintenance"
                                element={<Maintenance />}
                            />

                            <Route
                                path="/alerts"
                                element={<Alerts />}
                            />

                            <Route
                                path="/add-machine"
                                element={<AddMachine />}
                            />

                            <Route
                                path="/add-production"
                                element={<AddProduction />}
                            />

                            <Route
                                path="/add-pulp"
                                element={<AddPulp />}
                            />

                            <Route
                                path="/add-quality"
                                element={<AddQuality />}
                            />

                            <Route
                                path="/add-maintenance"
                                element={<AddMaintenance />}
                            />

                        </Routes>

                    </main>

                    <footer className="app-footer">
                        <span>
                            Smart Paper Mill
                        </span>

                        <span>
                            Industrial Monitoring System
                        </span>

                        <span>
                            MERN Stack
                        </span>
                    </footer>

                </div>

            </div>

        </BrowserRouter>
    );
}

export default App;