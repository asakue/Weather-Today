import { useState } from 'react';
import ForecastTabs from './ForecastTabs';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import { WeatherData, HourlyForecastItem, DailyForecastItem } from '../types';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  hourlyForecast: HourlyForecastItem[];
  dailyForecast: DailyForecastItem[];
  tempUnit: 'C' | 'F';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weatherData, 
  hourlyForecast, 
  dailyForecast,
  tempUnit,
  isFavorite,
  onToggleFavorite
}) => {
  const [activeTab, setActiveTab] = useState<'hourly' | 'daily'>('hourly');

  return (
    <div className="weather-body p-4 sm:p-6" role="main" aria-live="polite">
      {/* Current Weather Section */}
      <section className="mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* City and Current Weather */}
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-800" id="city">
                {weatherData.city}, {weatherData.country}
              </h1>
              {/* Favorite Toggle Button */}
              <button 
                className="text-xl text-gray-400 hover:text-yellow-400 transition-colors"
                aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                onClick={onToggleFavorite}
              >
                <i className={isFavorite ? "fas fa-star text-yellow-400" : "far fa-star"}></i>
              </button>
            </div>
            <div className="text-gray-600" id="date">{weatherData.date}</div>
            
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center">
                <img 
                  id="weather-icon" 
                  alt="Иконка погоды" 
                  src={weatherData.iconUrl} 
                  width="80" 
                  height="80"
                />
                <div className="text-5xl font-semibold text-gray-800" id="temp">
                  {weatherData.temp}°{tempUnit}
                </div>
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <div className="text-xl text-gray-600 capitalize" id="weather">
                  {weatherData.description}
                </div>
                <div className="text-sm text-gray-500" id="min-max">
                  {weatherData.tempMin}°{tempUnit} (мин) / {weatherData.tempMax}°{tempUnit} (макс)
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Ощущается как: {weatherData.feelsLike}°{tempUnit}
                </div>
              </div>
            </div>
          </div>
          
          {/* Add to favorites prompt for mobile */}
          <div className="md:hidden text-center text-sm text-gray-500 italic">
            Нажмите на звездочку рядом с названием города, чтобы добавить его в избранное
          </div>
        </div>
      </section>

      {/* Weather Details Grid */}
      <section className="mb-6">
        <h2 className="text-xl font-medium text-gray-700 mb-4">Детали погоды</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#ebfffc]/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <i className="fas fa-tint text-xl text-[#00feba]"></i>
              <h3 className="ml-2 text-sm text-gray-600">Влажность</h3>
            </div>
            <p className="text-xl font-medium text-gray-800" id="humidity">{weatherData.humidity}%</p>
          </div>
          
          <div className="bg-[#ebfffc]/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <i className="fas fa-wind text-xl text-[#00feba]"></i>
              <h3 className="ml-2 text-sm text-gray-600">Ветер</h3>
            </div>
            <p className="text-xl font-medium text-gray-800" id="wind-speed">{weatherData.windSpeed} м/с</p>
            <p className="text-xs text-gray-500">{weatherData.windDirection}</p>
          </div>
          
          <div className="bg-[#ebfffc]/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <i className="fas fa-compress-arrows-alt text-xl text-[#00feba]"></i>
              <h3 className="ml-2 text-sm text-gray-600">Давление</h3>
            </div>
            <p className="text-xl font-medium text-gray-800" id="pressure">{weatherData.pressure} мм рт.ст.</p>
          </div>
          
          <div className="bg-[#ebfffc]/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <i className="fas fa-eye text-xl text-[#00feba]"></i>
              <h3 className="ml-2 text-sm text-gray-600">Видимость</h3>
            </div>
            <p className="text-xl font-medium text-gray-800">{weatherData.visibility} км</p>
          </div>
          
          <div className="bg-[#ebfffc]/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <i className="fas fa-sun text-xl text-[#00feba]"></i>
              <h3 className="ml-2 text-sm text-gray-600">Восход</h3>
            </div>
            <p className="text-xl font-medium text-gray-800">{weatherData.sunrise}</p>
          </div>
          
          <div className="bg-[#ebfffc]/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <i className="fas fa-moon text-xl text-[#00feba]"></i>
              <h3 className="ml-2 text-sm text-gray-600">Закат</h3>
            </div>
            <p className="text-xl font-medium text-gray-800">{weatherData.sunset}</p>
          </div>
          
          <div className="bg-[#ebfffc]/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <i className="fas fa-umbrella text-xl text-[#00feba]"></i>
              <h3 className="ml-2 text-sm text-gray-600">Осадки</h3>
            </div>
            <p className="text-xl font-medium text-gray-800">{weatherData.precipitation} мм</p>
          </div>
          
          <div className="bg-[#ebfffc]/50 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <i className="fas fa-cloud text-xl text-[#00feba]"></i>
              <h3 className="ml-2 text-sm text-gray-600">Облачность</h3>
            </div>
            <p className="text-xl font-medium text-gray-800">{weatherData.clouds}%</p>
          </div>
        </div>
      </section>
      
      {/* Forecast Tabs Section */}
      <section>
        <ForecastTabs 
          activeTab={activeTab} 
          onTabChange={(tab) => setActiveTab(tab)} 
        />

        {activeTab === 'hourly' ? (
          <HourlyForecast forecast={hourlyForecast} tempUnit={tempUnit} />
        ) : (
          <DailyForecast forecast={dailyForecast} tempUnit={tempUnit} />
        )}
      </section>
    </div>
  );
};

export default WeatherDisplay;
