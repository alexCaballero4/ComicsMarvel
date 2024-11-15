/*Maneja la autenticacion y autorizacion de los usuarios en la aplicacion, 
garantizando que solo los usuarios validos puedan acceder a ciertas funcionalidades*/

import md5 from 'crypto-js/md5';

// Claves publicas y privadas necesarias para autenticar las solicitudes de la API de Marvel.
const publicKey = '87be004e20e25847caabec26908d2b50';
const privateKey = '575ed5e0e29274dc31a9c42e8954a557bbe29247';

// Funcion para generar los parametros de autenticacion para las peticiones a la API
export const generateAuthParams = () => {
  const ts = new Date().getTime().toString(); // Timestamp unico
  const hash = md5(ts + privateKey + publicKey).toString(); // Hash MD5 para seguridad

  return { ts, publicKey, hash }; // Devuelve los parametros necesarios para la autenticacion
};
