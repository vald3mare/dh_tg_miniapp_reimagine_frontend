import React from 'react';

export default function HeaderUserPreview({ user }) {
  return (
    <div className='userpreview-wrapper'>
      <img src={user.photo_url} alt="User Avatar" width={50} height={50} />
      <p className='user-name'></p>
    </div>
  );
}