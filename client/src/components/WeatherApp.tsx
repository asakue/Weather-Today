import { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import WeatherDisplay from './WeatherDisplay';
import FavoritesList from './FavoritesList';
import Loading from './Loading';
import { useWeather } from '../hooks/useWeather';
import { useFavorites } from '../hooks/useFavorites';
import { WeatherData } from '../types';

const WeatherApp = () => {
  const [city, setCity] = useState<string>('');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>(
    () => (localStorage.getItem('tempUnit') as 'C' | 'F') || 'C'
  );
  const [showFavorites, setShowFavorites] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { 
    favorites, 
    addToFavorites, 
    removeFromFavorite, 
    isFavorite 
  } = useFavorites();
  
  const { 
    weatherData, 
    hourlyForecast, 
    dailyForecast, 
    loading, 
    fetchWeather 
  } = useWeather(tempUnit);

  useEffect(() => {
    // Load last city from localStorage or use default
    const lastCity = localStorage.getItem('lastCity') || 'Москва';
    setCity(lastCity);
    handleSearch(lastCity);
  }, []);

  useEffect(() => {
    localStorage.setItem('tempUnit', tempUnit);
    if (weatherData) {
      fetchWeather(city);
    }
  }, [tempUnit]);

  const handleSearch = async (searchCity: string) => {
    setError(null);
    if (!searchCity.trim()) return;
    
    try {
      await fetchWeather(searchCity);
      setCity(searchCity);
      localStorage.setItem('lastCity', searchCity);
    } catch (err) {
      setError('Город не найден. Пожалуйста, попробуйте ещё раз.');
      console.error('Error fetching weather:', err);
    }
  };

  const toggleFavorites = () => {
    setShowFavorites(prev => !prev);
  };

  const handleTempUnitChange = () => {
    setTempUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  const handleFavoriteSelect = (selectedCity: string) => {
    handleSearch(selectedCity);
    setShowFavorites(false);
  };

  const toggleFavorite = (city: string, country: string) => {
    const fullName = `${city}, ${country}`;
    if (isFavorite(fullName)) {
      removeFromFavorite(fullName);
    } else {
      addToFavorites(fullName);
    }
  };

  return (
    <main className="glass rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden mx-auto my-4">
      {/* Header with temperature toggle */}
      <header className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 flex items-center">
          <i className="fas fa-cloud-sun text-[#00feba] mr-2"></i>
          WeatherToday 2.0
        </h1>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">°C</span>
          <div className="relative inline-block w-12 align-middle select-none">
            <input 
              type="checkbox" 
              name="toggle" 
              id="temp-toggle" 
              checked={tempUnit === 'F'}
              onChange={handleTempUnitChange}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />
            <label 
              htmlFor="temp-toggle" 
              className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
            </label>
          </div>
          <span className="text-sm text-gray-600">°F</span>
        </div>
      </header>

      {/* Search and Favorites Section */}
      <section className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <SearchBar 
            onSearch={handleSearch} 
            favorites={favorites} 
            onSelectFavorite={handleFavoriteSelect}
          />
          
          <button 
            id="favorites-button" 
            className="h-12 px-4 bg-[#00feba] text-white rounded-full hover:bg-[#00feba]/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00feba]/30 flex items-center justify-center gap-2"
            onClick={toggleFavorites}
          >
            <i className="fas fa-star"></i>
            <span className="hidden sm:inline">Избранное</span>
          </button>
        </div>

        {showFavorites && (
          <FavoritesList 
            favorites={favorites} 
            onSelect={handleFavoriteSelect} 
            onRemove={removeFromFavorite} 
          />
        )}
      </section>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mb-4" role="alert">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Weather Display */}
      {weatherData && !error && (
        <WeatherDisplay 
          weatherData={weatherData} 
          hourlyForecast={hourlyForecast} 
          dailyForecast={dailyForecast}
          tempUnit={tempUnit}
          isFavorite={isFavorite(`${weatherData.city}, ${weatherData.country}`)}
          onToggleFavorite={() => toggleFavorite(weatherData.city, weatherData.country)}
        />
      )}

      {/* Loading Screen */}
      {loading && <Loading />}

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>WeatherToday 2.0 © {new Date().getFullYear()} | Используются данные <a href="https://openweathermap.org/" target="_blank" rel="noopener noreferrer" className="text-[#00feba] hover:underline">OpenWeatherMap</a></p>
      </footer>
    </main>
  );
};

export default WeatherApp;
