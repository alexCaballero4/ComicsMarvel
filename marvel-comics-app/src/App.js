/*Gestiona la logica principal de la aplicacion, incluyendo el enrutamiento, 
el renderizado de la interfaz de usuario y la integracion con los componentes de Marvel*/

import React from 'react';
import ComicList from './components/ComicList';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <h1>Marvel Comics</h1>
      <ComicList /> {/* Componente que lista y muestra los comics */}
    </div>
  );
};

export default App;
