/*Contiene las funciones que gestionan las solicitudes a la API de Marvel para obtener 
informacion sobre comics, personajes y otros datos relacionados.*/


import { generateAuthParams } from './auth';

// Obtiene la lista de comics ordenados por la fecha de modificacion
export const getComics = async () => {
  const { ts, publicKey, hash } = generateAuthParams();

  const response = await fetch(`https://gateway.marvel.com/v1/public/comics?orderBy=-modified&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener los comics');
  }

  const data = await response.json();

  return data.data.results.map(comic => ({
    id: comic.id,
    title: comic.title,
    thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
    characters: comic.characters.items.map(character => ({
      name: character.name,
      resourceURI: character.resourceURI
    }))
  }));
};

// Obtiene los detalles completos de un comic, incluyendo imagenes de personajes
export const getComicDetails = async (comicId) => {
  const { ts, publicKey, hash } = generateAuthParams();

  const response = await fetch(`https://gateway.marvel.com/v1/public/comics/${comicId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);

  if (!response.ok) {
    throw new Error('Error al obtener los detalles del comic');
  }

  const data = await response.json();
  const comic = data.data.results[0];

  const characterDetails = await Promise.all(
    comic.characters.items.map(async character => {
      const characterId = character.resourceURI.split('/').pop();
      const characterResponse = await fetch(`https://gateway.marvel.com/v1/public/characters/${characterId}?ts=${ts}&apikey=${publicKey}&hash=${hash}`);
      
      if (characterResponse.ok) {
        const characterData = await characterResponse.json();
        const characterInfo = characterData.data.results[0];
        return {
          id: characterInfo.id,
          name: characterInfo.name,
          thumbnail: `${characterInfo.thumbnail.path}.${characterInfo.thumbnail.extension}`
        };
      }
      return null;
    })
  );

  return {
    id: comic.id,
    title: comic.title,
    thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
    characters: characterDetails.filter(Boolean)
  };
};
