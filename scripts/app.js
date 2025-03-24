/**
 * WeatherToday 2.0 - Приложение погоды для GitHub Pages
 */

// Константы и конфигурация
const API_KEY = "9d7cde1f6d07ec55650544be1631307e"; // Заменить на ваш API ключ
const BASE_URL = "https://api.openweathermap.org/data/2.5";
const DEFAULT_CITY = "Москва";

// DOM элементы
const elements = {
  search: {
    input: document.getElementById('search-input'),
    button: document.getElementById('search-button')
  },
  tempToggle: document.getElementById('temp-toggle'),
  error: document.getElementById('error-message'),
  loading: document.getElementById('loading'),
  weatherCard: document.getElementById('weather-card'),
  city: document.getElementById('city-name'),
  country: document.getElementById('country'),
  weatherIcon: document.getElementById('weather-icon'),
  temp: document.getElementById('temp'),
  description: document.getElementById('weather-description'),
  feelsLike: document.getElementById('feels-like'),
  humidity: document.getElementById('humidity'),
  windSpeed: document.getElementById('wind-speed'),
  pressure: document.getElementById('pressure'),
  visibility: document.getElementById('visibility'),
  sunrise: document.getElementById('sunrise'),
  sunset: document.getElementById('sunset'),
  forecastTabs: document.querySelectorAll('.forecast-tab'),
  hourlyForecast: document.getElementById('hourly-forecast'),
  dailyForecast: document.getElementById('daily-forecast'),
  favoriteItems: document.getElementById('favorite-items')
};

// Состояние приложения
const state = {
  city: localStorage.getItem('lastCity') || DEFAULT_CITY,
  tempUnit: localStorage.getItem('tempUnit') === 'F' ? 'F' : 'C',
  favorites: JSON.parse(localStorage.getItem('favorites')) || [],
  weatherData: null,
  hourlyForecast: [],
  dailyForecast: [],
  activeTab: 'hourly'
};

// Утилиты
const utils = {
  formatDate() {
    const date = new Date();
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    });
  },
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  convertPressure(hPa) {
    return (hPa * 0.750062).toFixed(1);
  },
  
  getWindDirection(deg) {
    const directions = [
      'Северный', 'Северо-восточный', 'Восточный', 'Юго-восточный', 
      'Южный', 'Юго-западный', 'Западный', 'Северо-западный'
    ];
    return directions[Math.round(deg / 45) % 8];
  },
  
  formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  },
  
  convertToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
  },
  
  convertToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
  },
  
  getWeatherBackgroundClass(weatherType) {
    const types = {
      'clear': 'weather-clear',
      'clouds': 'weather-clouds',
      'rain': 'weather-rain',
      'drizzle': 'weather-rain',
      'thunderstorm': 'weather-thunderstorm',
      'snow': 'weather-snow',
      'mist': 'weather-mist',
      'fog': 'weather-mist',
      'haze': 'weather-mist'
    };
    
    return types[weatherType.toLowerCase()] || 'weather-clear';
  }
};

