import React, { useEffect, useState } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

const Profile = () => {
  const [initData, setInitData] = useState(null);
  
  useEffect(() => {
    const initDataRaw = retrieveRawInitData();
    setInitData(initDataRaw);
  }, []);

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>Это заглушка для страницы профиля</p>
      <p>{initData}</p>
    </div>
  );
};

export default Profile;