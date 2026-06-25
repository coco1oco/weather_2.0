import { shortDescription, formatTemp } from "../utils/weatherCodes";

export default function ForecastTable({ forecast, unit }) {
  if (!forecast || !forecast.dates) return null;

  const formatDay = (dateStr) => {
    const date = new Date(dateStr + "T12:00:00");
    return date.toLocaleDateString(undefined, { weekday: "long" });
  };

  return (
    <div className="forecast-table">
      {forecast.dates.map((date, i) => (
        <div key={date} className="forecast-table__row">
          <span className="forecast-table__day">{formatDay(date)}</span>
          <span className="forecast-table__condition">
            {shortDescription(forecast.weatherCodes[i])}
          </span>
          <span className="forecast-table__temps">
            {formatTemp(forecast.maxTemps[i], unit)}° /{" "}
            {formatTemp(forecast.minTemps[i], unit)}°
          </span>
        </div>
      ))}
    </div>
  );
}
