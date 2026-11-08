const API_KEY = "b952ecc3e6187d9102fca2ec449a6fd8";
const GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";
const CURRENT_URL = "https://api.openweathermap.org/data/4.0/onecall/current";

const DEFAULT_ITEMS = ["No API yet"];

function renderList(items) {
  const list = document.getElementById("list");
  list.replaceChildren(
    ...items.map((text) => {
      const li = document.createElement("li");
      li.className = "list__item";
      li.textContent = text;
      return li;
    })
  );
}

function renderCurrent(content) {
  const square = document.getElementById("current");
  if (typeof content === "string") {
    const p = document.createElement("p");
    p.className = "current__message";
    p.textContent = content;
    square.replaceChildren(p);
    return;
  }

  const { place, weather } = content;

  const heading = document.createElement("p");
  heading.className = "current__place";
  heading.textContent = place;

  const rows = [
    ["Description", weather.description],
    ["Temperature", `${weather.temp} °C`],
    ["Feels like", `${weather.feelsLike} °C`],
    ["Pressure", `${weather.pressure} hPa`],
    ["Humidity", `${weather.humidity} %`],
  ];

  const dl = document.createElement("dl");
  dl.className = "current__details";
  for (const [label, value] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    dl.append(dt, dd);
  }

  square.replaceChildren(heading, dl);
}

async function getJson(url, params) {
  const response = await fetch(`${url}?${new URLSearchParams(params)}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

async function fetchCity(cityName) {
  const res = await getJson(GEO_URL, {
    q: cityName,
    limit: "1",
    appid: API_KEY,
  });
  if (!res.length) return null;

  const { lat, lon, country, name, local_names: localNames } = res[0];
  return { lat, lon, country, namePl: localNames?.pl ?? name };
}

async function fetchCurrentWeather({ lat, lon }) {
  const res = await getJson(CURRENT_URL, {
    lat,
    lon,
    units: "metric",
    lang: "pl",
    appid: API_KEY,
  });

  const current = res.data[0];
  return {
    temp: current.temp,
    feelsLike: current.feels_like,
    pressure: current.pressure,
    humidity: current.humidity,
    description: current.weather[0].description,
  };
}

async function handleSearch(query) {
  const cityName = query.trim();
  if (!cityName) return;

  renderList(["Loading..."]);
  renderCurrent("Loading...");
  try {
    const city = await fetchCity(cityName);
    if (!city) {
      renderList(["No results"]);
      renderCurrent("No results");
      return;
    }
    renderList([`lat: ${city.lat}, lon: ${city.lon}`]);

    const weather = await fetchCurrentWeather(city);
    renderCurrent({ place: `${city.country}, ${city.namePl}`, weather });
  } catch (error) {
    console.error(error);
    renderList([`Error: ${error.message}`]);
    renderCurrent(`Error: ${error.message}`);
  }
}

const search = document.getElementById("search");
search.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch(search.value);
  }
});

renderList(DEFAULT_ITEMS);
