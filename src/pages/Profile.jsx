// src/pages/Profile.jsx
import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import BottomNav from '../components/NavBar';

const Profile = () => {
  const { user, isLoading, error, refreshUser, debugLogs } = useContext(UserContext);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isCancelingSubscription, setIsCancelingSubscription] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.start_param === 'payment_success') {
      alert("✅ Оплата прошла успешно! Обновляю профиль...");
      refreshUser();
    }
  }, [refreshUser]);

  if (isLoading) return <div>Загрузка профиля...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!user) return <div>Не удалось авторизоваться</div>;

  const handleBuyPremium = async () => {
    setIsPaymentLoading(true);
    try {
      const response = await fetch(
        'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/payment/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'tma ' + (window.Telegram?.WebApp?.initData || ''),
          },
          body: JSON.stringify({
            amount: 1,
            description: 'Подписка Premium на 1 месяц'
          })
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Ответ от сервера:', data);

      if (data.confirmation_url) {
        // Открываем ссылку на оплату в ЮKassa
        window.Telegram?.WebApp?.openLink(data.confirmation_url);
      } else {
        alert('❌ Ошибка: не получена ссылка на оплату');
      }
    } catch (err) {
      console.error('Ошибка оплаты:', err);
      alert('❌ Ошибка при создании платежа: ' + err.message);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Вы уверены? Подписка будет отменена.')) {
      return;
    }

    setIsCancelingSubscription(true);
    try {
      const response = await fetch(
        'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/subscription/cancel',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'tma ' + (window.Telegram?.WebApp?.initData || ''),
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Подписка отменена:', data);
      alert('✅ Подписка отменена');
      refreshUser();
    } catch (err) {
      console.error('Ошибка отмены подписки:', err);
      alert('❌ Ошибка при отмене подписки: ' + err.message);
    } finally {
      setIsCancelingSubscription(false);
    }
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '100px' }}>
      <h1>👤 Профиль</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p><strong>Имя:</strong> {user.first_name} {user.last_name || ''}</p>
        <p><strong>Тег:</strong> @{user.username || 'нет'}</p>
        <p><strong>ID Telegram:</strong> {user.id}</p>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <p style={{ marginBottom: '10px' }}>
          <strong>Статус подписки:</strong>
        </p>
        {user.subscription?.active ? (
          <div>
            <p style={{ color: 'green', fontSize: '16px', fontWeight: 'bold' }}>✅ Премиум</p>
            <p>Действительна до: {new Date(user.subscription.end_date).toLocaleDateString('ru-RU')}</p>
          </div>
        ) : (
          <p style={{ color: '#999' }}>Бесплатный аккаунт</p>
        )}
      </div>

      {!user.subscription?.active && (
        <button
          onClick={handleBuyPremium}
          disabled={isPaymentLoading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: isPaymentLoading ? '#ccc' : '#0088cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isPaymentLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => !isPaymentLoading && (e.target.style.backgroundColor = '#0066aa')}
          onMouseOut={(e) => !isPaymentLoading && (e.target.style.backgroundColor = '#0088cc')}
        >
          {isPaymentLoading ? '⏳ Загрузка...' : '💳 Купить Премиум (1 ₽)'}
        </button>
      )}

      {user.subscription?.active && (
        <button
          onClick={handleCancelSubscription}
          disabled={isCancelingSubscription}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: isCancelingSubscription ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isCancelingSubscription ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s',
            marginTop: '10px'
          }}
          onMouseOver={(e) => !isCancelingSubscription && (e.target.style.backgroundColor = '#bb2d3b')}
          onMouseOut={(e) => !isCancelingSubscription && (e.target.style.backgroundColor = '#dc3545')}
        >
          {isCancelingSubscription ? '⏳ Отмена...' : '❌ Отменить подписку'}
        </button>
      )}

      {/* DEBUG LOGS */}
      {debugLogs.length > 0 && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'monospace',
          maxHeight: '150px',
          overflowY: 'auto',
          color: '#333'
        }}>
          <strong>🔍 Debug logs:</strong>
          {debugLogs.map((log, i) => (
            <div key={i} style={{ marginTop: '4px' }}>{log}</div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Profile;