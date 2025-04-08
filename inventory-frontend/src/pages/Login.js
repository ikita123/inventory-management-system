import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", credentials);
      const { token } = res.data;
      setToken(token);
      setUser(JSON.parse(atob(token.split(".")[1])));
      navigate("/inventoryList");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <input
          className="login-input"
          placeholder="Email"
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button className="login-button" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
