import { useState } from "react";
import api from "../api/axios";
import MovieGrid from "../components/MovieGrid";
import SearchBar from "../components/SearchBar";

export default function MovieSearch() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [ratingFrom, setRatingFrom] = useState("");

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/movies/", {
        params: {
          search: search || undefined,
          genre: genre || undefined,
          rating_from: ratingFrom || undefined,
        },
      });
      setMovies(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Поиск фильмов</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        ratingFrom={ratingFrom}
        setRatingFrom={setRatingFrom}
        onSearch={fetchMovies}
      />

      {loading && <p>Загрузка...</p>}
      {!loading && movies.length === 0 && <p>Ничего не найдено</p>}
      {!loading && movies.length > 0 && <MovieGrid movies={movies} />}
    </div>
  );
}