// API функции
const api = {
  async fetchWeatherData(city, units = state.tempUnit === 'C' ? 'metric' : 'imperial') {
    const url = `${BASE_URL}/weather?q=${city}&units=${units}&lang=ru&appid=${API_KEY}`;
    
    ui.showLoading(true);
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Город не найден: ${city}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении данных о погоде:', error);
      throw error;
    } finally {
      ui.showLoading(false);
    }
  },
  
  async fetchHourlyForecast(city, units = state.tempUnit === 'C' ? 'metric' : 'imperial') {
    const url = `${BASE_URL}/forecast?q=${city}&units=${units}&lang=ru&appid=${API_KEY}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Не удалось получить прогноз для города: ${city}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ошибка при получении прогноза:', error);
      throw error;
    }
  }
};

// Функции UI
const ui = {
  showLoading(show) {
    elements.loading.style.display = show ? 'flex' : 'none';
  },
  
  showError(show, message = 'Город не найден. Пожалуйста, попробуйте ещё раз.') {
    elements.error.style.display = show ? 'block' : 'none';
    if (show) {
      elements.error.querySelector('p').textContent = message;
    }
  },
  
  updateBackground(weatherType) {
    const className = utils.getWeatherBackgroundClass(weatherType);
    document.body.className = className;
  },
  
  updateWeatherDisplay(data) {
    elements.city.textContent = data.city;
    elements.country.textContent = data.country;
    elements.weatherIcon.src = data.iconUrl;
    elements.temp.textContent = `${data.temp}°${state.tempUnit}`;
    elements.description.textContent = utils.capitalize(data.description);
    elements.feelsLike.textContent = `Ощущается как: ${data.feelsLike}°${state.tempUnit}`;
    elements.humidity.textContent = `${data.humidity}%`;
    elements.windSpeed.textContent = `${data.windSpeed} ${state.tempUnit === 'C' ? 'м/с' : 'миль/ч'}`;
    elements.pressure.textContent = `${data.pressure} мм рт.ст.`;
    elements.visibility.textContent = `${data.visibility} км`;
    elements.sunrise.textContent = data.sunrise;
    elements.sunset.textContent = data.sunset;
    
    this.updateBackground(data.weatherType);
  },
  
  updateHourlyForecast(forecast) {
    elements.hourlyForecast.innerHTML = '';
    
    forecast.forEach(item => {
      const hourlyItem = document.createElement('div');
      hourlyItem.className = 'hourly-item';
      
      hourlyItem.innerHTML = `
        <div class="time">${item.time}</div>
        <img src="${item.iconUrl}" alt="${item.description}" class="forecast-icon">
        <div class="forecast-temp">${item.temp}°${state.tempUnit}</div>
        <div class="forecast-desc">${utils.capitalize(item.description)}</div>
      `;
      
      elements.hourlyForecast.appendChild(hourlyItem);
    });
  },
  
  updateDailyForecast(forecast) {
    elements.dailyForecast.innerHTML = '';
    
    forecast.forEach(item => {
      const dailyItem = document.createElement('div');
      dailyItem.className = 'daily-item';
      
      dailyItem.innerHTML = `
        <div class="date">${item.date}</div>
        <img src="${item.iconUrl}" alt="${item.description}" class="forecast-icon">
        <div class="temp-range">
          <span class="min-temp">${item.tempMin}°</span>
          <span class="max-temp">${item.tempMax}°</span>
        </div>
        <div class="forecast-desc">${utils.capitalize(item.description)}</div>
      `;
      
      elements.dailyForecast.appendChild(dailyItem);
    });
  },
  
  updateFavorites() {
    elements.favoriteItems.innerHTML = '';
    
    if (state.favorites.length === 0) {
      const emptyItem = document.createElement('div');
      emptyItem.textContent = 'Нет избранных городов';
      elements.favoriteItems.appendChild(emptyItem);
      return;
    }
    
    state.favorites.forEach(city => {
      const favoriteItem = document.createElement('div');
      favoriteItem.className = 'favorite-item';
      
      favoriteItem.innerHTML = `
        <span>${city}</span>
        <button class="remove-favorite" data-city="${city}">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      favoriteItem.querySelector('span').addEventListener('click', () => {
        app.fetchWeather(city);
      });
      
      favoriteItem.querySelector('.remove-favorite').addEventListener('click', (e) => {
        e.stopPropagation();
        app.removeFavorite(city);
      });
      
      elements.favoriteItems.appendChild(favoriteItem);
    });
  },
  
  switchTab(tab) {
    state.activeTab = tab;
    
    elements.forecastTabs.forEach(tabElement => {
      tabElement.classList.toggle('active', tabElement.dataset.tab === tab);
    });
    
    elements.hourlyForecast.style.display = tab === 'hourly' ? 'flex' : 'none';
    elements.dailyForecast.style.display = tab === 'daily' ? 'grid' : 'none';
  }
};

