import { describeWeather } from "../utils/weatherCodes";

export default function ConditionProse({ weatherCode, highTemp }) {
  if (weatherCode === null || weatherCode === undefined) return null;

  return (
    <p className="condition-prose">{describeWeather(weatherCode, highTemp)}</p>
  );
}
