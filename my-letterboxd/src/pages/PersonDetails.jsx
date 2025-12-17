import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function PersonDetails() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    api.get(`/people/${id}/`)
      .then(res => setPerson(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!person) return <p>Загрузка...</p>;

  return (
    <div>
      <h1>{person.name}</h1>
      <p><b>Роль:</b> {person.role}</p>

      <h3>Фильмография</h3>

      <ul>
        {person.movies.map(movie => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>
              {movie.title} ({movie.year_released})
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}