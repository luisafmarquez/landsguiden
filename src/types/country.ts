// Define the shape of a country object returned by https://restcountries.com/
export interface Country {
  cca3: string; // Unique 3-letter code (e.g., "FRA", "SWE") used as a unique React key
  name: {
    common: string; // The common name of the country (e.g., "Sweden")
  };
  flags: {
    png: string; // Image URL for the country's flag
    alt?: string; // Optional accessible description of the flag
  };
  capital?: string[]; // Capital city (API returns an array, e.g. ["Stockholm"])
  population: number; // Total population count (e.g. 10353442)
  languages?: Record<string, string>; // Key-value pairs of languages (e.g. { swe: "Swedish" })
  region: string; // Continent/region (e.g. "Europe")
}
