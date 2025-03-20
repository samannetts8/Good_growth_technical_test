import webpage_scraper from "./webpage_scraper.js";
import fs from "fs";
import weather_fetch from "./weather_fetch.js";
import { addElement, createWeatherDiv } from "./create_weather_div.js";
import { resourceLimits } from "worker_threads";

const html_file = fs.readFileSync(
  new URL(
    "./sample_page_sources/packwood_house_page_source.html",
    import.meta.url
  ),
  "utf8"
);

async function collated_script(html_file) {
  const { latitude, longitude } = webpage_scraper(html_file);
  const result = await weather_fetch(latitude, longitude);
  const element = createWeatherDiv(result)
  
  return result;
}

document.addEventListener("DOMContentLoaded", async () => {
  await collated_script(html_file);
});
