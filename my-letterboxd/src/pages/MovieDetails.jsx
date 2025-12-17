import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    api.get(`/movies/${id}/`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!movie) return <p>Загрузка...</p>;

  const people = movie.people || [];
  const actors = people.filter(p => p.role === "actor");
  const director = people.find(p => p.role === "director");
  const writer = people.find(p => p.role === "writer");

  return (
    <div style={{ display: "flex", gap: "30px" }}>
      <img
        src={movie.poster}
        alt={movie.title}
        style={{ width: "300px", borderRadius: "10px" }}
      />

      <div>
        <h1>{movie.title}</h1>
        <p><b>Год:</b> {movie.year_released}</p>
        <p><b>Жанр:</b> {movie.genre}</p>
        <p><b>Длительность:</b> {movie.length_minutes} мин</p>

        {director && (
          <p>
            <b>Режиссёр:</b>{" "}
            <Link to={`/people/${director.id}`}>
              {director.name}
            </Link>
          </p>
        )}

        {writer && (
          <p>
            <b>Сценарист:</b>{" "}
            <Link to={`/people/${writer.id}`}>
              {writer.name}
            </Link>
          </p>
        )}

        <h3>Актёры</h3>
        <ul>
          {actors.map(actor => (
            <li key={actor.id}>
              <Link to={`/people/${actor.id}`}>
                {actor.name}
              </Link>
            </li>
          ))}
        </ul>

        <p>{movie.description}</p>
      </div>
    </div>
  );
}