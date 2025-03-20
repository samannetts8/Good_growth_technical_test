import { describe, it, expect } from "vitest";
import webpage_scraper from "./webpage_scraper";
import fs from "fs";

// describe("Longitude, Latitude Retrieval", () => {
//   it("should return Lon: 52.3465, Lat: -1.74551", () => {
//     //Arrange
//     const html_file = fs.readFileSync(
//       new URL("./packwood_house_page_source.html", import.meta.url),
//       "utf8"
//     );
//     //Act
//     const result = webpage_scraper(html_file);
//     //Assert
//     const answer = {
//       longitude: 52.3465,
//       latitude: -1.74551,
//     };

//     expect(result).toEqual(answer);
//   });
// });

describe("Longitude, Latitude Retrieval", () => {
  it("should return the whole Google Maps element", () => {
    //Arrange
    const html_file = fs.readFileSync(
      new URL("./packwood_house_page_source.html", import.meta.url),
      "utf8"
    );
    //Act
    const result = webpage_scraper(html_file);
    //Assert
    const answer = `<a href="https://www.google.com/maps/dir/?api=1&amp;destination=52.3465%2C-1.74551" id="propertyViewOnGoogleMaps_image"></a>`;

    expect(result).toEqual(answer);
  });

  it("should return the whole Google Maps element", () => {
    //Arrange
    const html_file = fs.readFileSync(
      new URL(
        "./middle_littleton_tithe_barn_page_source.html",
        import.meta.url
      ),
      "utf8"
    );
    //Act
    const result = webpage_scraper(html_file);
    //Assert
    const answer = `<a href="https://www.google.com/maps/dir/?api=1&amp;destination=52.1213%2C-1.88429" id="propertyViewOnGoogleMaps_image"></a>`;

    expect(result).toEqual(answer);
  });
});
