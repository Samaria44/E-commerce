import React, { useEffect, useState } from "react";
import "./adminLogin.css";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiEye, FiEyeOff } from "react-icons/fi";

export default function AdminLogin() {
  const [loginForm, setLoginForm] = useState({ Email: "", Password: "" });
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (token) navigate("/dashboard");
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.Email || !loginForm.Password) {
      alert("Please fill all fields!");
      return;
    }
    if (loginForm.Email === "example@gmail.com" && loginForm.Password === "0099") {
      localStorage.setItem("authToken", JSON.stringify(true));
      navigate("/dashboard");
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleLogin}>
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">
              <FiShoppingCart size={20} color="#fff" />
            </div>
            <span className="login-brand-name">ShopAdmin</span>
          </div>

          <h2>Welcome back</h2>
          <p className="login-sub">Sign in to your admin account</p>

          <div className="input-group">
            <label htmlFor="email">Email address</label>
            <input
              name="Email"
              type="email"
              id="email"
              placeholder="admin@example.com"
              value={loginForm.Email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                name="Password"
                type={showPass ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                value={loginForm.Password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                style={{ paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  fontSize: "16px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Sign In
          </button>

          <p className="login-hint">Demo: example@gmail.com / 0099</p>
        </form>
      </div>
    </div>
  );
}
