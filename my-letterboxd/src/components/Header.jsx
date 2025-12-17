import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutApi } from "../api/auth";

export default function Header() {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();   // 🔹 logout на бэке
      setUser(null);       // 🔹 очистка фронта
      navigate("/login");  // 🔹 редирект
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  if (loading) return null;

  return (
    <header style={{ display: "flex", gap: "20px" }}>
      <Link to="/">Главная</Link>
      <Link to="/movies">Фильмы</Link>

      {!user ? (
        <>
          <Link to="/login">Войти</Link>
          <Link to="/register">Регистрация</Link>
        </>
      ) : (
        <>
          <span>👤 {user.username}</span>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/collections">Коллекции</Link>
          <Link to="/likes">Лайки</Link>
          <Link to="/reviews">Рецензии</Link>
          <button onClick={handleLogout}>Выйти</button>
        </>
      )}
    </header>
  );
}