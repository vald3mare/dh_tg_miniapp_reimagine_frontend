import React from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

const UserPreview = () => {
  const initDataRaw = retrieveRawInitData();

  return (
    <div className="user-preview">
      <div className="user-preview__inner">
        <img className="user-preview__icon" src={initDataRaw?.user?.photo_url} alt="User Icon" />
        <span className="user-preview__name">{initDataRaw?.user?.first_name}</span>
      </div>
      <span className="user-preview__city">{initDataRaw?.user?.id}</span>
    </div>
  );
}

export default UserPreview;