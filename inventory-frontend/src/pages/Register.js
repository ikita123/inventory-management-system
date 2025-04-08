import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { setToken } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/Register.css";

export default function Register() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await api.post("/auth/register", credentials);
      const { token } = res.data;
      setToken(token);
      setUser(JSON.parse(atob(token.split(".")[1])));
      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <input
          className="register-input"
          placeholder="Email"
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
        <input
          className="register-input"
          placeholder="Password"
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
        <button className="register-button" onClick={handleRegister}>
          Register
        </button>
        <button
          className="register-secondary-button"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}
