require("dotenv").config();

const https = require("https");
const express = require("express");

const app = express();

app.get("/", function (req, res) {
  const url = "https://api.openweathermap.org/data/2.5/weather";
  const params = {
    appid: process.env.WEATHER_APPID,
    q: "resistencia",
    units: "metric",
  };

  let paramString = "";
  for (const [key, value] of Object.entries(params)) {
    paramString += `${key}=${value}&`;
  }

  paramString = paramString.slice(0, paramString.length - 1);
  const fullUrl = `${url}?${paramString}`;

  https.get(fullUrl, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      res.write("<h1>Weather API App</h1>");
      res.write(`<p>Request made at: ${fullUrl}</p>`);
      res.write(`<p>Status code: ${res.statusCode}</p>`);
      res.write(`<p>The temperature in ${weatherData.name} is: ${temp} &deg;C</p>`);
      res.write(`<p>The weather is currently '${desc}'</p>`);
      res.write(`<img src="${imgURL}" alt="weather-icon">`);
      res.write(`<p>Complete data:</p><ul>`);
      
      for (const [k, v] of Object.entries(weatherData)) {
        res.write(`<li>${k}: ${JSON.stringify(v)}</li>`);

      }

      res.write(`</ul>`);
      res.send();
    });
  });
});

const port = 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
