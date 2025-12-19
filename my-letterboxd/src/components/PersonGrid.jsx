import PersonCard from "./PersonCard";

export default function PersonGrid({ people }) {
  if (!people || people.length === 0) return null;

  return (
    <div className="person-grid">
      {people.map(person => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
}