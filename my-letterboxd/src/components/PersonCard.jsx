import { Link } from "react-router-dom";
import "./PersonCard.css";

export default function PersonCard({ person }) {
  return (
    <Link
      to={`/people/${person.id}`}
      className="person-card-link"
    >
      <div className="person-card">
        <div className="person-photo-wrapper">
          <img
            src={person.photo || "https://via.placeholder.com/300x450?text=No+Photo"}
            alt={person.name}
            className="person-photo"
          />
        </div>

        <div className="person-body">
          <div className="person-name">{person.name}</div>

          {person.role && (
            <div className="person-role">{person.role}</div>
          )}
        </div>
      </div>
    </Link>
  );
}