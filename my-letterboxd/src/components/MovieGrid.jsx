import { Link } from "react-router-dom";
import "./MovieGrid.css";

export default function MovieGrid({ movies, horizontal = false }) {
  return (
    <div className={`movie-grid ${horizontal ? "horizontal" : ""}`}>
      {movies.map(movie => (
        <Link
          key={movie.id}
          to={`/movies/${movie.id}`}
          className="movie-card"
        >
          <img src={movie.poster} alt={movie.title} />
          <h4>{movie.title}</h4>
          <span>★ {movie.average_rating}</span>
        </Link>
      ))}
    </div>
  );
}