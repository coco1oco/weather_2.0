import React from 'react';

export default function SavedCities({ savedCities, onSelectCity }) {
  if (!savedCities || savedCities.length === 0) return null;

  return (
    <div className="saved-cities">
      <h3 className="saved-cities__heading">Saved Cities</h3>
      <ul className="saved-cities__list">
        {savedCities.map((c, index) => (
          <li key={`${c.lat}-${c.lon}-${index}`}>
            <button 
              className="saved-cities__button"
              onClick={() => onSelectCity(c)}
            >
              <span className="saved-cities__name">{c.city}</span>
              {c.region && <span className="saved-cities__region">, {c.region}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
