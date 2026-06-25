export default function CityHeader({ city, region }) {
  if (!city) return null;

  return (
    <header className="city-header">
      <h1 className="city-name">{city}</h1>
      {region && <p className="city-region">{region}</p>}
    </header>
  );
}
