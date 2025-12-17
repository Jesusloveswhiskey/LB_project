import React, { useState } from "react";
import { login, fetchCsrf } from "../api/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  // 🔐 если уже залогинен — не пускаем на /login
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await fetchCsrf();
      const resp = await login(username, password);

      setUser(resp.data);     // 🔴 КЛЮЧЕВО
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка логина");
    }
  };

  return (
    <div>
      <h1>Вход</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Войти</button>

        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
}