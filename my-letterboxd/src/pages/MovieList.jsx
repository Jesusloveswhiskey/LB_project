import { useEffect, useState } from "react";
import api from "../api/axios";
import SearchBar from "../components/SearchBar";
import MovieGrid from "../components/MovieGrid";
import Poster from "../components/Poster";

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [discover, setDiscover] = useState(null);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [ratingFrom, setRatingFrom] = useState("");

  const isEmptySearch = !search && !genre && !ratingFrom;

  useEffect(() => {
    if (isEmptySearch) {
      loadDiscover();
    } else {
      searchMovies();
    }
  }, [search, genre, ratingFrom]);

  const loadDiscover = async () => {
    setLoading(true);
    try {
      const res = await api.get("/movies/discover/");
      setDiscover(res.data);
      setMovies([]); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async () => {
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
      setDiscover(null); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Фильмы</h1>

      <SearchBar
        search={search}
        setSearch={setSearch}
        genre={genre}
        setGenre={setGenre}
        ratingFrom={ratingFrom}
        setRatingFrom={setRatingFrom}
      />

      {loading && <p>Загрузка...</p>}

      {/* коллекции */}
      {!loading && discover && (
        <>
          <h2>⭐ Лучшие фильмы</h2>
          <MovieGrid movies={discover.top} />

          {Object.entries(discover.by_genre).map(([genre, movies]) => (
            <div key={genre}>
              <h2>{genre}</h2>
              <MovieGrid movies={movies} />
            </div>
          ))}
        </>
      )}

      {/* поиск */}
      {!loading && !discover && movies.length === 0 && (
        <p>Ничего не найдено</p>
      )}

      {!loading && movies.length > 0 && (
        <MovieGrid movies={movies} />
      )}
    </div>
  );
}