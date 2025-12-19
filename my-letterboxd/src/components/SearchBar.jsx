import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

export default function SearchBar({
  search,
  setSearch,
  genre,
  setGenre,
  ratingFrom,
  setRatingFrom,
}) {
  const [open, setOpen] = useState(null); // genre | rating | null
  const navigate = useNavigate();

  const genres = [
    "Драма",
    "Комедия",
    "Триллер",
    "Боевик",
    "Фантастика",
    "Ужасы",
  ];

  const ratings = [1,2,3,4,5,6,7,8,9,10];

  const submitSearch = () => {
    setOpen(null);
    navigate("/movies");
  };

  return (
    <div className="search-bar">
      {/* ПОИСК */}
      <input
        className="search-input"
        placeholder="Поиск фильмов..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            submitSearch();
          }
        }}
      />

      {/* ЖАНР */}
      <div className="dropdown-wrapper">
        <button
          className="filter-button"
          onClick={() => setOpen(open === "genre" ? null : "genre")}
        >
          {genre || "Жанр"} ▾
        </button>

        {open === "genre" && (
          <div className="dropdown">
            {genres.map(g => (
              <div
                key={g}
                className="dropdown-item"
                onClick={() => {
                  setGenre(g);
                  submitSearch();
                }}
              >
                {g}
              </div>
            ))}

            {genre && (
              <div
                className="dropdown-item clear"
                onClick={() => {
                  setGenre("");
                  submitSearch();
                }}
              >
                Сбросить
              </div>
            )}
          </div>
        )}
      </div>

      {/* РЕЙТИНГ */}
      <div className="dropdown-wrapper">
        <button
          className="filter-button"
          onClick={() => setOpen(open === "rating" ? null : "rating")}
        >
          {ratingFrom ? `★ от ${ratingFrom}` : "Рейтинг"} ▾
        </button>

        {open === "rating" && (
          <div className="dropdown">
            {ratings.map(r => (
              <div
                key={r}
                className="dropdown-item"
                onClick={() => {
                  setRatingFrom(r);
                  submitSearch();
                }}
              >
                ★ от {r}
              </div>
            ))}

            {ratingFrom && (
              <div
                className="dropdown-item clear"
                onClick={() => {
                  setRatingFrom("");
                  submitSearch();
                }}
              >
                Сбросить
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}