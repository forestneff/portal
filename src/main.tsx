import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './assets/styles/tokens.css';
import './assets/styles/base.css';
import './assets/styles/animations.css';
import './assets/styles/components.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
