import { useState, useEffect, useCallback } from "react";

const WEATHER_API = "https://api.open-meteo.com/v1/forecast";
const GEOCODE_API = "https://geocoding-api.open-meteo.com/v1/search";

export function useWeather() {
  const [state, setState] = useState({
    loading: true,
    city: null,
    region: null,
    lat: null,
    lon: null,
    current: null,
    forecast: null,
    lastUpdated: null,
    needsSearch: false,
    error: null,
  });

  const fetchWeather = useCallback(async (lat, lon, cityName, regionName) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current:
          "temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index,apparent_temperature",
        daily:
          "weather_code,temperature_2m_max,temperature_2m_min",
        forecast_days: "6",
        timezone: "auto",
      });

      const response = await fetch(`${WEATHER_API}?${params}`);
      if (!response.ok) throw new Error("Weather data unavailable");
      const data = await response.json();

      // If we don't have a city name yet (geolocation), reverse geocode
      let resolvedCity = cityName;
      let resolvedRegion = regionName;
      if (!resolvedCity) {
        try {
          const geoResp = await fetch(
            `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1`
          );
          if (geoResp.ok) {
            const geoData = await geoResp.json();
            if (geoData.results && geoData.results.length > 0) {
              resolvedCity = geoData.results[0].name;
              resolvedRegion =
                geoData.results[0].admin1 ||
                geoData.results[0].country;
            }
          }
        } catch {
          // Fallback: use coordinates as name
          resolvedCity = `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
          resolvedRegion = "";
        }
      }

      setState({
        loading: false,
        city: resolvedCity || `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`,
        region: resolvedRegion || "",
        lat,
        lon,
        current: {
          temperature: data.current.temperature_2m,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          weatherCode: data.current.weather_code,
          uvIndex: data.current.uv_index,
          feelsLike: data.current.apparent_temperature,
        },
        forecast: data.daily
          ? {
              dates: data.daily.time.slice(1), // skip today
              weatherCodes: data.daily.weather_code.slice(1),
              maxTemps: data.daily.temperature_2m_max.slice(1),
              minTemps: data.daily.temperature_2m_min.slice(1),
              todayHigh: data.daily.temperature_2m_max[0],
            }
          : null,
        lastUpdated: new Date(),
        needsSearch: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.message,
      }));
    }
  }, []);

  const searchCity = useCallback(
    async (query) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(
          `${GEOCODE_API}?name=${encodeURIComponent(query)}&count=1&language=en`
        );
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "City not found",
          }));
          return;
        }

        const result = data.results[0];
        await fetchWeather(
          result.latitude,
          result.longitude,
          result.name,
          result.admin1 || result.country
        );
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message,
        }));
      }
    },
    [fetchWeather]
  );

  // On mount: try geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, loading: false, needsSearch: true }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setState((prev) => ({ ...prev, loading: false, needsSearch: true }));
      },
      { timeout: 8000 }
    );
  }, [fetchWeather]);

  return { ...state, searchCity };
}
