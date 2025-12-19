import { Link } from "react-router-dom";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img src={movie.poster} alt={movie.title} />

      <div className="movie-card-content">
        <Link to={`/movies/${movie.id}`}>
          <h4>{movie.title}</h4>
        </Link>

        {movie.my_rating && (
          <p>⭐ Моя оценка: {movie.my_rating}</p>
        )}

        {movie.my_review && (
          <p className="review-text">📝 {movie.my_review}</p>
        )}
      </div>
    </div>
  );
}