import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>🎬 MovieBox</h1>

      <p style={{ fontSize: "18px" }}>
        MovieBox — это учебный аналог Letterboxd.  
        Здесь можно находить фильмы, оставлять отзывы и ставить лайки.
      </p>

      {!loading && (
        <div style={{ marginTop: "20px" }}>
          {user ? (
            <>
              <p>
                Привет, <strong>{user.username}</strong> 👋
              </p>
              <Link to="/movies">
                <button>Перейти к фильмам</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button>Войти</button>
              </Link>{" "}
              <Link to="/movies">
                <button>Смотреть фильмы</button>
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}