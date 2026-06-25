import { formatTemp } from "../utils/weatherCodes";

export default function Temperature({ value, loading, unit, onToggleUnit }) {
  const display =
    value !== null && value !== undefined ? formatTemp(value, unit) : "—";

  return (
    <div className={`temperature${loading ? " temperature--loading" : ""}`}>
      {display}
      <button 
        className="unit-toggle" 
        onClick={onToggleUnit}
        aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
      >
        °{unit}
      </button>
    </div>
  );
}
