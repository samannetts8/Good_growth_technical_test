export default async function weather_fetch(latitude, longitude) {
  try {
    if (!latitude || !longitude) {
      throw new Error("Missing required parameters: latitude and longitude");
    }

    const response = await fetch(
      `https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=${latitude}&lon=${longitude}`
    );
    if (!response) {
      throw new Error("Unable to fetch weather api data");
    }

    if (!response.ok) {
      throw new Error(
        `Weather API responded with status: ${response.status} - ${response.statusText}`
      );
    }

    const result = await response.json();

    if (!result) {
      throw new Error("Empty data set received from weather API");
    }

    const weather_data = result.list;
    const filtered_weather_data = weather_data.filter(
      (weather_data) =>
        Number(weather_data.dt_txt.substring(11, 13)) >= 9 &&
        Number(weather_data.dt_txt.substring(11, 13)) <= 18
    );

    return filtered_weather_data;
  } catch (error) {
    console.log(`Weather fetch failed: ${error.message}`);
    throw error;
  }
}

//Test case from given example endpoint
console.log(await weather_fetch(27.98785, 86.925026));
