export async function getData() {
  const fields =
    "name,capital,currencies,maps,timezones,flags,region,subregion,cca3";

  const response = await fetch(
    `https://restcountries.com/v3.1/all?fields=${encodeURIComponent(fields)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }

  return await response.json();
}


