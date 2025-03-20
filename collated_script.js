import webpage_scraper from "./webpage_scraper.js";
import fs from "fs";
import weather_fetch from "./weather_fetch.js";

const html_file = fs.readFileSync(
  new URL(
    "./sample_page_sources/packwood_house_page_source.html",
    import.meta.url
  ),
  "utf8"
);

async function collated_script(html_file) {
  const { latitude, longitude } = webpage_scraper(html_file);
  const cod = await weather_fetch(latitude, longitude);
  console.log(cod);
}

console.log(collated_script(html_file));
