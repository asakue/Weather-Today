export interface WeatherData {
  city: string;
  country: string;
  date: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  description: string;
  iconUrl: string;
  humidity: number;
  pressure: string;
  windSpeed: number;
  windDirection: string;
  visibility: string;
  sunrise: string;
  sunset: string;
  clouds: number;
  precipitation: string;
  weatherType: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  description: string;
  iconUrl: string;
}

export interface DailyForecastItem {
  date: string;
  tempMin: number;
  tempMax: number;
  description: string;
  iconUrl: string;
}
