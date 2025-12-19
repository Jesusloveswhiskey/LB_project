import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function LikedMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get("/movies/liked/")
      .then(res => setMovies(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!movies.length) {
    return <p>У вас пока нет лайкнутых фильмов 🤍</p>;
  }

  return (
    <div className="container">
      <h2>❤️ Мои лайки</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, 200px)", gap: "20px" }}>
        {movies.map(movie => (
          <Link key={movie.id} to={`/movies/${movie.id}`}>
            <img
              src={movie.poster}
              alt={movie.title}
              style={{ width: "200px", borderRadius: "8px" }}
            />
            <p>{movie.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}