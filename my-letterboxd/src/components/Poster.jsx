import "./Poster.css";

export default function Poster({ src, alt }) {
  return (
    <div className="poster-wrapper">
      <img
        src={src || "/no-poster.png"}
        alt={alt}
        className="poster-img"
        loading="lazy"
      />
    </div>
  );
}