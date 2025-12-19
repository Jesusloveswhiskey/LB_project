import { createContext, useContext, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [ratingFrom, setRatingFrom] = useState("");

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        genre,
        setGenre,
        ratingFrom,
        setRatingFrom,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export const useSearch = () => useContext(SearchContext);