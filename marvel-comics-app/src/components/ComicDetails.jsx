/*Muestra los detalles completos de un comic seleccionado, incluyendo su imagen, descripcion 
y los personajes asociados con ese comic.*/

import React, { useState, useEffect } from 'react';
import { getComicDetails } from '../utils/marvelService';

const ComicDetails = ({ comic }) => {
  const [comicDetails, setComicDetails] = useState(null); // Estado para los detalles del comic

  useEffect(() => {
    // Obtiene los detalles del comic seleccionado
    const fetchComicDetails = async () => {
      try {
        const details = await getComicDetails(comic.id);
        setComicDetails(details);
      } catch (error) {
        console.error("Error fetching comic details:", error);
      }
    };

    fetchComicDetails();
  }, [comic]);

  if (!comicDetails) {
    return <p>Cargando detalles del comic...</p>;
  }

  return (
    <div>
      <h2>{comicDetails.title}</h2>
      <img src={comicDetails.thumbnail} alt={comicDetails.title} />

      <h3>Personajes en este comic</h3>
      <div className="characters">
        {comicDetails.characters.map(character => (
          <div key={character.id} className="character-item">
            <img src={character.thumbnail} alt={character.name} />
            <h4>{character.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComicDetails;
