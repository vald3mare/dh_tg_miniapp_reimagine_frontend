import { retrieveRawInitData } from '@tma.js/sdk';
import './UserPreview.css';
import ellipse from '../../assets/profile_skeleton.svg';
import { useUser } from '../../context/UserContext';

const UserPreview = () => {
  const user = useUser();

  const displayName = user ? `${user.FirstName || ''} ${user.LastName || ''}`.trim() || user.Username || 'Имя пользователя' : 'Имя пользователя';
  const displayId = user ? user.TelegramID || 'ID пользователя' : 'ID пользователя';
  const photoSrc = user?.PhotoURL || ellipse;

  return (
    <div className="user-preview">
      <div className="user-preview__inner">
        <img className="user-preview__icon" src={photoSrc} alt="Фото пользователя" />
        <span className="user-preview__name">{displayName}</span>
      </div>
      <span className="user-preview__city">{displayId}</span>
    </div>
  );
}

export default UserPreview;