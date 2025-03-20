import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { JSDOM } from "jsdom";

export default function lonlatRetriever(page_source) {
  //JSDOM is used to convert the example HTML into DOM structure
  const DOM_page_source = new JSDOM(page_source);
  const DOM_document = DOM_page_source.window.document;

  const google_map_tag = DOM_document.getElementById(
    "propertyViewOnGoogleMaps_image"
  );
  const reduced_html_tag = google_map_tag.cloneNode(false).outerHTML;
  console.log(google_map_tag.cloneNode(false).outerHTML);
  return reduced_html_tag;
}

// const google_map_element = html.getElementbyId("propertyViewOnGoogleMaps_image")
