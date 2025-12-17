import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/login";
import MovieList from "./pages/MovieList";
import MovieDetail from "./pages/MovieDetails";
import PersonDetail from "./pages/PersonDetails";
import Register from "./pages/Register";


function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movies/:id" element={<MovieDetail />} />
        <Route path="/people/:id" element={<PersonDetail />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
