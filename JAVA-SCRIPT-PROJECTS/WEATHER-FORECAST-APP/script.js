console.log("java script")

//deafult city to load weather for
let city = ("London")
//openWeather app api key
let apiKey = "YOUR API KEY HERE"

//this will store the interval ID for auto-refresh
let intervalId = null

async function fetchWeather(cityName) {
    const weatherBox = document.getElementById("weatherBox")

    //show a loading msg while fetching
    weatherBox.innerHTML = "<p>Loading...</p>"

    try {
        //make the API call
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
        );

        //if response not okay, like 404, throw an error
        if (!res.ok) throw new Error("City not found")

        //parse JSON response
        const data = await res.json()

        //create HTML to display weather data
        const html = `<h2>${data.name}</h2>
      <p>🌡 Temperature: ${data.main.temp}°C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>💨 Wind: ${data.wind.speed} km/h</p>`;

        //inject weather info into the page
        weatherBox.innerHTML = html;
    } catch (err) {
        //show error message if fetch fails
        weatherBox.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
    }

}

function changeCity() {
    const input = document.getElementById("cityInput")
    const newCity = input.value.trim();

  //if input is not empty, update city & reload data
    if (newCity !== "") {
        city = newCity
        fetchWeather(city)

        //clear old interval to avoid multiple timers
        if (intervalId)
            clearInterval(intervalId)

        //restart auto refresh for the new city
        autoRefresh()
    }
}

//sets up automatic weather data refresh every 60 seconds, uses setinterval
function autoRefresh() {
    intervalId = setInterval(() => {
        fetchWeather(city)
    }, 60000);
}

//initial app load
//fetch weather for default city
fetchWeather(city);

//start auto-refreshing
autoRefresh()


