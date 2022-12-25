require("dotenv").config();

const https = require("https");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // Required to parse requests

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const url = "https://api.openweathermap.org/data/2.5/weather";
  const apiKey = process.env.WEATHER_APPID;
  const query = req.body.cityName;
  const units = "metric";

  const fullUrl = `${url}?appid=${apiKey}&q=${query}&units=${units}`;

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
      res.write(
        `<p>The temperature in ${weatherData.name} is: ${temp} &deg;C</p>`
      );
      res.write(`<p>The weather is currently '${desc}'</p>`);
      res.write(`<img src="${imgURL}" alt="weather-icon">`);
      res.write(`<p>Complete data:</p><ul>`);

      for (const [k, v] of Object.entries(weatherData)) {
        res.write(`<li>${k}: ${JSON.stringify(v)}</li>`);
      }

      res.write(`</ul>`);
      res.write(
        `<form action="/" method="get"><button type="submit">Back</button></form>`
      );
      res.send();
    });
  });
});

const port = 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
