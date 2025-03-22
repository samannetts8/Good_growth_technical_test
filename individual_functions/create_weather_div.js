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

// This function creates a single weather widget
function createSingleWeatherWidget(weatherData) {
  const {
    main: { temp, temp_min, temp_max },
    wind: { speed, deg },
    rain,
  } = weatherData;
  const { main, description, icon } = weatherData.weather[0];
  const arrow = getWindDirectionArrow(deg);
  const icon_url = `http://openweathermap.org/img/wn/${icon}@2x.png`;

  // Create HTML for a single weather forecast
  const widgetHTML = `
    <div class="weather-forecast-item">
      <h4 class="Typographystyle__HeadingLevel4-sc-86wkop-3 erqRvC">${main}</h4>
      <img src="${icon_url}" alt="${description}" />
      <h5 class="weather-temp">${Math.round(temp)}°C</h5>
      <div class="weather-temp">Min: ${Math.round(
        temp_min
      )}°C, Max: ${Math.round(temp_max)}°C</div>
      <div class="weather-details">
        <div>Wind: ${arrow}, ${Math.round(speed)} m/s</div>
        <div>Rain (Last 3 hours): ${rain["3h"] || 0} mm</div>
      </div>
    </div>
  `;
  return widgetHTML;
}

// This function creates the accordion container with all weather widgets
export function createWeatherDiv(weatherDataArray) {
  // Create container div for the accordion
  const weather_div = document.createElement("div");
  weather_div.id = `place-weather`;
  weather_div.className = `AccordionItemstyle__AccordionItemWrapper-sc-zx14w3-1 eLpRXb Accordionstyle__StyledAccordionItem-sc-5agikf-0 NwcVf`;

  // Generate the HTML for all weather widgets
  let widgetsHTML = "";
  weatherDataArray.forEach((data) => {
    widgetsHTML += createSingleWeatherWidget(data);
  });

  // Create the complete accordion HTML structure
  weather_div.innerHTML = `
  <h2 class="Typographystyle__HeadingLevel4-sc-86wkop-3 erqRvC SingleAccordionstyle__StyledHeading-sc-1i82miq-6 bZUtjF">
    <button aria-expanded="false" aria-controls="accordion-item-body--place-weather" id="accordion-item-heading--place-weather" class="SingleAccordionstyle__AccordionButton-sc-1i82miq-3 gKzSXk">
      <span class="Typographystyle__HeadingLevel4-sc-86wkop-3 erqRvC SingleAccordionstyle__StyledHeading-sc-1i82miq-6 AccordionItemstyle__StyledAccordionItemHeading-sc-zx14w3-0 bZUtjF fcsAzv">Weather Forecast</span>
      <div class="SingleAccordionstyle__StyledIconWrapper-sc-1i82miq-0 fNhssB">
        <span class="Iconstyle__SVGWrapper-sc-461blh-0 hJKaYd SingleAccordionstyle__StyledIcon-sc-1i82miq-1 FYAss" data-ui-icon-type="chevronDown">
          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="100%" height="100%">
            <g><path d="M1.4,3.5L8,10.1l6.6-6.6L16,4.9l-7.3,7.3c-0.2,0.2-0.4,0.3-0.7,0.3c-0.3,0-0.5-0.1-0.7-0.3L0,4.9L1.4,3.5z"></path></g>
          </svg>
        </span>
      </div>
    </button>
  </h2>
  <div id="accordion-item-body--place-weather" aria-hidden="true" aria-labelledby="accordion-item-heading--place-weather" class="SingleAccordionstyle__AccordionBody-sc-1i82miq-4 fwPNxK accordion-item-collapsed" style="--calc-height: 0px; visibility: hidden;">
    <div>
      <section class="Sectionstyle__StyledSection-sc-1rnt8u1-0 eigAqT">
        <div class="Sectionstyle__Inner-sc-1rnt8u1-1 hopRYb">
          <div class="Sectionstyle__Content-sc-1rnt8u1-3">
            <div class="weather-widget-container">
              ${widgetsHTML}
            </div>
            <style>
              .weather-widget-container {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                justify-content: space-around;
              }
              .weather-forecast-item {
                flex: 1;
                min-width: 200px;
                max-width: 300px;
                text-align: center;
                padding: 10px;
                border: 1px solid #dedede;
                border-radius: 5px;
                margin-bottom: 10px;
              }
            </style>
          </div>
        </div>
      </section>
    </div>
  </div>
  `;

  return weather_div;
}

export function addElement() {
  // Pass the entire example_weather_data array to create multiple widgets
  const element = createWeatherDiv(example_weather_data);
  const targetNeighbour = document.getElementById(`place-opening-times`);
  targetNeighbour.parentElement.insertBefore(
    element,
    targetNeighbour.nextSibling
  );
}
