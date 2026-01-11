import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

const API_URL = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net';

const Profile = () => {
  const { user, initData, isLoading, isAuthenticated, refreshUser } = useContext(UserContext);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const createPayment = async () => {
    if (!initData) return alert('InitData недоступна');

    setLoadingPayment(true);

    try {
      const res = await fetch(`${API_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `tma ${initData}`, // ⚡️ валидированная initData
        },
        body: JSON.stringify({
          amount: 1.0,
          description: 'Тестовый платёж из MiniApp',
        }),
      });

      if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);

      const data = await res.json();

      if (!data.confirmation_url) throw new Error('Не получена confirmation_url');

      // Открываем YooKassa checkout
      window.location.href = data.confirmation_url;
    } catch (err) {
      alert('Ошибка создания платежа: ' + err.message);
      console.error(err);
    } finally {
      setLoadingPayment(false);
    }
  };

  if (isLoading) return <p>Загрузка данных пользователя...</p>;

  if (!isAuthenticated) return <p>Пользователь не авторизован</p>;

  return (
    <div>
      <h1>Профиль</h1>
      <p>Привет, {user.first_name || user.username}</p>
      <button onClick={createPayment} disabled={loadingPayment}>
        {loadingPayment ? 'Создаём платёж...' : 'Создать платёж'}
      </button>
      <button onClick={refreshUser} style={{ marginLeft: 10 }}>
        Обновить данные
      </button>
    </div>
  );
};

export default Profile;
