export default function Footer({ lastUpdated, lat, lon }) {
  if (!lastUpdated) return null;

  const time = lastUpdated.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const coords =
    lat !== null && lon !== null
      ? `${lat.toFixed(4)}, ${lon.toFixed(4)}`
      : "";

  return (
    <footer className="footer">
      Updated {time}{coords && ` · ${coords}`}
    </footer>
  );
}
