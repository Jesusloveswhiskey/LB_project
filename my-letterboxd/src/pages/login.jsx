import React, { useState } from 'react';
import { login, fetchCsrf } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const nav = useNavigate();

  // Рекомендуем вызвать fetchCsrf() при инициализации приложения (см. ниже),
  // но вызов здесь работает тоже
  const ensureCsrf = async () => {
    try {
      await fetchCsrf();
    } catch (e) {
      // не критично в dev с прокси
      console.warn('CSRF fetch failed', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await ensureCsrf();
      const resp = await login(username, password);
      console.log('Logged in user', resp.data);
      nav('/'); // редирект после логина
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка логина');
    }
  };

  return (
    <div>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Логин</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Войти</button>
        {error && <div style={{ color: 'red' }}>{error}</div>}
      </form>
    </div>
  );
}