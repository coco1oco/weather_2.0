import { Sun, Moon } from "lucide-react";

export default function Footer({ lastUpdated, lat, lon, theme, onToggleTheme }) {
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
      <div>
        Updated {time}{coords && ` · ${coords}`}
      </div>
      <button 
        className="theme-toggle" 
        onClick={onToggleTheme}
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? (
          <Moon size={16} strokeWidth={1.5} />
        ) : (
          <Sun size={16} strokeWidth={1.5} />
        )}
      </button>
    </footer>
  );
}
