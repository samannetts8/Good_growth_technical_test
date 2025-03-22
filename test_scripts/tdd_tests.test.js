import { describe, it, expect } from "vitest";
import webpage_scraper from "../individual_functions/webpage_scraper";
import fs from "fs";
import weather_fetch from "../individual_functions/weather_fetch";

describe("Longitude, Latitude Retrieval", () => {
  it("should extract specific Latitude and Longitude from Packwood URL", () => {
    //Arrange
    const html_file = fs.readFileSync(
      new URL(
        "./sample_page_sources/packwood_house_page_source.html",
        import.meta.url
      ),
      "utf8"
    );
    //Act
    const result = webpage_scraper(html_file);
    //Assert
    const answer = { latitude: 52.3465, longitude: -1.74551 };

    expect(result).toEqual(answer);
  });

  it("should extract specific Latitude and Longitude from middle littleton URL", () => {
    //Arrange
    const html_file = fs.readFileSync(
      new URL(
        "./sample_page_sources/middle_littleton_tithe_barn_page_source.html",
        import.meta.url
      ),
      "utf8"
    );
    //Act
    const result = webpage_scraper(html_file);
    //Assert
    const answer = { latitude: 52.1213, longitude: -1.88429 };

    expect(result).toEqual(answer);
  });
});

describe("Weather Data Fetch Request", () => {
  it("should return cod for the correct latitude", async () => {
    //Arrange
    const latitude = 27.98785;
    const longitude = 86.925026;
    //Act
    const result = await weather_fetch(latitude, longitude);
    //Assert
    const answer = `42`;

    expect(result).toEqual(answer);
  });
});
