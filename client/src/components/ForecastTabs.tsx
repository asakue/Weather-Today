interface ForecastTabsProps {
  activeTab: 'hourly' | 'daily';
  onTabChange: (tab: 'hourly' | 'daily') => void;
}

const ForecastTabs: React.FC<ForecastTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200">
      <ul className="flex -mb-px" role="tablist">
        <li className="mr-2" role="presentation">
          <button 
            className={`inline-block py-2 px-4 font-medium text-sm ${
              activeTab === 'hourly' 
                ? 'text-[#00feba] border-b-2 border-[#00feba]' 
                : 'text-gray-500 hover:text-gray-600'
            }`}
            role="tab" 
            aria-selected={activeTab === 'hourly'}
            onClick={() => onTabChange('hourly')}
          >
            Почасовой прогноз
          </button>
        </li>
        <li className="mr-2" role="presentation">
          <button 
            className={`inline-block py-2 px-4 font-medium text-sm ${
              activeTab === 'daily' 
                ? 'text-[#00feba] border-b-2 border-[#00feba]' 
                : 'text-gray-500 hover:text-gray-600'
            }`}
            role="tab" 
            aria-selected={activeTab === 'daily'}
            onClick={() => onTabChange('daily')}
          >
            Прогноз на 5 дней
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ForecastTabs;
