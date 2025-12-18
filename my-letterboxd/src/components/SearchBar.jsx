import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar({
  search,
  setSearch,
  genre,
  setGenre,
  ratingFrom,
  setRatingFrom,
  onSearch,
}) {
  const [open, setOpen] = useState(null); // genre | rating | null

  const genres = [
    "Драма",
    "Комедия",
    "Триллер",
    "Боевик",
    "Фантастика",
    "Ужасы",
  ];

  const ratings = [1,2,3,4,5,6,7,8,9,10];

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch();
      setOpen(null);
    }
  };

  return (
    <div className="search-bar">
      {/* ПОИСК */}
      <input
        className="search-input"
        placeholder="Поиск фильмов..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleEnter}
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
                  setOpen(null);
                  onSearch();
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
                  setOpen(null);
                  onSearch();
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
                  setOpen(null);
                  onSearch();
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
                  setOpen(null);
                  onSearch();
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