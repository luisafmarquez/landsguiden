"use client";

import { useEffect, useState } from "react";
import { Country } from "@/types/country";

export default function HomePage() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const [favorites, setFavorites] = useState<string[]>([]);

  const [countryOne, setCountryOne] = useState("");
  const [countryTwo, setCountryTwo] = useState("");

  useEffect(() => {
    async function fetchCountries() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/countries");

        if (!response.ok) {
          throw new Error("Could not load countries");
        }

        const data: Country[] = await response.json();

        setCountries(data);
      } catch (error) {
        setError("Something went wrong when loading countries.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCountries();
  }, []);

  // Add or remove a favorite
  function toggleFavorite(countryName: string) {
    if (favorites.includes(countryName)) {
      setFavorites(
        favorites.filter((favorite) => favorite !== countryName)
      );
    } else {
      setFavorites([...favorites, countryName]);
    }
  }

  // Search and region filter
  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());

    const matchesRegion =
      selectedRegion === "All" ||
      country.region === selectedRegion;

    return matchesSearch && matchesRegion;
  });

  // Find the countries selected for comparison
  const selectedCountryOne = countries.find(
    (country) => country.name.common === countryOne
  );

  const selectedCountryTwo = countries.find(
    (country) => country.name.common === countryTwo
  );

  // Get languages
  function getLanguages(country: Country) {
    if (!country.languages) {
      return "N/A";
    }

    return Object.values(country.languages).join(", ");
  }

  return (
    <main className="container">
      <header className="header">
        <h1 className="title">Landsguiden</h1>

        <p className="subtitle">
          En enkel guide till länder runt om i världen
        </p>
      </header>

      {/* SEARCH AND REGION FILTER */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by country name..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          className="search-input"
        />

        <select
          value={selectedRegion}
          onChange={(event) =>
            setSelectedRegion(event.target.value)
          }
          className="search-input"
        >
          <option value="All">All regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      {/* COMPARE COUNTRIES */}
      <section
        style={{
          marginTop: "30px",
          marginBottom: "30px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2 style={{ marginBottom: "15px" }}>
          Compare Countries
        </h2>

        <div
          style={{
            display: "flex",
            gap: "15px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {/* First country */}
          <input
            list="countries-one"
            placeholder="Type first country..."
            value={countryOne}
            onChange={(event) =>
              setCountryOne(event.target.value)
            }
            style={{
              padding: "10px",
              flex: "1",
              minWidth: "220px",
            }}
          />

          <datalist id="countries-one">
            {countries.map((country) => (
              <option
                key={country.cca3}
                value={country.name.common}
              />
            ))}
          </datalist>

          {/* Second country */}
          <input
            list="countries-two"
            placeholder="Type second country..."
            value={countryTwo}
            onChange={(event) =>
              setCountryTwo(event.target.value)
            }
            style={{
              padding: "10px",
              flex: "1",
              minWidth: "220px",
            }}
          />

          <datalist id="countries-two">
            {countries.map((country) => (
              <option
                key={country.cca3}
                value={country.name.common}
              />
            ))}
          </datalist>
        </div>

        {/* Show comparison when both countries are selected */}
        {selectedCountryOne && selectedCountryTwo && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >
            {/* COUNTRY ONE */}
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              <img
                src={selectedCountryOne.flags.png}
                alt={
                  selectedCountryOne.flags.alt ||
                  `${selectedCountryOne.name.common} flag`
                }
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />

              <h3>
                {selectedCountryOne.name.common}
              </h3>

              <p>
                <strong>Capital:</strong>{" "}
                {selectedCountryOne.capital?.[0] ||
                  "N/A"}
              </p>

              <p>
                <strong>Region:</strong>{" "}
                {selectedCountryOne.region || "N/A"}
              </p>

              <p>
                <strong>Population:</strong>{" "}
                {selectedCountryOne.population.toLocaleString()}
              </p>

              <p>
                <strong>Languages:</strong>{" "}
                {getLanguages(selectedCountryOne)}
              </p>
            </div>

            {/* COUNTRY TWO */}
            <div
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "15px",
              }}
            >
              <img
                src={selectedCountryTwo.flags.png}
                alt={
                  selectedCountryTwo.flags.alt ||
                  `${selectedCountryTwo.name.common} flag`
                }
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />

              <h3>
                {selectedCountryTwo.name.common}
              </h3>

              <p>
                <strong>Capital:</strong>{" "}
                {selectedCountryTwo.capital?.[0] ||
                  "N/A"}
              </p>

              <p>
                <strong>Region:</strong>{" "}
                {selectedCountryTwo.region || "N/A"}
              </p>

              <p>
                <strong>Population:</strong>{" "}
                {selectedCountryTwo.population.toLocaleString()}
              </p>

              <p>
                <strong>Languages:</strong>{" "}
                {getLanguages(selectedCountryTwo)}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* FAVORITES */}
      {favorites.length > 0 && (
        <section
          style={{
            marginBottom: "30px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h2>Favorite Countries:</h2>

          {favorites.map((favorite) => (
            <div
              key={favorite}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              <span>⭐ {favorite}</span>

              {/* Remove favorite directly */}
              <button
                type="button"
                onClick={() =>
                  toggleFavorite(favorite)
                }
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
                aria-label={`Remove ${favorite} from favorites`}
              >
                ❌
              </button>
            </div>
          ))}
        </section>
      )}

      {/* LOADING */}
      {isLoading && (
        <p className="status-message">
          Loading countries...
        </p>
      )}

      {/* ERROR */}
      {error && !isLoading && (
        <p className="status-message error-message">
          {error}
        </p>
      )}

      {/* NO COUNTRIES FOUND */}
      {!isLoading &&
        !error &&
        filteredCountries.length === 0 && (
          <p className="status-message">
            No countries found.
          </p>
        )}

      {/* COUNTRY CARDS */}
      {!isLoading &&
        !error &&
        filteredCountries.length > 0 && (
          <div className="country-grid">
            {filteredCountries.map((country) => {
              const isFavorite =
                favorites.includes(
                  country.name.common
                );

              return (
                <div
                  key={country.cca3}
                  className="country-card"
                >
                  <img
                    src={country.flags.png}
                    alt={
                      country.flags.alt ||
                      `${country.name.common} flag`
                    }
                    className="flag-image"
                  />

                  <div className="card-content">
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h2 className="country-name">
                        {country.name.common}
                      </h2>

                      {/* Favorite button */}
                      <button
                        type="button"
                        onClick={() =>
                          toggleFavorite(
                            country.name.common
                          )
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          fontSize: "22px",
                          cursor: "pointer",
                        }}
                        aria-label={
                          isFavorite
                            ? `Remove ${country.name.common} from favorites`
                            : `Add ${country.name.common} to favorites`
                        }
                      >
                        {isFavorite ? "⭐" : "☆"}
                      </button>
                    </div>

                    <div className="country-info">
                      <p>
                        <strong>Capital:</strong>{" "}
                        {country.capital?.[0] ||
                          "N/A"}
                      </p>

                      <p>
                        <strong>Region:</strong>{" "}
                        {country.region || "N/A"}
                      </p>

                      <p>
                        <strong>Population:</strong>{" "}
                        {country.population.toLocaleString()}
                      </p>

                      <p>
                        <strong>Languages:</strong>{" "}
                        {getLanguages(country)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </main>
  );
}