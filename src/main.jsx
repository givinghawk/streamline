import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { SettingsProvider } from './contexts/SettingsContext';
import { ErrorProvider } from './contexts/ErrorContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorProvider>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </ErrorProvider>
  </React.StrictMode>
);
