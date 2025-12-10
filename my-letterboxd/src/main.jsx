import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import React, { useEffect } from 'react';
import { getCurrentUser, fetchCsrf } from './api/auth';

useEffect(() => {
  // получить csrf cookie (на случай, если её нет)
  fetchCsrf().catch(()=>{});
  // попытаться получить текущего пользователя
  getCurrentUser()
    .then(resp => {
      // положить в state/context
      console.log('current user', resp.data);
    })
    .catch(() => {
      // не залогинен — ок
    });
}, []);