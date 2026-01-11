import React, { useContext } from 'react';
import { UserContext } from './UserContext';

const Profile = () => {
  const { isLoading, isAuthenticated } = useContext(UserContext);

  if (isLoading) {
    return <p>Загрузка...</p>;
  }

  if (!isAuthenticated) {
    return <p>Пользователь не авторизован</p>;
  }

  return (
    <div>
      <h1>Профиль</h1>
      <button>Создать платёж</button>
    </div>
  );
};

export default Profile;
