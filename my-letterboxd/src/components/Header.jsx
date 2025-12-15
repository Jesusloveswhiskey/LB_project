import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header style={{ padding: "16px", borderBottom: "1px solid #ddd" }}>
      <Link to="/">🏠 Главная</Link>{" | "}
      <Link to="/movies">🎬 Фильмы</Link>{" | "}

      {user ? (
        <span>Привет, {user.username}</span>
      ) : (
        <Link to="/login">Войти</Link>
      )}
    </header>
  );
}