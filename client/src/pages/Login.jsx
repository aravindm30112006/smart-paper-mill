import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Factory, Shield } from "lucide-react";
import "./Login.css";

const DEMO_EMAIL = "admin@smartpapermill.com";
const DEMO_PASSWORD = "admin123";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        if (!password) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
                localStorage.setItem("isAuthenticated", "true");
                navigate("/", { replace: true });
            } else {
                setError("Invalid email or password. Please try again.");
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="login-page">
            {/* Left panel — branding */}
            <div className="login-left">
                <div className="login-brand">
                    <div className="login-brand-icon">
                        <Factory size={40} color="#fff" />
                    </div>
                    <h1 className="login-brand-name">Smart Paper Mill</h1>
                    <p className="login-brand-desc">
                        Enterprise SCADA &amp; Manufacturing Execution System
                    </p>
                </div>
                <div className="login-features">
                    <div className="login-feature-item">
                        <Shield size={18} />
                        <span>Real-time Plant Monitoring</span>
                    </div>
                    <div className="login-feature-item">
                        <Shield size={18} />
                        <span>Production Batch Tracking</span>
                    </div>
                    <div className="login-feature-item">
                        <Shield size={18} />
                        <span>Quality &amp; Maintenance Control</span>
                    </div>
                    <div className="login-feature-item">
                        <Shield size={18} />
                        <span>Pulp Process Telemetry</span>
                    </div>
                </div>
                <div className="login-left-footer">
                    Smart Paper Mill Operations · v2.4.0-PROD
                </div>
            </div>

            {/* Right panel — form */}
            <div className="login-right">
                <div className="login-card">
                    <div className="login-card-header">
                        <div className="login-logo-small">
                            <Factory size={24} color="#1e3a8a" />
                        </div>
                        <h2 className="login-title">Welcome Back</h2>
                        <p className="login-subtitle">
                            Sign in to access the Smart Paper Mill Management System
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="login-form" noValidate>
                        {/* Email */}
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} className="input-icon-left" />
                                <input
                                    id="email"
                                    type="email"
                                    className="form-input"
                                    placeholder="admin@smartpapermill.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError("");
                                    }}
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} className="input-icon-left" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError("");
                                    }}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="input-icon-right"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Remember me + Forgot */}
                        <div className="form-options">
                            <label className="remember-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Remember me</span>
                            </label>
                            <button
                                type="button"
                                className="forgot-btn"
                                onClick={() => alert("Please contact your system administrator to reset your password.")}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="login-error" role="alert">
                                <span>⚠ {error}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            className={`login-btn ${loading ? "loading" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>

                    <div className="login-card-footer">
                        <p>Smart Paper Mill · Enterprise Management System</p>
                        <p>Authorized personnel only</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
