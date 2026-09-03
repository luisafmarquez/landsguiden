import { NextResponse } from "next/server";

// Server-side Route Handler that fetches from the public jsDelivr REST Countries endpoint
export async function GET() {
  try {
    const response = await fetch(
      "https://cdn.jsdelivr.net/gh/restcountries/restcountries@master/src/main/resources/countriesV3.1.json",
      { next: { revalidate: 86400 } }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch country data: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Could not load countries data." },
      { status: 500 }
    );
  }
}
