import { type ElementType } from "react";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  Haze,
  MoonStar,
  Sun,
} from "lucide-react";

import { type weatherCode } from "~/lib/tomorrowio/weather-codes";

export function WeatherIcon({
  code,
  className,
  night,
}: {
  code: keyof typeof weatherCode | number;
  className?: string;
  night?: boolean;
}) {
  const weatherIcon: { [key: number]: ElementType } = {
    0: night ? CloudMoon : Cloud, // "Unknown"
    1000: night ? MoonStar : Sun, //"Clear"
    1100: night ? CloudMoon : CloudSun, // "Mostly Clear"
    1101: night ? CloudMoon : CloudSun, //  "Partly Cloudy"
    1102: night ? CloudMoon : CloudSun, // "Mostly Cloudy"
    1001: Cloud, // "Cloudy"
    2000: CloudFog, // "Fog"
    2100: night ? CloudFog : Haze, // "Light Fog"
    4000: CloudDrizzle, // "Drizzle"
    4001: CloudRain,
    4200: CloudRain, // "Light Rain"
    4201: CloudRainWind, // "Heavy Rain"
    5000: CloudSnow, // "Snow"
    5001: CloudSnow, // "Flurries"
    5100: CloudSnow, // "Light Snow"
    5101: CloudSnow, // "Heavy Snow"
    6000: CloudHail, // "Freezing Drizzle"
    6001: CloudHail, // "Freezing Rain"
    6200: CloudRain, // "Light Freezing Rain"
    6201: CloudRain, // "Heavy Freezing Rain"
    7000: CloudHail, // "Ice Pellets"
    7101: CloudHail, // "Heavy Ice Pellets"
    7102: CloudHail, // "Light Ice Pellets"
    8000: CloudLightning, // "Thunderstorm"
  };

  const Icon = weatherIcon[code as number];

  if (!Icon) return <Cloud className={className} />;

  return <Icon className={className} />;
}
