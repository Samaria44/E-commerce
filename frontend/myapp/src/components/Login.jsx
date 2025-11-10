import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loginForm, setLoginForm] = useState({
    Email: "",
    Passward: "",
  });
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");
  const tokenPass = JSON.parse(authToken);

  useEffect(() => {
    if (tokenPass) {
      navigate("/User");
    }
  }, [tokenPass, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginForm.Email || !loginForm.Passward) {
      alert("Enter all fields");
      return;
    }

    if (
      loginForm.Email === "example@gmail.com" &&
      loginForm.Passward === "0099"
    ) {
      localStorage.setItem("authToken", JSON.stringify(true));
      navigate("/User");
    } else {
      alert("Invalid email or password!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>

        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            name="Email"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={loginForm.Email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            name="Passward"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={loginForm.Passward}
            onChange={handleChange}
            required
          />
        </div>

        <button type="button" className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
