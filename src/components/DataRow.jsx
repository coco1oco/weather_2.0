export default function DataRow({ humidity, windSpeed, uvIndex }) {
  const items = [
    { label: "Humidity", value: humidity !== null ? `${humidity}%` : "—" },
    {
      label: "Wind",
      value: windSpeed !== null ? `${Math.round(windSpeed)} km/h` : "—",
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
