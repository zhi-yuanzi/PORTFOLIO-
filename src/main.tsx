import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionProvider } from './motion-preference';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MotionProvider><App /></MotionProvider>
  </React.StrictMode>,
);

