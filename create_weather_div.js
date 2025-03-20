function createWeatherDiv(weather_fetch_data) {
  const weather_div = document.createElement("div");
  //   weather_div.className = `AccordionItemstyle__AccordionItemWrapper-sc-zx14w3-1 eLpRXb Accordionstyle__StyledAccordionItem-sc-5agikf-0 NwcVf`;
  weather_div.innerHTML = `<div> Test</div>`;
  return weather_div;
}

document.addEventListener("DOMContentLoaded", async () => {
  const element = createWeatherDiv("Yes");

  const targetNeighbour = document.querySelector("place-postal-address");
  targetNeighbour.parentElement.insertBefore(element, targetNeighbour);
  console.log("weather div insterted");
});
