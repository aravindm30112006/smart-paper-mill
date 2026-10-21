import { useState, useEffect } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    NavLink,
    useLocation,
    Navigate,
    useNavigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Machines from "./pages/Machines";
import Production from "./pages/Production";
import Pulp from "./pages/Pulp";
import Quality from "./pages/Quality";
import Maintenance from "./pages/Maintenance";
import Alerts from "./pages/Alerts";
import AddMachine from "./pages/AddMachine";
import AddProduction from "./pages/AddProduction";
import AddPulp from "./pages/AddPulp";
import AddQuality from "./pages/AddQuality";
import AddMaintenance from "./pages/AddMaintenance";

import {
    LayoutDashboard,
    Cpu,
    Layers,
    Droplets,
    ShieldCheck,
    Wrench,
    AlertTriangle,
    Menu,
    X,
    Factory,
    Activity,
    Bell,
    ExternalLink,
    LogOut
} from "lucide-react";

import "./App.css";

/* =========================================================
   PRIVATE ROUTE
   ========================================================= */

function PrivateRoute({ element }) {
    const isAuth = localStorage.getItem("isAuthenticated") === "true";
    return isAuth ? element : <Navigate to="/login" replace />;
}

/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

function Sidebar({ mobileOpen, setMobileOpen }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname, setMobileOpen]);

    const navItems = [
        { path: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
        { path: "/machines", label: "Machines & Lines", icon: Cpu },
        { path: "/production", label: "Production Batches", icon: Layers },
        { path: "/pulp", label: "Pulp Monitoring", icon: Droplets },
        { path: "/quality", label: "Quality Inspection", icon: ShieldCheck },
        { path: "/maintenance", label: "Maintenance Orders", icon: Wrench },
        { path: "/alerts", label: "Active Alerts", icon: AlertTriangle }
    ];

    const handleLogout = () => {
        localStorage.removeItem("isAuthenticated");
        navigate("/login", { replace: true });
    };

    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="sidebar-backdrop"
                    onClick={() => setMobileOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside className={`app-sidebar ${mobileOpen ? "open" : ""}`}>
                {/* BRAND HEADER */}
                <div className="sidebar-brand">
                    <div className="sidebar-logo">
                        <Factory size={20} className="text-white" />
                    </div>
                    <div className="sidebar-brand-text">
                        <span className="brand-title">PULP & PAPER</span>
                        <span className="brand-subtitle">Smart Mill SCADA</span>
                    </div>
                    <button
                        className="sidebar-close-mobile"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* NAVIGATION SECTION */}
                <div className="sidebar-nav-container">
                    <div className="sidebar-section-title">OPERATIONS MENU</div>
                    <nav className="sidebar-nav">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = item.exact
                                ? location.pathname === item.path
                                : location.pathname === item.path ||
                                  (item.path !== "/" && location.pathname.startsWith(item.path));

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`sidebar-nav-item ${isActive ? "active" : ""}`}
                                >
                                    <Icon size={17} className="sidebar-nav-icon" />
                                    <span className="sidebar-nav-label">{item.label}</span>
                                    {item.path === "/alerts" && (
                                        <span className="sidebar-badge-dot" />
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* SIDEBAR FOOTER */}
                <div className="sidebar-footer">
                    <div className="system-health-card">
                        <div className="health-header">
                            <span className="health-dot-pulse" />
                            <span className="health-title">SCADA Online</span>
                        </div>
                        <p className="health-sub">Telemetry Engine v2.4</p>
                    </div>
                    {/* LOGOUT BUTTON */}
                    <button className="sidebar-logout-btn" onClick={handleLogout}>
                        <LogOut size={15} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}

/* =========================================================
   TOP HEADER BAR
   ========================================================= */

