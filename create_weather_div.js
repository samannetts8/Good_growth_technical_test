const example_weather_data = [
  {
    dt: 1742515200,
    main: {
      temp: 26.590774483764775,
      feels_like: 0,
      temp_min: 25.948676096959538,
      temp_max: 27.08084290778285,
      pressure: 1017,
      sea_level: 1017,
      grnd_level: 1006,
      humidity: 30,
      temp_kf: -0.39,
    },
    weather: [
      {
        id: 801,
        main: "Clouds",
        description: "few clouds",
        icon: "02n",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 5.902150593344901,
      deg: 164,
      gust: 18.976172459844815,
    },
    visibility: 10000,
    pop: 1,
    rain: {
      "3h": 1.56,
    },
    sys: {
      pod: "n",
    },
    dt_txt: "2025-03-21 00:00:00",
  },
  {
    dt: 1742526000,
    main: {
      temp: 26.03209731261844,
      feels_like: 0,
      temp_min: 25.558060902337676,
      temp_max: 26.626927469555778,
      pressure: 1017,
      sea_level: 1017,
      grnd_level: 1006,
      humidity: 30,
      temp_kf: -0.39,
    },
    weather: [
      {
        id: 801,
        main: "Clouds",
        description: "few clouds",
        icon: "02n",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 5.902150593344901,
      deg: 164,
      gust: 18.976172459844815,
    },
    visibility: 10000,
    pop: 1,
    rain: {
      "3h": 1.56,
    },
    sys: {
      pod: "n",
    },
    dt_txt: "2025-03-21 03:00:00",
  },
  {
    dt: 1742536800,
    main: {
      temp: 25.022909465592708,
      feels_like: 0,
      temp_min: 22.66665217745349,
      temp_max: 25.025367159170077,
      pressure: 1017,
      sea_level: 1017,
      grnd_level: 1006,
      humidity: 40,
      temp_kf: -0.39,
    },
    weather: [
      {
        id: 802,
        main: "Clouds",
        description: "scattered clouds",
        icon: "03n",
      },
    ],
    clouds: {
      all: 0,
    },
    wind: {
      speed: 5.902150593344901,
      deg: 164,
      gust: 18.976172459844815,
    },
    visibility: 10000,
    pop: 1,
    rain: {
      "3h": 1.56,
    },
    sys: {
      pod: "n",
    },
    dt_txt: "2025-03-21 06:00:00",
  },
];

function getWindDirectionArrow(wind_direction_deg) {
  const arrows = ["↓ S", "↙ SW", "← W", "↖ NW", "↑ N", "↗ NE", "→ E", "↘ SE"];
  return arrows[Math.round(wind_direction_deg / 45) % 8];
}

function createWeatherDiv(weatherData) {
  const {
    main: { temp, temp_min, temp_max },
    wind: { speed, deg },
    rain,
  } = weatherData[0];
  console.log(weatherData[0].weather[0]);
  const condition = weatherData[0].weather[0].main;
  const arrow = getWindDirectionArrow(deg);

  const weather_div = document.createElement("div");
  weather_div.className = `AccordionItemstyle__AccordionItemWrapper-sc-zx14w3-1 eLpRXb Accordionstyle__StyledAccordionItem-sc-5agikf-0 NwcVf`;
  weather_div.id = `place-weather`;
  weather_div.innerHTML = `
  <div class="accordion-item is-open">
      <h3 class="accordion-header">
          <button class="accordion-button" aria-expanded="true">
              Today's Weather
              <svg aria-hidden="true" class="icon icon-chevron-up">
                  <use xlink:href="#icon-chevron-up"></use>
              </svg>
          </button>
      </h3>
      <div class="accordion-content" aria-hidden="false">
          <!-- Weather content structure -->
          <div class="weather-widget">
          <h3>${condition}</h3>
              <div class="weather-temp">${Math.round(temp)}°C</div>
              <div class="weather-temp">Min:${Math.round(
                temp_min
              )}°C, Max:${Math.round(temp_max)}°C</div>
              <div class="weather-details">
                  <div>Wind: ${arrow} ${Math.round(speed)} m/s</div>
                  <div>Rain (Last 3 hours): ${rain["3h"]} mm</div>
              </div>
          </div>
      </div>
  </div>  
`;
  return weather_div;
}

function addElement() {
  const element = createWeatherDiv(example_weather_data);
  const targetNeighbour = document.getElementById(`place-prices`);
  targetNeighbour.parentElement.insertBefore(element, targetNeighbour);
}

document.addEventListener("DOMContentLoaded", () => {
  addElement();
});
