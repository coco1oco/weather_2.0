import { useState, useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import CityHeader from "./components/CityHeader";
import Temperature from "./components/Temperature";
import ConditionProse from "./components/ConditionProse";
import DataRow from "./components/DataRow";
import ForecastTable from "./components/ForecastTable";
import PrecipitationMap from "./components/PrecipitationMap";
import SearchInput from "./components/SearchInput";
import SavedCities from "./components/SavedCities";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("weather-theme");
    if (saved) return saved;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  const [savedCities, setSavedCities] = useState(() => {
    const saved = localStorage.getItem("weather-saved-cities");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("weather-saved-cities", JSON.stringify(savedCities));
  }, [savedCities]);

  useEffect(() => {
    localStorage.setItem("weather-theme", theme);
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const [unit, setUnit] = useState(() => {
    return localStorage.getItem("weather-unit") || "C";
  });

  useEffect(() => {
    localStorage.setItem("weather-unit", unit);
  }, [unit]);

  const toggleUnit = () => {
    setUnit(prev => prev === "C" ? "F" : "C");
  };

  const {
    loading,
    city,
    region,
    lat,
    lon,
    current,
    forecast,
    lastUpdated,
    needsSearch,
    error,
    searchCity,
    fetchWeather,
  } = useWeather();

  const isSaved = savedCities.some(c => c.lat === lat && c.lon === lon);

  const toggleSaveCity = () => {
    if (isSaved) {
      setSavedCities(prev => prev.filter(c => c.lat !== lat || c.lon !== lon));
    } else {
      setSavedCities(prev => [...prev, { city, region, lat, lon }]);
    }
  };

  const handleSelectSavedCity = (savedCity) => {
    fetchWeather(savedCity.lat, savedCity.lon, savedCity.city, savedCity.region);
  };

  return (
    <div className="page">
      <article className="almanac">
        <div className="almanac__left">
          {/* Search: shown when geolocation denied and no city yet */}
          {needsSearch && !city && (
            <div className="almanac__search">
              <SearchInput onSearch={searchCity} />
              {error && <p className="almanac__error">{error}</p>}
            </div>
          )}

          {/* City header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <CityHeader city={city} region={region} />
            {city && (
              <button 
                className="theme-toggle" 
                onClick={toggleSaveCity}
                style={{ paddingBottom: "2px" }}
              >
                [ {isSaved ? 'remove' : 'save'} ]
              </button>
            )}
          </div>

          {/* Temperature headline */}
          <Temperature
            value={current ? current.temperature : null}
            loading={loading}
            unit={unit}
            onToggleUnit={toggleUnit}
          />

          {/* Prose condition */}
          {current && (
            <ConditionProse
              weatherCode={current.weatherCode}
              highTemp={forecast ? forecast.todayHigh : null}
              unit={unit}
            />
          )}

          {/* Hairline rule */}
          {current && <hr className="rule" />}

          {/* Data row */}
          {current && (
            <DataRow
              humidity={current.humidity}
              windSpeed={current.windSpeed}
              uvIndex={current.uvIndex}
              unit={unit}
            />
          )}

          {/* Search input and Saved Cities when data is already showing */}
          {city && (
            <>
              <hr className="rule" />
              <SearchInput onSearch={searchCity} />
              <SavedCities savedCities={savedCities} onSelectCity={handleSelectSavedCity} />
            </>
          )}

          {/* Error when data is showing */}
          {city && error && <p className="almanac__error">{error}</p>}

          {/* Footer */}
          <Footer 
            lastUpdated={lastUpdated} 
            lat={lat} 
            lon={lon} 
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </div>

        <div className="almanac__right">
          {/* Forecast */}
          {forecast && (
            <>
              <h2 className="forecast-heading">Five-Day Forecast</h2>
              <ForecastTable forecast={forecast} unit={unit} />
            </>
          )}

          {/* Precipitation map */}
          {lat && lon && (
            <>
              <hr className="rule" />
              <PrecipitationMap lat={lat} lon={lon} theme={theme} />
            </>
          )}
        </div>
      </article>
    </div>
  );
}
