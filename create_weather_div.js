function createWeatherDiv(weather_fetch_data) {
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
              <div class="weather-temp">111°C</div>
              <div class="weather-condition">Sunny</div>
              <div class="weather-details">
                  <span>Wind: 333 mph</span>
                  <span>Humidity: 89%</span>
              </div>
          </div>
      </div>
  </div>
`;
  return weather_div;
}

function addElement() {
  const element = createWeatherDiv("Yes");

  const targetNeighbour = document.getElementById(`place-prices`);
  targetNeighbour.parentElement.insertBefore(element, targetNeighbour);
  console.log("weather div insterted");
}

document.addEventListener("DOMContentLoaded", function () {
  addElement();
});
