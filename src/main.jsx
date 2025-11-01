import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');
const root = createRoot(container);

// REMOVE the <React.StrictMode> wrapper.
// This will prevent the double-rendering in development that causes the Firebase SDK to crash.
root.render(
  <App />
);