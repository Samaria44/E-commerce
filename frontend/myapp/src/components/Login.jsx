import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiShoppingBag } from "react-icons/fi";
import "./Login.css";

export default function Login() {
  const [form, setForm]       = useState({ Email: "", Password: "" });
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (localStorage.getItem("authToken") && JSON.parse(localStorage.getItem("authToken")))
        navigate("/User");
    } catch { localStorage.removeItem("authToken"); }
  }, [navigate]);

  const onChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleLogin = e => {
    e.preventDefault();
    if (!form.Email || !form.Password) { alert("Please fill all fields."); return; }
    if (form.Email === "example@gmail.com" && form.Password === "0099") {
      localStorage.setItem("authToken", JSON.stringify(true));
      navigate("/User");
    } else {
      alert("Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <form onSubmit={handleLogin}>
          <div className="login-brand">
            <div className="login-brand-icon"><FiShoppingBag size={18} color="#fff" /></div>
            <span className="login-brand-name">ShopZone</span>
          </div>

          <h2>Welcome back</h2>
          <p className="login-sub">Sign in to your account</p>

          <div className="input-group">
            <label>Email address</label>
            <input name="Email" type="email" placeholder="you@example.com"
              value={form.Email} onChange={onChange} required autoComplete="email" />
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input name="Password" type={showPass ? "text" : "password"}
                placeholder="Enter your password" value={form.Password} onChange={onChange}
                required autoComplete="current-password" style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "var(--muted)",
                  display: "flex", alignItems: "center", padding: 0 }}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn">Sign In</button>
          <p className="login-hint">Demo: example@gmail.com / 0099</p>
        </form>
      </div>
    </div>
  );
}
