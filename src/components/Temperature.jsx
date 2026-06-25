export default function Temperature({ value, loading }) {
  const display =
    value !== null && value !== undefined ? `${Math.round(value)}°` : "—";

  return (
    <div className={`temperature${loading ? " temperature--loading" : ""}`}>
      {display}
    </div>
  );
}
