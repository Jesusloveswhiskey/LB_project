import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import CastAndCrew from "../components/Cast";

// ⭐ Компонент звёзд (без изменений, он нормальный)
function StarRating({ value, onChange }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            fontSize: "24px",
            // Подсвечиваем, если звезда меньше или равна текущей оценке
            color: star <= value ? "gold" : "#ccc",
            transition: "color 0.2s" // Плавность
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

  // 🔄 Загрузка фильма
  useEffect(() => {
    api.get(`/movies/${id}/`)
      .then(res => {
        console.log("Movie Data:", res.data); // 🔍 Для отладки
        setMovie(res.data);
        // Убедись, что бэкенд возвращает user_rating в формате { id: ..., score: ... }
        if (res.data.user_rating) {
            setUserRating(res.data.user_rating);
        }
      })
      .catch(err => console.error("MOVIE LOAD ERROR:", err));
  }, [id]);

  // ⭐ Исправленная отправка рейтинга
  const submitRating = async (score) => {
    // 1. Оптимистичное обновление UI:
    // Сразу рисуем звезды, чтобы пользователь видел реакцию мгновенно
    const prevRating = userRating; // Сохраняем на случай ошибки
    
    // Временно обновляем стейт (id оставляем старым, если был)
    setUserRating((prev) => ({
      ...(prev || {}), 
      score: score 
    }));

    try {
      const payload = {
        movie: movie.id,
        score: score
      };

      let res;
      // Если у нас уже есть ID рейтинга в стейте — делаем PUT (обновление)
      // Если нет — делаем POST (создание)
      if (userRating?.id) {
        res = await api.put(`/ratings/${userRating.id}/`, payload);
      } else {
        res = await api.post("/ratings/", payload);
      }

      // 2. Обновляем стейт реальными данными от сервера (чтобы получить ID, если это был POST)
      console.log("Rating Response:", res.data);
      setUserRating(res.data);

      // Опционально: обновляем средний рейтинг фильма (если он пересчитывается на бэкенде)
      // Можно не делать лишний запрос, если бэкенд возвращает новый average_rating в ответе рейтинга
      const movieRes = await api.get(`/movies/${id}/`);
      setMovie(movieRes.data);

    } catch (e) {
      console.error("RATING ERROR:", e.response?.data || e);
      // Если ошибка — откатываем звезды назад
      setUserRating(prevRating);
      alert("Не удалось сохранить оценку.");
    }
  };

  if (!movie) return <p>Загрузка...</p>;

  // Логика проверки наличия каста
  const hasCast = movie.people && movie.people.length > 0;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "50px" }}>
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
          <h1>{movie.title}</h1>

          <p><b>Год:</b> {movie.year_released}</p>
          <p><b>Жанр:</b> {movie.genre}</p>
          <p><b>Длительность:</b> {movie.length_minutes} мин</p>

          <p style={{ marginTop: "10px" }}>
            <b>Общий рейтинг:</b>{" "}
            {movie.average_rating ? movie.average_rating.toFixed(1) : "—"}
          </p>

          {/* ⭐ Пользовательская оценка */}
          <div style={{ marginTop: "16px", padding: "10px", border: "1px solid #eee", borderRadius: "8px" }}>
            {user ? (
              <>
                <p style={{marginBottom: "5px"}}><b>Ваша оценка:</b></p>
                <StarRating
                  // Важно: если userRating null, передаем 0
                  value={userRating?.score || 0}
                  onChange={submitRating}
                />
                {/* Отладочный вывод (можно убрать потом) */}
                {/* <small style={{color: 'grey'}}>Debug: {userRating?.score} (ID: {userRating?.id})</small> */}
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
        {hasCast ? (
          <CastAndCrew people={movie.people} />
        ) : (
          <p style={{ color: "#777", fontStyle: "italic" }}>
            Информация об актёрском составе еще не добавлена.
          </p>
        )}
      </div>

      {/* 📝 Описание */}
      <div style={{ marginTop: "24px" }}>
        <h3>Описание</h3>
        <p style={{ lineHeight: "1.6" }}>
          {movie.description || "Описание отсутствует."}
        </p>
      </div>
    </div>
  );
}