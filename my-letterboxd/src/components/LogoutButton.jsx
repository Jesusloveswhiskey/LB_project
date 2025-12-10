import React from 'react';
import { logout } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LogoutButton() {
  const nav = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      nav('/login');
    } catch (e) {
      console.error(e);
    }
  };
  return <button onClick={handleLogout}>Выйти</button>;
}
