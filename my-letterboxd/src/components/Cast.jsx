import { Link } from "react-router-dom";

export default function CastAndCrew({ people }) {
  if (!people || people.length === 0) return null;

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
      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ margin: "0 0 10px 0", color: "#555", textTransform: "uppercase", fontSize: "14px" }}>
          {title}
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          {items.map((p) => {
            // УБРАЛИ: if (!p.person) return null;
            // Данные приходят сразу как {id, name, role}, поэтому p.person нам не нужен.
            
            return (
              <Link
                key={p.id} 
                to={`/people/${p.id}`}
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  color: "#000",
                  backgroundColor: "#f5f5f5",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  transition: "background 0.2s"
                }}
              >
                {/* Используем p.name напрямую */}
                {p.name}
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
      {renderList("Режиссёры", directors)}
      {renderList("Сценаристы", writers)}
      {renderList("Актёры", actors)}
    </div>
  );
}