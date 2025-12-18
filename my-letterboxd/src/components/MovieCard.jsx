import { Link } from "react-router-dom";
import Poster from "./Poster";
import "./MovieCard.css";

export default function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie.id}`} className="movie-card">
      <Poster src={movie.poster} alt={movie.title} />
      <div className="movie-title">{movie.title}</div>
    </Link>
  );
}