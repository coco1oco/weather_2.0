export default function DataRow({ humidity, windSpeed, uvIndex, unit }) {
  const isImperial = unit === "F";
  const displayWindSpeed = isImperial
    ? windSpeed !== null ? Math.round(windSpeed * 0.621371) : null
    : windSpeed !== null ? Math.round(windSpeed) : null;
  const windUnit = isImperial ? "mph" : "km/h";

  const items = [
    { label: "Humidity", value: humidity !== null ? `${humidity}%` : "—" },
    {
      label: "Wind",
      value: displayWindSpeed !== null ? `${displayWindSpeed} ${windUnit}` : "—",
    },
    {
      label: "UV Index",
      value: uvIndex !== null ? `${Math.round(uvIndex)}` : "—",
    },
  ];

  return (
    <div className="data-row">
      {items.map((item, i) => (
        <span key={item.label} className="data-row__item">
          {i > 0 && <span className="data-row__dot"> · </span>}
          <span className="data-row__value">{item.value}</span>{" "}
          <span className="data-row__label">{item.label}</span>
        </span>
      ))}
    </div>
  );
}
