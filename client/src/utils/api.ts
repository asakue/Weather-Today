import { WeatherData, HourlyForecastItem, DailyForecastItem } from '../types';

const API_KEY = import.meta.env.VITE_API_KEY || "9d7cde1f6d07ec55650544be1631307e";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function fetchWeatherData(city: string, units: 'metric' | 'imperial' = 'metric') {
  const url = `${BASE_URL}/weather?q=${city}&units=${units}&lang=ru&appid=${API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Weather data not found for city: ${city}`);
  }
  
  return response.json();
}

export async function fetchHourlyForecast(city: string, units: 'metric' | 'imperial' = 'metric') {
  const url = `${BASE_URL}/forecast?q=${city}&units=${units}&lang=ru&appid=${API_KEY}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Forecast data not found for city: ${city}`);
  }
  
  return response.json();
}

export function processWeatherData(data: any, tempUnit: 'C' | 'F'): WeatherData {
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  };

  const convertPressure = (hPa: number) => {
    return (hPa * 0.750062).toFixed(1);
  };

  const getWindDirection = (deg: number) => {
    const directions = [
      'Северный', 'Северо-восточный', 'Восточный', 'Юго-восточный', 
      'Южный', 'Юго-западный', 'Западный', 'Северо-западный'
    ];
    return directions[Math.round(deg / 45) % 8];
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get precipitation if available
  const precipitation = data.rain ? 
    data.rain['1h'] || data.rain['3h'] || 0 : 
    data.snow ? 
      data.snow['1h'] || data.snow['3h'] || 0 : 0;

  return {
    city: data.name,
    country: data.sys.country,
    date: formatDate(),
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    description: data.weather[0].description,
    iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
    humidity: data.main.humidity,
    pressure: convertPressure(data.main.pressure),
    windSpeed: data.wind.speed,
    windDirection: getWindDirection(data.wind.deg),
    visibility: (data.visibility / 1000).toFixed(1),
    sunrise: formatTime(data.sys.sunrise),
    sunset: formatTime(data.sys.sunset),
    clouds: data.clouds.all,
    precipitation: precipitation.toFixed(1),
    weatherType: data.weather[0].main.toLowerCase()
  };
}

export function processHourlyForecast(data: any, tempUnit: 'C' | 'F'): HourlyForecastItem[] {
  // Take 24 hours only (8 items, 3 hours each)
  return data.list.slice(0, 8).map((item: any) => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(item.main.temp),
      description: item.weather[0].description,
      iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`
    };
  });
}

export function processDailyForecast(data: any, tempUnit: 'C' | 'F'): DailyForecastItem[] {
  // Create daily forecast from 3-hour forecast by grouping by day
  const dailyMap = new Map();
  
  data.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
    const temp = item.main.temp;
    
    if (!dailyMap.has(day)) {
      dailyMap.set(day, {
        temps: [temp],
        icons: [item.weather[0].icon],
        descriptions: [item.weather[0].description]
      });
    } else {
      const dayData = dailyMap.get(day);
      dayData.temps.push(temp);
      dayData.icons.push(item.weather[0].icon);
      dayData.descriptions.push(item.weather[0].description);
    }
  });
  
  // Convert map to array and sort by date
  return Array.from(dailyMap).map(([date, data]) => {
    const temps = data.temps;
    const minTemp = Math.round(Math.min(...temps));
    const maxTemp = Math.round(Math.max(...temps));
    
    // Find most common icon
    const iconCounts = data.icons.reduce((acc: Record<string, number>, icon: string) => {
      acc[icon] = (acc[icon] || 0) + 1;
      return acc;
    }, {});
    const mostCommonIcon = Object.entries(iconCounts).sort((a, b) => b[1] - a[1])[0][0];
    
    // Find most common description
    const descCounts = data.descriptions.reduce((acc: Record<string, number>, desc: string) => {
      acc[desc] = (acc[desc] || 0) + 1;
      return acc;
    }, {});
    const mostCommonDesc = Object.entries(descCounts).sort((a, b) => b[1] - a[1])[0][0];
    
    return {
      date,
      tempMin: minTemp,
      tempMax: maxTemp,
      description: mostCommonDesc,
      iconUrl: `https://openweathermap.org/img/wn/${mostCommonIcon}@2x.png`
    };
  }).slice(0, 5); // Limit to 5 days
}
