export default async function weather_fetch(latitude, longitude) {
  const response = await fetch(
    `https://europe-west1-amigo-actions.cloudfunctions.net/recruitment-mock-weather-endpoint/forecast?appid=a2ef86c41a&lat=${latitude}&lon=${longitude}`
  );
  const result = await response.json();
  const cod = result.cod;
  return cod;
}
