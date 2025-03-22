function getABTestGroup() {
  const cookieMatch = document.cookie.match(/ab_weather_widget=([AB])/);

  if (cookieMatch) {
    console.log(`Existing CookieMatch: ${cookieMatch}`);
    return cookieMatch[1];
  }

  const randomGroup = Math.random() < 0.5 ? "A" : "B";
  console.log(`New CookieMatch group assigned: ${randomGroup}`);
  const expirationDays = 30;
  document.cookie = `ab_weather_widget=${randomGroup}; path=/; max-age=${
    86400 * expirationDays
  }`;
  return randomGroup;
}

function handleError(message) {
  console.error(`Error: ${message}`);
  return null;
}

function lonlatRetriever() {
  // Browser Version:
  const google_map_tag = document.getElementById(
    "propertyViewOnGoogleMaps_image"
  );

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
    const filtered_weather_data = weather_data.filter(
      (weather_data) =>
        Number(weather_data.dt_txt.substring(11, 13)) >= 8 &&
        Number(weather_data.dt_txt.substring(11, 13)) <= 19
    );

    return filtered_weather_data;
  } catch (error) {
    console.log(`Weather fetch failed: ${error.message}`);
    throw error;
  }
}

function getWindDirectionArrow(wind_direction_deg) {
  const arrows = ["↑ N", "↗ NE", "→ E", "↘ SE", "↓ S", "↙ SW", "← W", "↖ NW"];
  return arrows[Math.round(wind_direction_deg / 45) % 8];
}

function createSingleWeatherWidget(weatherData) {
  const {
    main: { temp, temp_min, temp_max },
    wind: { speed, deg },
    rain,
    dt_txt,
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
  //Date information retrieval
  const time = dt_txt.substring(11, 16);
  const date = dt_txt.substring(0, 10).split("-");
  const day = date[2];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = months[Number(date[1] - 1)];

  // Create HTML for a single weather forecast
  const widgetHTML = `
    <div class="weather-forecast-item" style="display: flex; flex-direction: column; padding: 15px;">
      <!-- Title -->
      <h4 class="Typographystyle__HeadingLevel4-sc-86wkop-3 erqRvC" style="font-weight: bold;">${time}, ${day} ${month}</h4>
      
      <!-- Icon and main temperature centered -->
      <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 12px;">
        <img src="${icon_url}" alt="${description}" style="width: 75px; height: 75px; margin-bottom: 5px;" />
        <h5 class="weather-temp" style="margin: 0; font-size: 1.2em; font-weight: bold;">${main}<br>${Math.round(
    temp
  )}°C</h5>
      </div>
      
      <!-- Details below, left-aligned -->
      <div style="text-align: left; width: 100%;">
        <div style="font-size: 0.8em; font-style: italic; margin-bottom: 5px;">
          Min: ${Math.round(temp_min)}°C,<br> Max: ${Math.round(temp_max)}°C
        </div>
        <div style="font-size: 0.9em; font-style: italic; margin-bottom: 3px;">
          Wind: ${arrow}, ${Math.round(speed)} m/s
        </div>
        <div style="font-size: 0.9em; font-style: italic;">
          Rain: ${rain && rain["3h"] ? rain["3h"] + " mm" : "None"}
        </div>
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
    <button aria-expanded="false" aria-controls="accordion-item-body--place-weather" id="accordion-item-heading--place-weather" class="SingleAccordionstyle__AccordionButton-sc-1i82miq-3 gKzSXk">
      <span class="Typographystyle__HeadingLevel4-sc-86wkop-3 erqRvC SingleAccordionstyle__StyledHeading-sc-1i82miq-6 AccordionItemstyle__StyledAccordionItemHeading-sc-zx14w3-0 bZUtjF fcsAzv">Upcoming Weather Forecast</span>
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
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 20px;
                justify-content: center;
                padding: 10px;
              }
              .weather-forecast-item {
                background-color: #dee2e6;
                width: 100%;
                height: auto;
                box-sizing: border-box;
                text-align: center;
                padding: 15px;
                border: 1px solid #dedede;
                border-radius: 5px;
                display: flex;
                flex-direction: column;
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

async function collated_script() {
  const ABTestGroup = getABTestGroup();
  if (ABTestGroup === "A") {
    return;
  } else {
    const { latitude, longitude } = lonlatRetriever();
    const result = await weather_fetch(latitude, longitude);
    const element = createWeatherDiv(result);
    addElement(element);

    //Custom eventHandlers for accordion effect - can be removed once the above can access existing javascript eventHandlers
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
        accordionBody.classList.toggle(
          "accordion-item-collapsed",
          !newIsExpanded
        );
        accordionBody.style.visibility = newIsExpanded ? "visible" : "hidden";
        accordionBody.style.setProperty(
          "--calc-height",
          newIsExpanded ? "auto" : "0px"
        );
      });
    }
  }
}

await collated_script();
