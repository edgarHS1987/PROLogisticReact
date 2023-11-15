import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import 'rsuite/dist/rsuite.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/app.css';

import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
