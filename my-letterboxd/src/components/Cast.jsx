import { Link } from "react-router-dom";

export default function CastAndCrew({ people }) {
  if (!people || people.length === 0) return null;

  // 1. Ссылка-заглушка, если фото не указано
  const placeholderImg = "https://via.placeholder.com/150x200?text=No+Photo";

  // Хелпер для фильтрации (добавил проверку на наличие поля role)
  const byRole = (role) =>
    people.filter(
      (p) => p.role && p.role.trim().toLowerCase() === role
    );

  const actors = byRole("actor");
  const directors = byRole("director");
  const writers = byRole("writer");

  const renderList = (title, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginBottom: "30px" }}>
        <h3 style={{ fontSize: "18px", marginBottom: "15px", color: "#333" }}>
          {title}
        </h3>
        
        {/* Контейнер для карточек (Flexbox) */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {items.map((p) => (
            <Link
              key={p.id}
              to={`/people/${p.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                width: "120px", // Фиксированная ширина карточки
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* ФОТО */}
              <div style={{ 
                width: "120px", 
                height: "150px", 
                overflow: "hidden", 
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                marginBottom: "8px",
                backgroundColor: "#eee"
              }}>
                <img
                  // Если ссылка есть - берем её, если нет - заглушку
                  src={p.photo ? p.photo : placeholderImg} 
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Обрезает лишнее, сохраняя пропорции (важно!)
                  }}
                  // Если ссылка битая, ставим заглушку
                  onError={(e) => { e.target.src = placeholderImg; }} 
                />
              </div>

              {/* ИМЯ */}
              <div style={{ 
                textAlign: "center", 
                fontSize: "14px", 
                fontWeight: "600",
                lineHeight: "1.2"
              }}>
                {p.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
      {renderList("Режиссёры", directors)}
      {renderList("Сценаристы", writers)}
      {renderList("Актёры", actors)}
    </div>
  );
}