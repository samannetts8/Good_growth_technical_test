function lonlatRetriever(string_DOM) {
  const parser = new DOMParser();
  const html_file = parser.parseFromString(string_DOM, "text/html");

  //find google maps element in HTML
  const google_map_tag = html_file.getElementById(
    "propertyViewOnGoogleMaps_image"
  );

  // Browser Version:
  // const google_map_tag = document.getElementById(
  //   "propertyViewOnGoogleMaps_image"
  // );

  if (!google_map_tag) {
    handleError("No Google Maps Element Detected");
  }

  // isolate top level of tag, exclude any child elements
  const reduced_html_tag = google_map_tag.cloneNode(false).outerHTML;
  if (!reduced_html_tag) {
    handleError("Google Maps child elements not removed");
  }

  //find location of latitude in textAlign:
  const lat_start_index = reduced_html_tag.search("destination=") + 12;
  const lat_end_index = reduced_html_tag.search("%2C");
  const lon_end_index = reduced_html_tag.search(`" id=`);

  const property_latitude = Number(
    reduced_html_tag.substring(lat_start_index, lat_end_index)
  );
  if (!property_latitude) {
    handleError("Property latitude not found");
  }

  const property_longitude = Number(
    reduced_html_tag.substring(lat_end_index + 3, lon_end_index)
  );
  if (!property_longitude) {
    handleError("Property longitude not found");
  }

  const result = {
    latitude: property_latitude,
    longitude: property_longitude,
  };
  return result;
}

async function weather_fetch(latitude, longitude) {
  try {
    if (!latitude || !longitude) {
      throw new Error("Missing required parameters: latitude and longitude");
    }

    const response = await fetch(
      `https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=${latitude}&lon=${longitude}`
    );
    if (!response) {
      throw new Error("Unable to fetch weather api data");
    }

    if (!response.ok) {
      throw new Error(
        `Weather API responded with status: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result) {
      throw new Error("Empty data set received from weather API");
    }

    const weather_data = result.list;

    return weather_data;
  } catch (error) {
    console.log(`Weather fetch failed: ${error.message}`);
    throw error;
  }
}

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
  const { main, description, icon } = weatherData[0].weather[0];
  const arrow = getWindDirectionArrow(deg);

  const icon_url = `http://openweathermap.org/img/wn/${icon}@2x.png`;

  const weather_div = document.createElement("div");
  weather_div.id = `place-weather`;
  weather_div.className = `AccordionItemstyle__AccordionItemWrapper-sc-zx14w3-1 eLpRXb Accordionstyle__StyledAccordionItem-sc-5agikf-0 NwcVf`;
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
            <div class="weather-widget">
              <h4 class="Typographystyle__HeadingLevel4-sc-86wkop-3 erqRvC">${main}</h4>
              <img src="${icon_url}" alt="${description}" />
              <h5 class="weather-temp">${Math.round(temp)}°C</h5>
              <div class="weather-temp">Min: ${Math.round(
                temp_min
              )}°C, Max: ${Math.round(temp_max)}°C</div>
              <div class="weather-details">
                <div>Wind: ${arrow}, ${Math.round(speed)} m/s</div>
                <div>Rain (Last 3 hours): ${rain["3h"]} mm</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
`;
  return weather_div;
}

function addElement(element) {
  const targetNeighbour = document.getElementById(`place-opening-times`);
  targetNeighbour.parentElement.insertBefore(
    element,
    targetNeighbour.nextSibling
  );
}

async function collated_script() {
  const string_DOM = document.documentElement.innerHTML;
  const { latitude, longitude } = lonlatRetriever(string_DOM);
  const result = await weather_fetch(latitude, longitude);
  const element = createWeatherDiv(result);
  addElement(element);
}

document.addEventListener("DOMContentLoaded", async () => {
  await collated_script();
});
