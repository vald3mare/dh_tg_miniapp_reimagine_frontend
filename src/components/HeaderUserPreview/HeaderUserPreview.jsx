import React from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

export default function HeaderUserPreview({ user }) {
  return (
    <div className='userpreview-wrapper'>
      <img src={user.photo_url} alt="User Avatar" width={30} height={30} />
      <p className='user-name'>@tgnickname</p>
    </div>
  );
}