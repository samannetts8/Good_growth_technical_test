function handleError(message) {
  console.error(`Error: ${message}`);
  return null;
}

function lonlatRetriever(string_DOM) {
  const parser = new DOMParser();
  const html_file = parser.parseFromString(string_DOM, "text/html");
  console.log(html_file);
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

console.log(lonlatRetriever());
const { latitude, longitude } = lonlatRetriever();
console.log(latitude);
console.log(longitude);

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

console.log(await weather_fetch(latitude, longitude));
const result = await weather_fetch(latitude, longitude);

function getWindDirectionArrow(wind_direction_deg) {
  const arrows = ["↑ N", "↗ NE", "→ E", "↘ SE", "↓ S", "↙ SW", "← W", "↖ NW"];
  return arrows[Math.round(wind_direction_deg / 45) % 8];
}

function createSingleWeatherWidget(weatherData) {
  const {
    main: { temp, temp_min, temp_max },
    wind: { speed, deg },
    rain,
  } = weatherData;
  const { main, description, icon } = weatherData.weather[0];
  const arrow = getWindDirectionArrow(deg);
  const icon_url = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  //Capitalise description to be used as title
  const description_array = description.split(" ");
  const description_capitals = description_array.map((word) => {
    return word.charAt(0).toUpperCase() + word.substring(1, word.length);
  });
  const title_description = description_capitals.join(" ");

  // Create HTML for a single weather forecast
  const widgetHTML = `
    <div class="weather-forecast-item">
      <h4 class="Typographystyle__HeadingLevel4-sc-86wkop-3 erqRvC">${title_description}</h4>
      <img src="${icon_url}" alt="${description}" />
      <h4 class="weather-temp">${Math.round(temp)}°C</h4>
      <h5 class="weather-temp">Min: ${Math.round(
        temp_min
      )}°C, Max: ${Math.round(temp_max)}°C</h5>
      <div class="weather-details">
        <div>Wind: ${arrow}, ${Math.round(speed)} m/s</div>
        <div>Rain (Last 3 hours): ${rain["3h"]} mm</div>
      </div>
    </div>
  `;
  return widgetHTML;
}

// This function creates the accordion container with all weather widgets
function createWeatherDiv(weatherDataArray) {
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
    <button aria-expanded="true" aria-controls="accordion-item-body--place-weather" id="accordion-item-heading--place-weather" class="SingleAccordionstyle__AccordionButton-sc-1i82miq-3 gKzSXk">
      <span class="Typographystyle__HeadingLevel4-sc-86wkop-3 erqRvC SingleAccordionstyle__StyledHeading-sc-1i82miq-6 AccordionItemstyle__StyledAccordionItemHeading-sc-zx14w3-0 bZUtjF fcsAzv">Weather Forecast</span>
      <div class="SingleAccordionstyle__StyledIconWrapper-sc-1i82miq-0 fNhssB">
        <span class="Iconstyle__SVGWrapper-sc-461blh-0 hJKaYd SingleAccordionstyle__StyledIcon-sc-1i82miq-1 FYAss" data-ui-icon-type="chevronDown">
          <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="false" focusable="false" viewBox="0 0 16 16" width="100%" height="100%">
            <g><path d="M1.4,3.5L8,10.1l6.6-6.6L16,4.9l-7.3,7.3c-0.2,0.2-0.4,0.3-0.7,0.3c-0.3,0-0.5-0.1-0.7-0.3L0,4.9L1.4,3.5z"></path></g>
          </svg>
        </span>
      </div>
    </button>
  </h2>
  <div id="accordion-item-body--place-weather" aria-hidden="true" aria-labelledby="accordion-item-heading--place-weather" class="SingleAccordionstyle__AccordionBody-sc-1i82miq-4 fwPNxK accordion-item-collapsed" style="--calc-height: auto; visibility: visible;">
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
                background-color: #dee2e6;
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

function addElement(element) {
  const targetNeighbour = document.getElementById(`place-opening-times`);
  targetNeighbour.parentElement.insertBefore(
    element,
    targetNeighbour.nextSibling
  );
}

const element = createWeatherDiv(result);
console.log(addElement(element));

const accordionButton = document.getElementById(
  "accordion-item-heading--place-weather"
);
const accordionBody = document.getElementById(
  "accordion-item-body--place-weather"
);

if (accordionButton && accordionBody) {
  accordionButton.addEventListener("click", function (e) {
    e.preventDefault();
    const wrapper = this.closest(
      ".AccordionItemstyle__AccordionItemWrapper-sc-zx14w3-1"
    );
    const isExpanded = this.getAttribute("aria-expanded") === "true";
    const newIsExpanded = !isExpanded;

    // Toggle wrapper class
    if (wrapper) {
      wrapper.className = newIsExpanded
        ? "AccordionItemstyle__AccordionItemWrapper-sc-zx14w3-1 POCqK Accordionstyle__StyledAccordionItem-sc-5agikf-0 NwcVf"
        : "AccordionItemstyle__AccordionItemWrapper-sc-zx14w3-1 eLpRXb Accordionstyle__StyledAccordionItem-sc-5agikf-0 NwcVf";
    }

    // Update ARIA attributes
    this.setAttribute("aria-expanded", newIsExpanded.toString());
    accordionBody.setAttribute("aria-hidden", (!newIsExpanded).toString());

    // Toggle visibility
    accordionBody.classList.toggle("accordion-item-collapsed", !newIsExpanded);
    accordionBody.style.visibility = newIsExpanded ? "visible" : "hidden";
    accordionBody.style.setProperty(
      "--calc-height",
      newIsExpanded ? "auto" : "0px"
    );
  });
}

async function collated_script() {
  const string_DOM = document.documentElement.innerHTML;
  const { latitude, longitude } = lonlatRetriever(string_DOM);
  const result = await weather_fetch(latitude, longitude);
  let element = createWeatherDiv(result);
  addElement(element);
}

document.addEventListener("DOMContentLoaded", async () => {
  await collated_script();
});
