const headerelement = document.getElementById("dynamicHeader");
const currentTime = new Date();
const currentHour = currentTime.getHours();

let headerContent;
if (currentHour < 12) {
  headerCountent = "Good Morning!";
} else if (currentHour < 18) {
  headerContent = "Good Afternoon!";
} else {
  headerContent = "Good Evening!";
}

headerelement.innerHTML = headerContent;

const dateElement = document.getElementById("dynamic-date");
const options = {
  year: "numeric",
  month: "short",
  day: "numeric",
};
dateElement.innerHTML = currentTime.toLocaleDateString(undefined, options);

// Weather fetching functionality
// This code fetches the weather data for a given city using Open Meteo API
document
  .getElementById("search-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const city = document.getElementById("query").value;
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      city
    )}&count=1`;

    try {
      const geoRes = await fetch(geocodeUrl);
      const geoData = await geoRes.json();
      if (!geoData.results || geoData.results.length === 0) {
        document.getElementById("temperature").textContent = "City not found.";
        return;
      }
      const { latitude, longitude, name, country } = geoData.results[0];
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();
      const temp = weatherData.current_weather.temperature;
      document.getElementById(
        "temperature"
      ).textContent = `${name}, ${country}: ${temp}°C`;
    } catch {
      document.getElementById("temperature").textContent =
        "Error fetching weather data.";
    }
  });

// ...existing code...

// Show default weather for Trece Martires City on page load
window.addEventListener("DOMContentLoaded", async function () {
  const city = "Trece Martires City";
  const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    city
  )}&count=1`;

  try {
    const geoRes = await fetch(geocodeUrl);
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0) {
      document.getElementById("temperature").textContent = "City not found.";
      return;
    }
    const { latitude, longitude, name, country } = geoData.results[0];
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();
    const temp = weatherData.current_weather.temperature;
    document.getElementById(
      "temperature"
    ).textContent = `${name}, ${country}: ${temp}°C`;
  } catch {
    document.getElementById("temperature").textContent =
      "Error fetching weather data.";
  }
});
