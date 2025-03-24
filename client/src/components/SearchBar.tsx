import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  favorites: string[];
  onSelectFavorite: (city: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, favorites, onSelectFavorite }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Filter locations based on search input
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredLocations(favorites);
    } else {
      const filtered = favorites.filter(city => 
        city.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredLocations(filtered);
    }
  }, [searchValue, favorites]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && 
          !autocompleteRef.current.contains(event.target as Node) &&
          inputRef.current && 
          !inputRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleInputFocus = () => {
    setShowAutocomplete(true);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      onSearch(searchValue);
      setShowAutocomplete(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectLocation = (location: string) => {
    setSearchValue(location);
    onSelectFavorite(location);
    setShowAutocomplete(false);
  };

  return (
    <div className="relative flex-1">
      <div className="flex">
        <input 
          ref={inputRef}
          type="text" 
          id="input-box" 
          placeholder="Введите название города..." 
          autocomplete="off"
          aria-label="Поиск города"
          className="w-full h-12 px-4 py-2 bg-[#ebfffc] text-gray-700 rounded-l-full focus:outline-none focus:ring-2 focus:ring-[#00feba]/30"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyPress={handleKeyPress}
        />
        <button 
          id="search-button" 
          aria-label="Поиск"
          className="h-12 w-12 flex items-center justify-center bg-[#ebfffc] hover:bg-[#00feba] hover:text-white transition-colors duration-300 rounded-r-full focus:outline-none focus:ring-2 focus:ring-[#00feba]/30"
          onClick={handleSearch}
        >
          <i className="fas fa-search"></i>
        </button>
      </div>
      
      {/* Autocomplete dropdown */}
      {showAutocomplete && (
        <div 
          ref={autocompleteRef}
          id="search-autocomplete" 
          className="absolute w-full mt-1 glass rounded-lg shadow-lg z-10 animate-fade-in max-h-60 overflow-y-auto custom-scrollbar"
        >
          <ul className="py-1">
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location, index) => (
                <li 
                  key={index} 
                  className="px-4 py-2 hover:bg-[#00feba]/10 cursor-pointer flex justify-between items-center"
                  onClick={() => handleSelectLocation(location)}
                >
                  <span>{location}</span>
                  <i className="fas fa-star text-yellow-400"></i>
                </li>
              ))
            ) : (
              searchValue.trim() ? (
                <li className="px-4 py-2 text-gray-500 italic">Нет совпадений</li>
              ) : (
                <li className="px-4 py-2 text-gray-500 italic">Начните вводить название города</li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
