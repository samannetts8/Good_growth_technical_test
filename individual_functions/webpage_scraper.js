function handleError(message) {
  console.error(`Error: ${message}`);
  return null;
}

export default function lonlatRetriever(string_file) {
  const parser = new DOMParser();
  const html_file = parser.parseFromString(string_file, "text/html");

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

// const google_map_element = html.getElementbyId("propertyViewOnGoogleMaps_image")