function TopHeader({ onToggleMobile }) {
    const location = useLocation();

    const pageMeta = {
        "/": { title: "Operations Dashboard", category: "Plant Overview" },
        "/machines": { title: "Machines & Lines", category: "Asset Monitoring" },
        "/production": { title: "Production Batches", category: "Manufacturing Runs" },
        "/pulp": { title: "Pulp Monitoring", category: "Process Telemetry" },
        "/quality": { title: "Quality Inspection", category: "Assurance" },
        "/maintenance": { title: "Maintenance Orders", category: "Plant Reliability" },
        "/alerts": { title: "Active Alerts", category: "Surveillance" },
        "/add-machine": { title: "Add Machine", category: "Asset Management" },
        "/add-production": { title: "Add Production", category: "Batch Tracking" },
        "/add-pulp": { title: "Add Pulp Data", category: "Process Logging" },
        "/add-quality": { title: "Add Quality Inspection", category: "QA Protocol" },
        "/add-maintenance": { title: "Add Maintenance", category: "Service Dispatch" }
    };

    const currentMeta = pageMeta[location.pathname] || {
        title: "Smart Paper Mill",
        category: "Operations"
    };

    const todayDate = new Date().toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    return (
        <header className="app-top-header">
            <div className="header-left">
                <button
                    className="mobile-menu-trigger"
                    onClick={onToggleMobile}
                    aria-label="Open mobile menu"
                >
                    <Menu size={20} />
                </button>
                <div className="header-breadcrumbs-block">
                    <div className="header-breadcrumb">
                        <span>Smart Paper Mill</span>
                        <span className="crumb-separator">/</span>
                        <span>{currentMeta.category}</span>
                        <span className="crumb-separator">/</span>
                        <span className="crumb-active">{currentMeta.title}</span>
                    </div>
                </div>
            </div>
            <div className="header-right">
                <div className="header-status-badge">
                    <span className="status-live-dot" />
                    <span className="status-live-text">Plant Network Active</span>
                </div>
                <div className="header-date-badge">
                    <span>{todayDate}</span>
                </div>
            </div>
        </header>
    );
}

/* =========================================================
   SHELL LAYOUT (sidebar + header + footer wrapper)
   Only shown for authenticated/protected pages
   ========================================================= */

function AppShell({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
            <div className="app-main-viewport">
                <TopHeader onToggleMobile={() => setMobileOpen(!mobileOpen)} />
                <main className="app-content-body">
                    {children}
                </main>
                <footer className="app-system-footer">
                    <div className="footer-left">
                        <span className="font-semibold text-primary">Smart Paper Mill Operations</span>
                        <span className="footer-sep">•</span>
                        <span>Enterprise SCADA &amp; Manufacturing Execution System</span>
                    </div>
                    <div className="footer-right">
                        <span>System Status: Optimal</span>
                        <span className="footer-sep">•</span>
                        <span>v2.4.0-PROD</span>
                    </div>
                </footer>
            </div>
        </div>
    );
}

/* =========================================================
   MAIN APP ROUTER
   ========================================================= */

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* PUBLIC — full-page, no shell */}
                <Route path="/login" element={<Login />} />

                {/* PROTECTED — wrapped in AppShell */}
                <Route path="/" element={<PrivateRoute element={<AppShell><Dashboard /></AppShell>} />} />
                <Route path="/machines" element={<PrivateRoute element={<AppShell><Machines /></AppShell>} />} />
                <Route path="/production" element={<PrivateRoute element={<AppShell><Production /></AppShell>} />} />
                <Route path="/pulp" element={<PrivateRoute element={<AppShell><Pulp /></AppShell>} />} />
                <Route path="/quality" element={<PrivateRoute element={<AppShell><Quality /></AppShell>} />} />
                <Route path="/maintenance" element={<PrivateRoute element={<AppShell><Maintenance /></AppShell>} />} />
                <Route path="/alerts" element={<PrivateRoute element={<AppShell><Alerts /></AppShell>} />} />
                <Route path="/add-machine" element={<PrivateRoute element={<AppShell><AddMachine /></AppShell>} />} />
                <Route path="/add-production" element={<PrivateRoute element={<AppShell><AddProduction /></AppShell>} />} />
                <Route path="/add-pulp" element={<PrivateRoute element={<AppShell><AddPulp /></AppShell>} />} />
                <Route path="/add-quality" element={<PrivateRoute element={<AppShell><AddQuality /></AppShell>} />} />
                <Route path="/add-maintenance" element={<PrivateRoute element={<AppShell><AddMaintenance /></AppShell>} />} />

                {/* Catch-all → login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
