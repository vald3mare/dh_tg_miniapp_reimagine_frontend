import React, { useEffect, useState } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';
import ProfileBLock from '../components/Profileblock/Profileblock';

const Profile = () => {
  const [initData, setInitData] = useState(null);
  
  useEffect(() => {
    const initDataRaw = retrieveRawInitData();
    setInitData(initDataRaw);
  }, []);

  return (
    <>
      <ProfileBLock />
    </>
  );
};

export default Profile;