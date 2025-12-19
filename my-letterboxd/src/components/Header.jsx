import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout as logoutApi } from "../api/auth";
import { useState } from "react";
import "./Header.css";
import SearchBar from "../components/SearchBar";
import { useSearch } from "../context/SearchContext";

export default function Header() {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  // const [search] = useState("");
  // const [genre, setGenre] = useState("");
  // const [ratingFrom, setRatingFrom] = useState("");
  const {
  search,
  setSearch,
  genre,
  setGenre,
  ratingFrom,
  setRatingFrom
} = useSearch();
  

  const handleLogout = async () => {
    try {
      await logoutApi();
      setUser(null);
      navigate("/login");
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  if (loading) return null;

  return (
    <header className="header">
      {/* ЛОГО */}
      <Link to="/" className="logo">
        МЕСТО ДЛЯ ЛОГО
      </Link>

     {<SearchBar
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        ratingFrom={ratingFrom}
        setRatingFrom={setRatingFrom}
      />}

      {/* НАВИГАЦИЯ */}
      <nav className="nav">
        <Link to="/movies" className="nav-link">
          Фильмы
        </Link>
      </nav>

      {/* ПРАВАЯ ЧАСТЬ */}
      <div className="right">
        {!user ? (
          <div className="auth-links">
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </div>
        ) : (
          <div className="user-menu">
            <button
              className="user-button"
              onClick={() => setOpen(!open)}
            >
              👤 {user.username} ▾
            </button>

            {open && (
              <div className="dropdown">
                <Link to="/likes">Лайки</Link>
                <Link to="/watchlist"> Буду смотреть</Link>
                <Link to="/collections">Коллекции</Link>
                <Link to="/profile">Рецензии</Link>
                <button onClick={handleLogout} className="logout">
                  Выйти
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}