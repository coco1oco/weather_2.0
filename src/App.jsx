import { useWeather } from "./hooks/useWeather";
import CityHeader from "./components/CityHeader";
import Temperature from "./components/Temperature";
import ConditionProse from "./components/ConditionProse";
import DataRow from "./components/DataRow";
import ForecastTable from "./components/ForecastTable";
import PrecipitationMap from "./components/PrecipitationMap";
import SearchInput from "./components/SearchInput";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
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
  } = useWeather();

  return (
    <div className="page">
      <article className="almanac">
        {/* Search: shown when geolocation denied and no city yet */}
        {needsSearch && !city && (
          <div className="almanac__search">
            <SearchInput onSearch={searchCity} />
            {error && <p className="almanac__error">{error}</p>}
          </div>
        )}

        {/* City header */}
        <CityHeader city={city} region={region} />

        {/* Temperature headline */}
        <Temperature
          value={current ? current.temperature : null}
          loading={loading}
        />

        {/* Prose condition */}
        {current && (
          <ConditionProse
            weatherCode={current.weatherCode}
            highTemp={forecast ? forecast.todayHigh : null}
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
          />
        )}

        {/* Forecast */}
        {forecast && (
          <>
            <hr className="rule" />
            <h2 className="forecast-heading">Five-Day Forecast</h2>
            <ForecastTable forecast={forecast} />
          </>
        )}

        {/* Precipitation map */}
        {lat && lon && (
          <>
            <hr className="rule" />
            <PrecipitationMap lat={lat} lon={lon} />
          </>
        )}

        {/* Search input when data is already showing */}
        {city && (
          <>
            <hr className="rule" />
            <SearchInput onSearch={searchCity} />
          </>
        )}

        {/* Error when data is showing */}
        {city && error && <p className="almanac__error">{error}</p>}

        {/* Footer */}
        <Footer lastUpdated={lastUpdated} lat={lat} lon={lon} />
      </article>
    </div>
  );
}
