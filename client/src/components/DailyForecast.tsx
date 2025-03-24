import { DailyForecastItem } from '../types';

interface DailyForecastProps {
  forecast: DailyForecastItem[];
  tempUnit: 'C' | 'F';
}

const DailyForecast: React.FC<DailyForecastProps> = ({ forecast, tempUnit }) => {
  return (
    <div id="daily-forecast" className="py-4" role="tabpanel">
      <div className="space-y-3">
        {forecast.map((day, index) => (
          <div 
            key={index}
            className="bg-[#ebfffc]/30 rounded-lg p-4 flex justify-between items-center hover:bg-[#ebfffc]/50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <img 
                  src={day.iconUrl} 
                  alt="Иконка погоды" 
                  className="w-12 h-12"
                />
              </div>
              <div>
                <div className="font-medium text-gray-700">{day.date}</div>
                <div className="text-sm text-gray-500">{day.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-medium text-gray-800">{day.tempMax}°{tempUnit}</div>
              <div className="text-sm text-gray-500">{day.tempMin}°{tempUnit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
