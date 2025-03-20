import { describe, it, expect } from "vitest";
import webpage_scraper from "./webpage_scraper";
import fs from "fs";

//Parsing through example html
const html_file = fs.readFileSync(
  new URL("./packwood_house_page_source.html", import.meta.url),
  "utf8"
);

describe("Longitude, Latitude Retrieval", () => {
  it("should return Lon: 52.3465, Lat: -1.74551", () => {
    expect(webpage_scraper(html_file)).toEqual({
      longitude: 52.3465,
      latitude: -1.74551,
    });
  });
});
