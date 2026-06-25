/**
 * Maps WMO Weather interpretation codes to editorial prose descriptions.
 * https://open-meteo.com/en/docs#weathervariables
 */

const codeDescriptions = {
  0: "Clear skies, uninterrupted sun",
  1: "Mainly clear, with thin clouds at the margins",
  2: "Partly cloudy — patches of blue between a shifting ceiling",
  3: "Overcast, a low grey ceiling from horizon to horizon",
  45: "Fog settling in, visibility reduced to a pale blur",
  48: "Depositing rime fog, cold and clinging",
  51: "Light drizzle, barely enough to notice on your sleeve",
  53: "Drizzle, a fine mist of rain hanging in the air",
  55: "Dense drizzle, persistent and soaking",
  56: "Freezing drizzle, light but treacherous underfoot",
  57: "Freezing drizzle, dense and coating every surface",
  61: "Light rain, a gentle and steady fall",
  63: "Rain, steady and persistent through the hours",
  65: "Heavy rain, drumming against windows and pooling in gutters",
  66: "Freezing rain, light but hazardous on roads",
  67: "Freezing rain, heavy and dangerous",
  71: "Light snow, flakes drifting slowly down",
  73: "Snow falling, accumulating in a quiet blanket",
  75: "Heavy snow, thick and fast, obscuring the view",
  77: "Snow grains, small and icy",
  80: "Rain showers, brief and intermittent",
  81: "Moderate rain showers, coming in waves",
  82: "Violent rain showers, sudden downpours",
  85: "Light snow showers, flurries passing through",
  86: "Heavy snow showers, bursts of white",
  95: "Thunderstorms developing, rumbles in the distance",
  96: "Thunderstorms with slight hail",
  99: "Thunderstorms with heavy hail, possibly severe",
};

/**
 * Returns a prose description for a WMO weather code.
 * Optionally appends the daily high temperature.
 */
export function describeWeather(code, highTemp = null) {
  const base = codeDescriptions[code] || "Conditions unclear";
  if (highTemp !== null && highTemp !== undefined) {
    return `${base}. High of ${Math.round(highTemp)}°.`;
  }
  return `${base}.`;
}

/**
 * Returns a short label for forecast table rows.
 */
export function shortDescription(code) {
  if (code === 0) return "Clear";
  if (code >= 1 && code <= 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if (code >= 45 && code <= 48) return "Fog";
  if (code >= 51 && code <= 57) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rain";
  if (code >= 66 && code <= 67) return "Freezing rain";
  if (code >= 71 && code <= 77) return "Snow";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 85 && code <= 86) return "Snow showers";
  if (code >= 95) return "Thunderstorms";
  return "Mixed";
}
