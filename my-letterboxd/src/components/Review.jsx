import { useEffect, useState } from "react";
import { getReviews, createReview, deleteReview } from "../api/reviews";
import { useAuth } from "../context/AuthContext";

export default function Reviews({ movieId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    const res = await getReviews(movieId);
    setReviews(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, [movieId]);

  const submit = async () => {
    if (!text.trim()) return;
    await createReview(movieId, text);
    setText("");
    loadReviews();
  };

  const remove = async (id) => {
    await deleteReview(id);
    loadReviews();
  };

  if (loading) return <p>Загрузка рецензий...</p>;

  return (
    <div style={{ marginTop: "40px" }}>
      <h3>Рецензии</h3>

      {user && (
        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напишите рецензию..."
            style={{ width: "100%", minHeight: "100px" }}
          />
          <button onClick={submit}>Опубликовать</button>
        </div>
      )}

      {reviews.length === 0 && <p>Рецензий пока нет.</p>}

      {reviews.map((r) => (
        <div
          key={r.id}
          style={{
            padding: "12px",
            borderBottom: "1px solid #ddd",
          }}
        >
          <b>{r.user.username}</b>{" "}
          <span style={{ color: "#777", fontSize: "12px" }}>
            {new Date(r.created_at).toLocaleDateString()}
          </span>

          <p>{r.text}</p>

          {user?.username === r.user.username && (
            <button onClick={() => remove(r.id)}>Удалить</button>
          )}
        </div>
      ))}
    </div>
  );
}