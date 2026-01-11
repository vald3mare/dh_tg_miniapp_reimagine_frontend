import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../context/UserContext';
import BottomNav from '../components/NavBar';

const Profile = () => {
  const { user, isLoading, error, refreshUser } = useContext(UserContext);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [isCancelingSubscription, setIsCancelingSubscription] = useState(false);

  useEffect(() => {
    const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
    if (startParam === 'payment_success') {
      alert('✅ Оплата успешна! Профиль обновлен');
      refreshUser();
    }
  }, [refreshUser]);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <div>Загрузка профиля...</div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <div style={{ color: 'red' }}>Ошибка: {error}</div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', paddingBottom: '100px' }}>
        <div style={{ color: 'red' }}>Не авторизован</div>
        <BottomNav />
      </div>
    );
  }

  const handleBuyPremium = async () => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      alert('❌ initData недоступна');
      return;
    }

    setIsPaymentLoading(true);
    try {
      const response = await fetch(
        'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/payment/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `tma ${initData}`,
          },
          body: JSON.stringify({
            amount: 1,
            description: 'Подписка Premium на 1 месяц',
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      if (data.confirmation_url) {
        window.Telegram?.WebApp?.openLink(data.confirmation_url);
      } else {
        alert('❌ Нет ссылки на оплату');
      }
    } catch (err) {
      alert(`❌ Ошибка: ${err.message}`);
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Вы уверены?')) {
      return;
    }

    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) {
      alert('❌ initData недоступна');
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
            'Authorization': `tma ${initData}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      alert('✅ Подписка отменена');
      refreshUser();
    } catch (err) {
      alert(`❌ Ошибка: ${err.message}`);
    } finally {
      setIsCancelingSubscription(false);
    }
  };

  const isPremium = user.subscription?.active;
  const endDate = isPremium ? new Date(user.subscription.end_date).toLocaleDateString('ru-RU') : null;

  return (
    <div style={{ padding: '20px', paddingBottom: '100px', fontFamily: 'system-ui' }}>
      <h1 style={{ margin: '0 0 20px 0' }}>👤 Профиль</h1>

      {/* User Info */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <p style={{ margin: '8px 0' }}>
          <strong>Имя:</strong> {user.first_name} {user.last_name || ''}
        </p>
        <p style={{ margin: '8px 0' }}>
          <strong>Тег:</strong> @{user.username || 'нет'}
        </p>
        <p style={{ margin: '8px 0' }}>
          <strong>ID:</strong> {user.id}
        </p>
      </div>

      {/* Subscription Status */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f0f8ff', borderRadius: '8px' }}>
        <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Статус подписки:</p>
        {isPremium ? (
          <div>
            <p style={{ margin: '5px 0', color: '#28a745', fontSize: '18px', fontWeight: 'bold' }}>
              ✅ Premium
            </p>
            <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>
              До: {endDate}
            </p>
          </div>
        ) : (
          <p style={{ margin: '5px 0', color: '#999' }}>Бесплатный</p>
        )}
      </div>

      {/* Action Buttons */}
      {!isPremium ? (
        <button
          onClick={handleBuyPremium}
          disabled={isPaymentLoading}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: isPaymentLoading ? '#ccc' : '#0088cc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isPaymentLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseOver={(e) => !isPaymentLoading && (e.target.style.backgroundColor = '#0066aa')}
          onMouseOut={(e) => !isPaymentLoading && (e.target.style.backgroundColor = '#0088cc')}
        >
          {isPaymentLoading ? '⏳ Загрузка...' : '💳 Купить (1 ₽)'}
        </button>
      ) : (
        <button
          onClick={handleCancelSubscription}
          disabled={isCancelingSubscription}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: isCancelingSubscription ? '#ccc' : '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isCancelingSubscription ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.15s',
          }}
          onMouseOver={(e) => !isCancelingSubscription && (e.target.style.backgroundColor = '#bb2d3b')}
          onMouseOut={(e) => !isCancelingSubscription && (e.target.style.backgroundColor = '#dc3545')}
        >
          {isCancelingSubscription ? '⏳ Отмена...' : '❌ Отменить'}
        </button>
      )}

      <BottomNav />
    </div>
  );
};

export default Profile;