// Функции приложения
const app = {
  async init() {
    // Инициализация переключателя единиц измерения
    elements.tempToggle.checked = state.tempUnit === 'F';
    
    // Установка начальных обработчиков событий
    this.setupEventListeners();
    
    // Загрузка последнего города из localStorage или по умолчанию
    await this.fetchWeather(state.city);
    
    // Обновление списка избранных
    ui.updateFavorites();
  },
  
  setupEventListeners() {
    // Поиск города
    elements.search.button.addEventListener('click', () => {
      const city = elements.search.input.value.trim();
      if (city) {
        this.fetchWeather(city);
      }
    });
    
    elements.search.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const city = elements.search.input.value.trim();
        if (city) {
          this.fetchWeather(city);
        }
      }
    });
    
    // Переключение единиц температуры
    elements.tempToggle.addEventListener('change', async () => {
      state.tempUnit = elements.tempToggle.checked ? 'F' : 'C';
      localStorage.setItem('tempUnit', state.tempUnit);
      
      if (state.weatherData) {
        await this.fetchWeather(state.city);
      }
    });
    
    // Переключение вкладок прогноза
    elements.forecastTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        ui.switchTab(tab.dataset.tab);
      });
    });
  },
  
  async fetchWeather(city) {
    ui.showError(false);
    ui.showLoading(true);
    
    try {
      // Получение данных о погоде
      const weatherData = await api.fetchWeatherData(city);
      
      // Обработка данных о погоде
      state.weatherData = this.processWeatherData(weatherData);
      
      // Получение прогноза
      const forecastData = await api.fetchHourlyForecast(city);
      state.hourlyForecast = this.processHourlyForecast(forecastData);
      state.dailyForecast = this.processDailyForecast(forecastData);
      
      // Обновление интерфейса
      ui.updateWeatherDisplay(state.weatherData);
      ui.updateHourlyForecast(state.hourlyForecast);
      ui.updateDailyForecast(state.dailyForecast);
      
      // Сохранение последнего города
      state.city = city;
      localStorage.setItem('lastCity', city);
      
      // Очистка поля ввода
      elements.search.input.value = '';
    } catch (error) {
      ui.showError(true, error.message);
    } finally {
      ui.showLoading(false);
    }
  },
  
  processWeatherData(data) {
    // Получение осадков, если доступны
    const precipitation = data.rain ? 
      data.rain['1h'] || data.rain['3h'] || 0 : 
      data.snow ? 
        data.snow['1h'] || data.snow['3h'] || 0 : 0;
    
    return {
      city: data.name,
      country: data.sys.country,
      date: utils.formatDate(),
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      description: data.weather[0].description,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      humidity: data.main.humidity,
      pressure: utils.convertPressure(data.main.pressure),
      windSpeed: data.wind.speed,
      windDirection: utils.getWindDirection(data.wind.deg),
      visibility: (data.visibility / 1000).toFixed(1),
      sunrise: utils.formatTime(data.sys.sunrise),
      sunset: utils.formatTime(data.sys.sunset),
      clouds: data.clouds.all,
      precipitation: precipitation.toFixed(1),
      weatherType: data.weather[0].main.toLowerCase()
    };
  },
  
  processHourlyForecast(data) {
    // Берем 24 часа (8 элементов по 3 часа)
    return data.list.slice(0, 8).map(item => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png`
      };
    });
  },
  
  processDailyForecast(data) {
    // Создаем ежедневный прогноз из 3-часового прогноза, группируя по дню
    const dailyMap = new Map();
    
    data.list.forEach(item => {
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
    
    // Преобразование карты в массив и сортировка по дате
    return Array.from(dailyMap).map(([date, data]) => {
      const temps = data.temps;
      const minTemp = Math.round(Math.min(...temps));
      const maxTemp = Math.round(Math.max(...temps));
      
      // Находим наиболее частую иконку
      const iconCounts = data.icons.reduce((acc, icon) => {
        acc[icon] = (acc[icon] || 0) + 1;
        return acc;
      }, {});
      
      const mostCommonIcon = Object.entries(iconCounts).sort((a, b) => b[1] - a[1])[0][0];
      
      // Находим наиболее частое описание
      const descCounts = data.descriptions.reduce((acc, desc) => {
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
    }).slice(0, 5); // Ограничиваем 5 днями
  },
  
  toggleFavorite(city) {
    const cityName = `${city}, ${state.weatherData.country}`;
    const isFavorite = state.favorites.includes(cityName);
    
    if (isFavorite) {
      this.removeFavorite(cityName);
    } else {
      this.addFavorite(cityName);
    }
  },
  
  addFavorite(city) {
    if (!state.favorites.includes(city)) {
      state.favorites.push(city);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
      ui.updateFavorites();
    }
  },
  
  removeFavorite(city) {
    state.favorites = state.favorites.filter(item => item !== city);
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    ui.updateFavorites();
  }
};

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});