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
    document.querySelector(".Wind").innerHTML = data.wind.speed + " km/h";

    const weatherIcon = document.querySelector(".weather-icon");
    if (data.weather[0].main == "Clouds") {
      weatherIcon.src = "images/clouds.png";
    } else if (data.weather[0].main == "Rain") {
      weatherIcon.src = "images/rain.png";
    } else if (data.weather[0].main == "Clear") {
      weatherIcon.src = "images/clear.png";
    } else if (data.weather[0].main == "Drizzle") {
      weatherIcon.src = "images/drizzle.png";
    } else if (data.weather[0].main == "Snow") {
      weatherIcon.src = "images/snow.png";
    }
  } catch (error) {
    const weatherIcon = document.querySelector(".weather-icon");
    weatherIcon.src = "images/error.png"; // Fallback icon for errors
    document.querySelector(".city-name").innerHTML = "City not found";
    document.querySelector(".temperature").innerHTML = "-";
    document.querySelector(".Humidity").innerHTML = "-";
    document.querySelector(".Wind").innerHTML = "-";
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
// Fetch default city on load
fetchWeatherData();
