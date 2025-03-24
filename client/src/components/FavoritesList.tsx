interface FavoritesListProps {
  favorites: string[];
  onSelect: (city: string) => void;
  onRemove: (city: string) => void;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onSelect, onRemove }) => {
  return (
    <div id="favorites-container" className="mt-4 animate-fade-in">
      <h2 className="text-lg font-medium text-gray-700 mb-2">Избранные города</h2>
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {favorites.length > 0 ? (
          favorites.map((city, index) => (
            <div 
              key={index}
              className="flex-shrink-0 glass-dark text-white rounded-full px-3 py-1 flex items-center gap-1"
            >
              <span 
                className="text-sm cursor-pointer"
                onClick={() => onSelect(city)}
              >
                {city}
              </span>
              <button 
                onClick={() => onRemove(city)} 
                className="text-xs text-white/70 hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">
            У вас пока нет избранных городов. Добавьте город, нажав на звездочку.
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
