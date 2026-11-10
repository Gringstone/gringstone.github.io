//claude
const API_KEY = "b952ecc3e6187d9102fca2ec449a6fd8";
const GEO_URL = "http://api.openweathermap.org/geo/1.0/direct";
const CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const DEFAULT_ITEMS = ["Search for a city to see the forecast"];

const FORECAST_TIME_FORMAT = new Intl.DateTimeFormat("pl-PL", {
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

function iconUrl(icon) {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

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

function renderForecast(entries) {
  const list = document.getElementById("list");
  list.replaceChildren(
    ...entries.map((entry) => {
      const li = document.createElement("li");
      li.className = "list__item forecast";

      const time = document.createElement("span");
      time.className = "forecast__time";
      time.textContent = FORECAST_TIME_FORMAT.format(entry.time);

      const img = document.createElement("img");
      img.className = "forecast__icon";
      img.src = iconUrl(entry.icon);
      img.alt = entry.description;

      const temp = document.createElement("span");
      temp.className = "forecast__temp";
      temp.textContent = `${entry.temp} °C`;

      const desc = document.createElement("span");
      desc.className = "forecast__desc";
      desc.textContent = entry.description;

      li.append(time, img, temp, desc);
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
    dl.append(dt);

    if (label === "Description") {
      const iconDd = document.createElement("dd");
      iconDd.className = "current__icon";
      const img = document.createElement("img");
      img.src = iconUrl(weather.icon);
      img.alt = weather.description;
      iconDd.append(img);
      dl.append(iconDd);
    }

    const dd = document.createElement("dd");
    dd.textContent = value;
    dl.append(dd);
  }

  square.replaceChildren(heading, dl);
}

async function getJson(url, params) {
  const response = await fetch(`${url}?${new URLSearchParams(params)}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  console.log(`[fetch] ${url}`, data);
  return data;
}

function getXml(url, params) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `${url}?${new URLSearchParams(params)}`);
    xhr.responseType = "document";
    xhr.overrideMimeType("text/xml");
    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error(`HTTP ${xhr.status}`));
      } else if (!xhr.responseXML) {
        reject(new Error("Invalid XML response"));
      } else {
        console.log(`[XHR] ${url}`, xhr.responseXML);
        resolve(xhr.responseXML);
      }
    };
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send();
  });
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
  const doc = await getXml(CURRENT_URL, {
    lat,
    lon,
    units: "metric",
    lang: "pl",
    mode: "xml",
    appid: API_KEY,
  });

  const attr = (tag, name = "value") =>
    doc.querySelector(`current > ${tag}`)?.getAttribute(name) ?? null;

  return {
    temp: Number(attr("temperature")),
    feelsLike: Number(attr("feels_like")),
    pressure: Number(attr("pressure")),
    humidity: Number(attr("humidity")),
    description: attr("weather"),
    icon: attr("weather", "icon"),
  };
}

async function fetchForecast({ lat, lon }) {
  const res = await getJson(FORECAST_URL, {
    lat,
    lon,
    units: "metric",
    lang: "pl",
    appid: API_KEY,
  });

  const offset = res.city.timezone;
  return res.list.map((entry) => ({
    time: new Date((entry.dt + offset) * 1000),
    temp: entry.main.temp,
    description: entry.weather[0].description,
    icon: entry.weather[0].icon,
  }));
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
    const [weather, forecast] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city),
    ]);
    renderCurrent({ place: `${city.country}, ${city.namePl}`, weather });
    renderForecast(forecast);
  } catch (error) {
    console.error(error);
    renderList([`Error: ${error.message}`]);
    renderCurrent(`Error: ${error.message}`);
  }
}

const search = document.getElementById("search");
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  handleSearch(search.value);
});

renderList(DEFAULT_ITEMS);
