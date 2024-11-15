/*Muestra el listado de comics obtenidos desde la API de Marvel, 
con opciones para agregar a favoritos y ver mas detalles de cada comic.*/

import React, { useState, useEffect } from 'react';
import { getComics } from '../utils/marvelService';
import ComicDetails from './ComicDetails';

const ComicList = () => {
  const [comics, setComics] = useState([]); // Estado para almacenar los comics
  const [selectedComic, setSelectedComic] = useState(null); // Estado para el comic seleccionado
  const [favorites, setFavorites] = useState([]); // Estado para los comics favoritos
  const [showFavorites, setShowFavorites] = useState(false); // Estado para controlar si mostrar solo favoritos

  useEffect(() => {
    // Funcion para obtener los comics de la API y cargar los favoritos desde LocalStorage
    const fetchComics = async () => {
      try {
        const comicsData = await getComics();
        setComics(comicsData);
      } catch (error) {
        console.error("Error fetching comics:", error);
      }
    };

    fetchComics();
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites); // Cargar favoritos desde LocalStorage
  }, []);

  const handleComicClick = (comicId) => {
    const comic = comics.find((comic) => comic.id === comicId);
    setSelectedComic(comic);
  };

  const handleAddToFavorites = (comic) => {
    const updatedFavorites = [...favorites, comic];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleRemoveFromFavorites = (comicId) => {
    const updatedFavorites = favorites.filter((comic) => comic.id !== comicId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const toggleFavorites = () => {
    setShowFavorites(!showFavorites); // Alterna entre mostrar todos los comics y solo los favoritos
  };

  const filteredComics = showFavorites
    ? comics.filter((comic) => favorites.some((fav) => fav.id === comic.id))
    : comics;

  return (
    <div>
      <button onClick={toggleFavorites}>
        {showFavorites ? 'Ver todos los comics' : 'Ver solo favoritos'}
      </button>
      <div className="comic-list">
        {filteredComics.map((comic) => (
          <div key={comic.id} className="comic-item" onClick={() => handleComicClick(comic.id)}>
            <img src={comic.thumbnail} alt={comic.title} />
            <h3>{comic.title}</h3>
            {favorites.some((fav) => fav.id === comic.id) ? (
              <button onClick={() => handleRemoveFromFavorites(comic.id)}>Quitar de favoritos</button>
            ) : (
              <button onClick={() => handleAddToFavorites(comic)}>Añadir a favoritos</button>
            )}
          </div>
        ))}
      </div>

      {selectedComic && <ComicDetails comic={selectedComic} />}
    </div>
  );
};

export default ComicList;
