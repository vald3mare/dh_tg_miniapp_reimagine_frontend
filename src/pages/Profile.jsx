// src/pages/Profile.jsx
import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import BottomNav from '../components/NavBar';

const Profile = () => {
  const { user, isLoading, error } = useContext(UserContext);

  if (isLoading) return <div>Загрузка профиля...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!user) return <div>Не удалось авторизоваться</div>;

  return (
    <div>
      <h1>Профиль</h1>
      <p>Имя: {user.first_name} {user.last_name || ''}</p>
      <p>Тег: @{user.username || 'нет'}</p>
      <p>ID: {user.id}</p>
      {/* ... другие данные */}

      <BottomNav />
    </div>
  );
};

export default Profile;