const headerelement = document.getElementById("dynamicHeader");
const currentTime = new Date();
const currentHour = currentTime.getHours();

let headerContent;
if (currentHour < 12) {
  headerContent = "Good Morning!";
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

const apiKey = "9199ef7f8927f6f17fc640f7d1c70570";

async function fetchWeatherData(city = "Trece Martires") {
  const apiURL = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${encodeURIComponent(
    city
  )}&appid=${apiKey}`;
  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    document.querySelector(".city-name").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML =
      Math.round(data.main.temp) + "°C";
    document.querySelector(".Humidity").innerHTML = data.main.humidity + "%";
    const windSpeed = Math.round(data.wind.speed * 3.6); // m/s → km/h
    document.querySelector(".Wind").innerHTML = windSpeed + " km/h";
    document.querySelector(".Feels-like").innerHTML =
      Math.round(data.main.feels_like) + "°C";

    const weatherIcon = document.querySelector(".weather-icon");
    weatherIcon.src = getLocalIcon(data.weather[0].main);

    await fetchForecast(city);
  } catch (error) {
    const weatherIcon = document.querySelector(".weather-icon");
    weatherIcon.src = "images/error.png";
    document.querySelector(".city-name").innerHTML = "City not found";
    document.querySelector(".temperature").innerHTML = "-";
    document.querySelector(".Humidity").innerHTML = "-";
    document.querySelector(".Wind").innerHTML = "-";
    document.querySelector(".Feels-like").innerHTML = "-";
    document.querySelector(
      ".forecast"
    ).innerHTML = `<p>Unable to load forecast</p>`;
  }
}

// Map weather conditions to local icons
function getLocalIcon(condition) {
  switch (condition) {
    case "Clouds":
      return "images/clouds.png";
    case "Rain":
      return "images/rain.png";
    case "Clear":
      return "images/clear.png";
    case "Drizzle":
      return "images/drizzle.png";
    case "Snow":
      return "images/snow.png";
    case "Thunderstorm":
      return "images/thunderstorm.png";
    default:
      return "images/mist.png";
  }
}

// Updated 5-day forecast with full date + daily high/low temps + local icons
async function fetchForecast(city = "Trece Martires") {
  const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${apiKey}`;
  try {
    const response = await fetch(apiURL);
    if (!response.ok) throw new Error("Forecast not available");
    const data = await response.json();

    // Group forecast items by date
    const groupedByDate = {};
    data.list.forEach((item) => {
      const dateStr = item.dt_txt.split(" ")[0]; // YYYY-MM-DD
      if (!groupedByDate[dateStr]) groupedByDate[dateStr] = [];
      groupedByDate[dateStr].push(item);
    });

    // Get up to 5 days (excluding today)
    const forecastDates = Object.keys(groupedByDate).slice(1, 6);

    const forecastContainer = document.querySelector(".forecast");
    forecastContainer.innerHTML = "";

    forecastDates.forEach((dateStr) => {
      const entries = groupedByDate[dateStr];

      // Find high/low for the day
      let highTemp = -Infinity;
      let lowTemp = Infinity;
      entries.forEach((entry) => {
        if (entry.main.temp_max > highTemp) highTemp = entry.main.temp_max;
        if (entry.main.temp_min < lowTemp) lowTemp = entry.main.temp_min;
      });

      // Pick midday entry for icon & main temp (closest to 12:00)
      let middayEntry = entries.reduce((prev, curr) => {
        return Math.abs(new Date(curr.dt_txt).getHours() - 12) <
          Math.abs(new Date(prev.dt_txt).getHours() - 12)
          ? curr
          : prev;
      });

      const dateObj = new Date(dateStr);
      const fullDate = dateObj.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const description = middayEntry.weather[0].main;
      const mainTemp = Math.round(middayEntry.main.temp) + "°C";
      const high = "H: " + Math.round(highTemp) + "°C";
      const low = "L: " + Math.round(lowTemp) + "°C";

      forecastContainer.innerHTML += `
        <div class="forecast-item">
          <div class="forecast-day">${fullDate}</div>
          <img src="${getLocalIcon(
            description
          )}" alt="${description}" class="forecast-icon">
          <div class="forecast-temp">${mainTemp}</div>
          <div class="forecast-highlow">
              <span class="high">${high}</span> <span class="low">${low}</span>
          </div>
        </div>
      `;
    });
  } catch (error) {
    document.querySelector(
      ".forecast"
    ).innerHTML = `<p>Unable to load forecast</p>`;
  }
}

// Event listener for the search form
document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const searchInput = document.getElementById("query");
  const city = searchInput.value.trim();
  if (city) {
    fetchWeatherData(city);
    searchInput.value = "";
  }
});

fetchWeatherData();
