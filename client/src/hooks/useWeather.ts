import { useState, useEffect } from 'react';
import { 
  fetchWeatherData, 
  fetchHourlyForecast,
  processWeatherData,
  processHourlyForecast,
  processDailyForecast
} from '../utils/api';
import { WeatherData, HourlyForecastItem, DailyForecastItem } from '../types';
import { convertToCelsius, convertToFahrenheit, getWeatherBackgroundClass } from '../utils/helpers';

export function useWeather(tempUnit: 'C' | 'F') {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecastItem[]>([]);
  const [dailyForecast, setDailyForecast] = useState<DailyForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Apply weather-specific background
  useEffect(() => {
    if (weatherData) {
      document.body.className = getWeatherBackgroundClass(weatherData.weatherType);
    }
  }, [weatherData]);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      const units = tempUnit === 'C' ? 'metric' : 'imperial';
      
      // Fetch current weather
      const weatherResponse = await fetchWeatherData(city, units);
      const processedWeather = processWeatherData(weatherResponse, tempUnit);
      setWeatherData(processedWeather);
      
      // Fetch forecast data
      const forecastResponse = await fetchHourlyForecast(city, units);
      const hourly = processHourlyForecast(forecastResponse, tempUnit);
      const daily = processDailyForecast(forecastResponse, tempUnit);
      
      setHourlyForecast(hourly);
      setDailyForecast(daily);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    weatherData,
    hourlyForecast,
    dailyForecast,
    loading,
    fetchWeather
  };
}
