import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  // фильтры
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [ratingFrom, setRatingFrom] = useState("");

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/movies/", {
        params: {
          search: search || undefined,
          genre: genre || undefined,
          rating_from: ratingFrom || undefined,
        },
      });
      setMovies(res.data);
    } catch (e) {
      console.error("FETCH MOVIES ERROR", e);
    } finally {
      setLoading(false);
    }
  };

  // первая загрузка
  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* 🔍 ПАНЕЛЬ ПОИСКА / ФИЛЬТРОВ */}
      <div
        style={{
          padding: "16px",
          background: "#f5f5f5",
          borderRadius: "10px",
          marginBottom: "30px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          placeholder="Поиск по названию…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Жанр"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />

        <input
          type="number"
          placeholder="Рейтинг от"
          min="1"
          max="10"
          value={ratingFrom}
          onChange={(e) => setRatingFrom(e.target.value)}
          style={{ width: "120px" }}
        />

        <button onClick={fetchMovies}>Найти</button>
      </div>

      {/* 🎬 СПИСОК ФИЛЬМОВ */}
      {loading ? (
        <p>Загрузка...</p>
      ) : movies.length === 0 ? (
        <p>Фильмы не найдены</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, 200px)",
            gap: "20px",
          }}
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={movie.poster}
                alt={movie.title}
                style={{
                  width: "200px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <h3 style={{ marginTop: "8px" }}>{movie.title}</h3>
              <p style={{ color: "#666" }}>{movie.year_released}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}