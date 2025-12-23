import { tool } from "ai";
import { z } from "zod";

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

interface WeatherResponse {
  condition: string;
  temperature: string;
  precipitationChance: string;
}

async function getWeatherData(
  location: string,
  date?: string
): Promise<WeatherResponse> {
  if (!OPENWEATHERMAP_API_KEY) {
    throw new Error("OpenWeatherMap API key is not configured");
  }

  const isToday = !date || date.toLowerCase().includes("today");
  const isTomorrow = date?.toLowerCase().includes("tomorrow");

  try {
    let url: string;
    let data: any;

    if (isToday) {
      // Current weather API
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      data = await response.json();
    } else if (isTomorrow) {
      // Forecast API for tomorrow
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
        location
      )}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&cnt=8`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      const forecastData = await response.json();
      // Get forecast for tomorrow (approximately 24 hours from now)
      data = forecastData.list?.[0] || forecastData.list?.[1];
      if (!data) {
        throw new Error("No forecast data available");
      }
    } else {
      // For other dates, use current weather as fallback
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`);
      }
      data = await response.json();
    }

    const condition = data.weather?.[0]?.main || "Unknown";
    const description = data.weather?.[0]?.description || "";
    const temp = Math.round(data.main?.temp || 0);
    const precipitationChance =
      data.rain?.["3h"] || data.snow?.["3h"] || data.pop || 0;

    return {
      condition: `${condition} (${description})`,
      temperature: `${temp}°C`,
      precipitationChance: `${Math.round(precipitationChance * 100)}%`,
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw new Error(
      `Failed to fetch weather data for ${location}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export const weatherTool = tool({
  description:
    "Get current weather conditions for a location. Use this when the user mentions 'today', 'tomorrow', or asks about weather. Location should be a city name (e.g., 'Nairobi', 'Mombasa').",
  inputSchema: z.object({
    location: z
      .string()
      .describe("The city or location name (e.g., 'Nairobi', 'Mombasa')"),
    date: z
      .string()
      .optional()
      .describe("The date to check weather for (e.g., 'today', 'tomorrow')"),
  }),
  execute: async ({ location, date }: { location: string; date?: string }) => {
    try {
      const weatherData = await getWeatherData(location, date);
      return {
        success: true,
        condition: weatherData.condition,
        temperature: weatherData.temperature,
        precipitationChance: weatherData.precipitationChance,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  },
});
