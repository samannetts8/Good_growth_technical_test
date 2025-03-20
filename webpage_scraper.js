import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

const html_file = fs.readFileSync(
  new URL("./packwood_house_page_source.html", import.meta.url),
  "utf8"
);

export default function lonlatRetriever(html_file) {
  //JSDOM is used to convert the example HTML into DOM structure
  const DOM_page_source = new JSDOM(html_file);
  const DOM_document = DOM_page_source.window.document;

  //find google maps element in HTML
  const google_map_tag = DOM_document.getElementById(
    "propertyViewOnGoogleMaps_image"
  );

  // isolate top level of tag, exclude any child elements
  const reduced_html_tag = google_map_tag.cloneNode(false).outerHTML;

  //find location of latitude in textAlign:
  const lat_start_index = reduced_html_tag.search("destination=") + 12;
  const lat_end_index = reduced_html_tag.search("%2C");
  const lon_end_index = reduced_html_tag.search(`" id=`);

  const property_latitude = Number(
    reduced_html_tag.substring(lat_start_index, lat_end_index)
  );

  const property_longitude = Number(
    reduced_html_tag.substring(lat_end_index + 3, lon_end_index)
  );

  const result = {
    latitude: property_latitude,
    longitude: property_longitude,
  };
  return result;
}

console.log(lonlatRetriever(html_file));

// const google_map_element = html.getElementbyId("propertyViewOnGoogleMaps_image")
