import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CastAndCrew from "../components/Cast";
import Reviews from "../components/Review";


function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            fontSize: "24px",

            color: star <= value ? "gold" : "#ccc",
            transition: "color 0.2s" 
          }}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function MovieDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);


useEffect(() => {
  api.get(`/movies/${id}/`)
    .then(res => {
      setMovie(res.data);

      if (res.data.user_rating) {
        setUserRating(res.data.user_rating);
      }

      if (res.data.is_liked) {
        setLiked(true);
        setLikeId(res.data.like_id);
      }
    })
    .catch(err => console.error("MOVIE LOAD ERROR:", err));
}, [id]);

const toggleLike = async () => {
  if (!user) {
    alert("Войдите, чтобы ставить лайки");
    return;
  }

  try {
    const res = await api.post("/likes/toggle/", {
      movie: movie.id
    });

    setLiked(res.data.liked);

  } catch (e) {
    console.error("LIKE ERROR:", e.response?.data || e);
  }
};

const submitRating = async (score) => {
  if (!user) return;

  const prevRating = userRating;

  setUserRating(prev => ({
    ...(prev || {}),
    score
  }));

  try {
    const payload = {
      movie: movie.id,
      score
    };

    // let res;
    // if (prevRating?.id) {
    //   res = await api.put(`/ratings/${prevRating.id}/`, payload);
    // } else {
    //   res = await api.post("/ratings/", payload);
    // }
    const res = await api.post("/ratings/", {
      movie: movie.id,
      score
    });

    setUserRating(res.data);
    const movieRes = await api.get(`/movies/${id}/`);
    setMovie(movieRes.data);

  } catch (e) {
    console.error("RATING ERROR:", e.response?.data || e);
    setUserRating(prevRating);
    alert("Не удалось сохранить оценку");
  }
};

  if (!movie) return <p>Загрузка...</p>;

  return (
    <div class='container' style={{ maxWidth: "900px", margin: "10px auto", paddingBottom: "50px" }}>
      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        <img
          src={movie.poster}
          alt={movie.title}
          style={{
            width: "300px",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />

        <div>
          <h1 style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {movie.title}

            {user && (
              <span
                onClick={toggleLike}
                style={{
                  cursor: "pointer",
                  fontSize: "28px",
                  color: liked ? "red" : "#aaa",
                  transition: "0.2s"
                }}
                title={liked ? "Убрать из лайков" : "Добавить в лайки"}
              >
                {liked ? "❤️" : "🤍"}
              </span>
            )}
          </h1>

          <p><b>Год:</b> {movie.year_released}</p>
          <p><b>Жанр:</b> {movie.genre}</p>
          <p><b>Длительность:</b> {movie.length_minutes} мин</p>

          <p style={{ marginTop: "10px" }}>
            <b>Общий рейтинг:</b>{" "}
            {movie.average_rating
              ? Number(movie.average_rating).toFixed(1)
              : "—"}
          </p>

          {/* ⭐ Пользовательская оценка */}
          <div style={{ marginTop: "16px", padding: "10px", border: "1px solid #eee", borderRadius: "8px" }}>
            {user ? (
              <>
                <p style={{marginBottom: "5px"}}><b>Ваша оценка:</b></p>
                <StarRating

                  value={userRating?.score || 0}
                  onChange={submitRating}
                />
              </>
            ) : (
              <p>
                <Link to="/login" style={{color: 'blue', textDecoration: 'underline'}}>Войдите</Link>, чтобы оценить фильм
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 🎭 Cast & Crew: Исправленная логика */}
      <div style={{ marginTop: "40px" }}>
        <h3>Актёрский состав и создатели</h3>
        <CastAndCrew people={movie.people} />
      </div>

      {/* 📝 Описание */}
      <div style={{ marginTop: "24px" }}>
        <h3>Описание</h3>
        <p style={{ lineHeight: "1.6" }}>
          {movie.description || "Описание отсутствует."}
        </p>
      </div>
      <Reviews movieId={movie.id} />
    </div>
  );
}