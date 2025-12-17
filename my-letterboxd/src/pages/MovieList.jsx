import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/movies/")
      .then(res => setMovies(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (movies.length === 0) {
    return <div>Фильмов пока нет.</div>;
  }

  return (
    <div>
      <h1>Фильмы</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 200px)",
          gap: "20px",
        }}
      >
        {movies.map(movie => (
            <Link
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
            <h3 style={{ marginTop: "10px" }}>{movie.title}</h3>
            <p>{movie.year_released}</p>
            </Link>
        ))}
      </div>
    </div>
  );
}