import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@frameworks-drivers/state/store';
import App from './App';
import { Logger } from '@shared/utils/logger';

// Configuración inicial
Logger.info('Iniciando aplicación Posts Manager');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// Manejo de errores globales no capturados
window.addEventListener('unhandledrejection', (event) => {
  Logger.error('Promesa rechazada no manejada', new Error(event.reason));
  event.preventDefault();
});

window.addEventListener('error', (event) => {
  Logger.error('Error global', event.error || new Error(event.message));
}); 