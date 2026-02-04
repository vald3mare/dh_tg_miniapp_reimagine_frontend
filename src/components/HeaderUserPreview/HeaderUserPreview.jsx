import React from 'react';

export default function HeaderUserPreview({ user }) {
  return (
    <div>
      <img src={user.photo_url} alt="User Avatar" width={50} height={50} />
    </div>
  );
}