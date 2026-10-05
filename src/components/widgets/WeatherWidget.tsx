"use client";
import { useEffect, useState } from "react";
interface Weather { temperature: number; description: string; }
export default function WeatherWidget({ destination, load }: { destination: string; load?: (destination: string) => Promise<Weather> }) {
  const [weather, setWeather] = useState<Weather>(); const [error, setError] = useState<string>();
  useEffect(() => { let active = true; if (!load) return; load(destination).then((value) => active && setWeather(value)).catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Unable to load weather")); return () => { active = false; }; }, [destination, load]);
  return <section><h2>{destination} weather</h2>{error ? <p role="alert">{error}</p> : weather ? <p>{weather.temperature}° · {weather.description}</p> : <p>Weather data unavailable</p>}</section>;
}
