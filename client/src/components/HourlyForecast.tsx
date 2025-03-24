import { HourlyForecastItem } from '../types';

interface HourlyForecastProps {
  forecast: HourlyForecastItem[];
  tempUnit: 'C' | 'F';
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ forecast, tempUnit }) => {
  return (
    <div id="hourly-forecast" className="py-4" role="tabpanel">
      <div className="overflow-x-auto custom-scrollbar">
        <div className="flex space-x-4 py-2 min-w-max">
          {forecast.map((hour, index) => (
            <div 
              key={index}
              className="flex flex-col items-center bg-[#ebfffc]/30 rounded-lg p-3 min-w-[80px] hover:bg-[#ebfffc]/50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {index === 0 ? 'Сейчас' : hour.time}
              </span>
              <img 
                src={hour.iconUrl} 
                alt="Иконка погоды" 
                className="w-10 h-10 my-1"
              />
              <span className="text-lg font-medium text-gray-800">{hour.temp}°{tempUnit}</span>
              <span className="text-xs text-gray-500">{hour.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
