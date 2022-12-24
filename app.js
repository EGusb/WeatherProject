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
  console.log(fullUrl);

  https.get(fullUrl, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      console.log(weatherData.main);
    });
  });

  //res.sendFile(__dirname + "/index.html");
  res.send(
    `<h1>Weather API App</h1>
    <p>Request made at: ${fullUrl}</p>
    <p>Status code: ${res.statusCode}</p>
    <p>Data:</p>`
    // <p>${JSON.stringify(weatherData)}</p>
  );
});

const port = 3000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
