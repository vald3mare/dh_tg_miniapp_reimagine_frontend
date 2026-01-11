import React, { useContext, useState } from 'react';
import { UserContext } from './UserContext';

const API_URL = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net';

const Profile = () => {
  const { initData, isAuthenticated } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPayment = async () => {
    if (!initData) {
      alert('Нет initData');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `tma ${initData}`,
        },
        body: JSON.stringify({
          amount: 1.00,
          description: 'Тестовый платёж из MiniApp',
        }),
      });

      if (!res.ok) {
        throw new Error(`Ошибка сервера: ${res.status}`);
      }

      const data = await res.json();

      if (!data.confirmation_url) {
        throw new Error('Нет confirmation_url');
      }

      // Открываем страницу оплаты
      window.location.href = data.confirmation_url;
    } catch (err) {
      console.error(err);
      setError(err.message);
      alert('Ошибка создания платежа: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <p>Пользователь не авторизован</p>;
  }

  return (
    <div>
      <h1>Профиль</h1>

      <button onClick={createPayment} disabled={loading}>
        {loading ? 'Создаём платёж...' : 'Создать платёж'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Profile;
