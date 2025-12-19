import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function Profile() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get("/movies/my/").then(res => setMovies(res.data));
  }, []);

  return (
    <div className="container">
      <h2>Мои фильмы</h2>

      {movies.length === 0 && (
        <p style={{ color: "#777" }}>Пока нет оценок или рецензий</p>
      )}

      {movies.map(m => (
        <div
          key={m.id}
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "20px",
            alignItems: "flex-start"
          }}
        >
          <img
            src={m.poster}
            alt={m.title}
            width={80}
            style={{
              flexShrink: 0,
              objectFit: "cover",
              borderRadius: "6px"
            }}
          />

          <div style={{ flex: 1 }}>
            <Link to={`/movies/${m.id}`}>
              <h4 style={{ margin: "0 0 6px 0" }}>{m.title}</h4>
            </Link>

            {m.my_rating && (
              <p style={{ margin: "4px 0" }}>
                ⭐ Моя оценка: {m.my_rating}
              </p>
            )}

            {m.my_review && (
              <p
                style={{
                  margin: "4px 0",
                  wordBreak: "break-word"
                }}
              >
                📝 {m.my_review}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}