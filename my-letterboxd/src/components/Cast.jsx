import PersonGrid from "./PersonGrid";

export default function CastAndCrew({ people }) {
  if (!people || people.length === 0) return null;

  const normalize = (role) =>
    role?.trim().toLowerCase();

  const byRole = (role) =>
    people.filter(p => normalize(p.role) === role);

  const actors = byRole("actor");
  const directors = byRole("director");
  const writers = byRole("writer");

  const Section = ({ title, items }) => {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "16px" }}>{title}</h3>
        <PersonGrid people={items} />
      </div>
    );
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <Section title="Режиссёры" items={directors} />
      <Section title="Сценаристы" items={writers} />
      <Section title="Актёры" items={actors} />
    </div>
  );
}