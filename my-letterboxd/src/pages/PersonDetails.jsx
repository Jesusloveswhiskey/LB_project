import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import MovieCard from "../components/MovieCard"; // тот же, что в MovieList

export default function PersonDetails() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);

  useEffect(() => {
    api
      .get(`/people/${id}/`)
      .then(res => setPerson(res.data))
      .catch(err => console.error("PERSON LOAD ERROR:", err));
  }, [id]);

  if (!person) return <p>Загрузка...</p>;

  return (
    <div className="container">

      {/* ===== HEADER / КАРТОЧКА ПЕРСОНЫ ===== */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          marginBottom: "50px",
          alignItems: "flex-start",
        }}
      >
        {/* ФОТО */}
        <img
          src={person.photo || "/placeholder-person.jpg"}
          alt={person.name}
          style={{
            width: "280px",
            height: "420px",
            objectFit: "cover",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          }}
        />

        {/* ИНФО */}
        <div>
          <h1 style={{ marginBottom: "10px" }}>{person.name}</h1>

          <p
            style={{
              fontSize: "18px",
              color: "#aaa",
              textTransform: "capitalize",
            }}
          >
            {person.role}
          </p>
        </div>
      </div>

      {/* ===== ФИЛЬМОГРАФИЯ ===== */}
      <h2 style={{ marginBottom: "20px" }}>Фильмография</h2>

      {person.movies && person.movies.length > 0 ? (
        <div className="movie-grid">
          {person.movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p style={{ color: "#777", fontStyle: "italic" }}>
          Фильмы не найдены
        </p>
      )}
    </div>
  );
}