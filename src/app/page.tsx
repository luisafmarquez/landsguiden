"use client";

import { useState, useEffect } from "react";
import { Country } from "@/types/country";

export default function HomePage() {
  // 1. State variables to store countries, loading status, and error messages
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 2. State variable to store the user's search query
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 3. useEffect runs once on page load to fetch country data
  useEffect(() => {
    async function fetchCountries() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch country data directly from the jsDelivr public REST Countries endpoint
        const response = await fetch(
          "https://cdn.jsdelivr.net/gh/restcountries/restcountries@master/src/main/resources/countriesV3.1.json"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch countries from the API.");
        }

        const data: Country[] = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format received.");
        }
        setCountries(data);
      } catch (err) {
        setError("Could not load countries. Please check your internet connection or try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCountries();
  }, []);

  // 4. Real-time filtering by country name (case-insensitive)
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <main className="container">
      {/* Header with Swedish title and subtitle */}
      <header className="header">
        <h1 className="title">Landsguiden</h1>
        <p className="subtitle">En enkel guide till länder runt om i världen</p>
      </header>

      {/* Search input for filtering countries */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by country name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Loading feedback */}
      {isLoading && (
        <p className="status-message">Loading countries...</p>
      )}

      {/* Error feedback */}
      {error && !isLoading && (
        <p className="status-message error-message">{error}</p>
      )}

      {/* Empty search results feedback */}
      {!isLoading && !error && filteredCountries.length === 0 && (
        <p className="status-message">No countries found.</p>
      )}

      {/* Responsive grid displaying each country's information */}
      {!isLoading && !error && filteredCountries.length > 0 && (
        <div className="country-grid">
          {filteredCountries.map((country) => (
            <div key={country.cca3} className="country-card">
              <img
                src={country.flags.png}
                alt={country.flags.alt || `${country.name.common} flag`}
                className="flag-image"
              />
              <div className="card-content">
                <h2 className="country-name">{country.name.common}</h2>

                {/* Country details: capital, region, population, and languages */}
                <div className="country-info">
                  <p>
                    <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
                  </p>
                  <p>
                    <strong>Region:</strong> {country.region || "N/A"}
                  </p>
                  <p>
                    <strong>Population:</strong> {country.population.toLocaleString()}
                  </p>
                  <p>
                    <strong>Languages:</strong>{" "}
                    {country.languages
                      ? Object.values(country.languages).join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
