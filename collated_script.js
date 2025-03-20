import webpage_scraper from "./webpage_scraper.js";
import weather_fetch from "./weather_fetch.js";
import { addElement, createWeatherDiv } from "./create_weather_div.js";

async function collated_script() {
  const html_file = document.documentElement.innerHTML;
  const { latitude, longitude } = webpage_scraper(html_file);
  const result = await weather_fetch(latitude, longitude);
  const element = createWeatherDiv(result);
  addElement(element);
}

document.addEventListener("DOMContentLoaded", async () => {
  await collated_script();
});
