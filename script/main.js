const apiKey = "a052c670c17dec78d366edeb7b761229";

function setDynamicBackground(weatherMain) {
  const body = document.body;
  body.classList.remove(
    "weather-clear",
    "weather-clouds",
    "weather-rain",
    "weather-default"
  );
  switch (weatherMain) {
    case "Clear":
      body.classList.add("weather-clear");
      break;
    case "Clouds":
      body.classList.add("weather-clouds");
      break;
    case "Rain":
    case "Drizzle":
    case "Thunderstorm":
      body.classList.add("weather-rain");
      break;
    default:
      body.classList.add("weather-default");
  }
}

function buscarClima() {
  const cidade = document.getElementById("search-input").value;

  const nomeCidadeEl = document.getElementById("cidade-nome");
  const tempEl = document.getElementById("cidade-temp");
  const descricaoEl = document.getElementById("cidade-descricao");
  const iconEl = document.getElementById("clima-icone");
  const umidadeEl = document.getElementById("umidade");
  const ventoEl = document.getElementById("vento");

  const tempLabel = document.querySelector(".temp-label");
  const umidadeLabel = document.getElementById("umidade-label");
  const ventoLabel = document.getElementById("vento-label");

  const previsaoHoraContainer = document.getElementById("previsao-por-hora");
  const hourlyListEl = document.getElementById("hourly-list");

  if (!cidade) {
    nomeCidadeEl.textContent = "Por favor, digite uma cidade.";
    tempEl.textContent = "";
    descricaoEl.textContent = "";
    iconEl.src = "";
    umidadeEl.textContent = "";
    ventoEl.textContent = "";
    previsaoHoraContainer.style.display = "none";
    setDynamicBackground("default");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${apiKey}&units=metric&lang=pt_br`;

  nomeCidadeEl.textContent = `Buscando...`;
  tempEl.textContent = "---";
  descricaoEl.textContent = "";
  iconEl.src = "";
  umidadeEl.textContent = "---";
  ventoEl.textContent = "---";
  tempLabel.style.display = "none";
  umidadeLabel.style.display = "none";
  ventoLabel.style.display = "none";

  previsaoHoraContainer.style.display = "none";
  hourlyListEl.innerHTML = "";

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Cidade não encontrada (${res.status})`);
      }
      return res.json();
    })
    .then((data) => {
      if (!data.list || data.list.length === 0) {
        throw new Error("Nenhum dado de previsão encontrado");
      }

      tempLabel.style.display = "block";
      umidadeLabel.style.display = "block";
      ventoLabel.style.display = "block";

      const infoPrincipal = data.list[0];
      const descricao = infoPrincipal.weather[0].description;
      const temperatura = infoPrincipal.main.temp;
      const iconCode = infoPrincipal.weather[0].icon;
      const umidade = infoPrincipal.main.humidity;
      const vento = infoPrincipal.wind.speed;
      const weatherMain = infoPrincipal.weather[0].main;

      nomeCidadeEl.textContent = data.city.name;
      descricaoEl.textContent = descricao;
      tempEl.textContent = `${Math.round(temperatura)}°C`;
      iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      umidadeEl.textContent = `${umidade}%`;
      ventoEl.textContent = `${Math.round(vento * 3.6)} km/h`;
      setDynamicBackground(weatherMain);

      const proximasHoras = data.list.slice(1, 7);

      proximasHoras.forEach((item) => {
        const dataHora = new Date(item.dt_txt);
        const horaFormatada =
          dataHora.getHours().toString().padStart(2, "0") + ":00";

        const tempHora = Math.round(item.main.temp);
        const iconHora = item.weather[0].icon;

        const cardHTML = `
          <div class="hora-card">
            <span class="hora-card-time">${horaFormatada}</span>
            <img src="https://openweathermap.org/img/wn/${iconHora}.png" class="hora-card-icon">
            <span class="hora-card-temp">${tempHora}°</span>
          </div>
        `;

        hourlyListEl.innerHTML += cardHTML;
      });

      previsaoHoraContainer.style.display = "block";
    })
    .catch((err) => {
      console.error("Erro ao buscar clima:", err);
      nomeCidadeEl.textContent = "Erro ao buscar";
      tempEl.textContent = ":(";
      descricaoEl.textContent = err.message;
      iconEl.src = "";
      umidadeEl.textContent = "";
      ventoEl.textContent = "";
      previsaoHoraContainer.style.display = "none";
      setDynamicBackground("default");
    });
}
