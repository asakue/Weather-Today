export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function convertToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9/5) + 32);
}

export function convertToCelsius(fahrenheit: number): number {
  return Math.round((fahrenheit - 32) * 5/9);
}

export function convertWindSpeed(speedInMetersPerSecond: number, toImperial: boolean): number {
  if (toImperial) {
    // Convert m/s to mph
    return Number((speedInMetersPerSecond * 2.237).toFixed(1));
  }
  return speedInMetersPerSecond;
}

export function formatDateForDisplay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric'
  });
}

export function formatTimeForDisplay(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function getWeatherBackgroundClass(weatherType: string): string {
  switch (weatherType.toLowerCase()) {
    case 'clear':
      return 'weather-clear';
    case 'clouds':
      return 'weather-clouds';
    case 'rain':
    case 'drizzle':
      return 'weather-rain';
    case 'snow':
      return 'weather-snow';
    case 'thunderstorm':
      return 'weather-thunderstorm';
    case 'mist':
    case 'fog':
    case 'haze':
      return 'weather-mist';
    default:
      return 'weather-clear';
  }
}

export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}
