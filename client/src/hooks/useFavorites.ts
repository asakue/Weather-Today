import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (city: string) => {
    if (!favorites.includes(city)) {
      setFavorites(prev => [...prev, city]);
    }
  };

  const removeFromFavorite = (city: string) => {
    setFavorites(prev => prev.filter(item => item !== city));
  };

  const isFavorite = (city: string) => {
    return favorites.includes(city);
  };

  return { 
    favorites, 
    addToFavorites, 
    removeFromFavorite, 
    isFavorite 
  };
}
