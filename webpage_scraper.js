import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

export default function lonlatRetriever(html) {
  const output = {
    longitude: 52.3465,
    latitude: -1.74551,
  };
  return output;
}


// const google_map_element = html.getElementbyId("propertyViewOnGoogleMaps_image")
