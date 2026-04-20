import { useState, useRef } from 'react';
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m';
import './EditProfileModal.css';

/*
 * resizeToDataUrl — сжимает загружаемое фото до 240×240px перед сохранением в localStorage,
 * чтобы base64-строка не раздувала хранилище.
 * Используем Canvas API: react.dev/learn/referencing-values-with-refs#when-to-use-refs
 */
function resizeToDataUrl(file, size = 240) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      // Обрезаем по центру (crop square)
      const side = Math.min(img.width, img.height);
      const sx = (img.width - side) / 2;
      const sy = (img.height - side) / 2;
      ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = url;
  });
}

const BACKDROP = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const SHEET    = {
  hidden:  { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', stiffness: 380, damping: 38 } },
  exit:    { y: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
};

const EditProfileModal = ({ open, onClose, initialName, initialCity, initialAvatar, onSave }) => {
  const [name,   setName]   = useState(initialName   ?? '');
  const [city,   setCity]   = useState(initialCity   ?? '');
  const [avatar, setAvatar] = useState(initialAvatar ?? null);
  const fileRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await resizeToDataUrl(file);
    setAvatar(dataUrl);
  };

  const handleSave = () => {
    onSave({ displayName: name.trim(), city: city.trim(), avatarDataUrl: avatar });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="edit-profile-modal__backdrop"
          variants={BACKDROP}
          initial="hidden" animate="visible" exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <m.div
            className="edit-profile-modal"
            variants={SHEET}
            initial="hidden" animate="visible" exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <div className="edit-profile-modal__handle" />
            <h2 className="edit-profile-modal__title">Редактировать профиль</h2>

            {/* Аватар */}
            <div className="edit-profile-modal__avatar-row">
              <div
                className="edit-profile-modal__avatar"
                onClick={() => fileRef.current?.click()}
              >
                {avatar
                  ? <img src={avatar} alt="Аватар" />
                  : <span className="edit-profile-modal__avatar-placeholder">👤</span>
                }
                <div className="edit-profile-modal__avatar-overlay">
                  <span>📷</span>
                </div>
              </div>
              <button
                className="edit-profile-modal__change-photo-btn"
                onClick={() => fileRef.current?.click()}
              >
                Изменить фото
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {/* Поля */}
            <label className="edit-profile-modal__label">
              Имя
              <input
                className="edit-profile-modal__input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Введите имя"
                maxLength={50}
              />
            </label>

            <label className="edit-profile-modal__label">
              Город
              <input
                className="edit-profile-modal__input"
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Например: Санкт-Петербург"
                maxLength={60}
              />
            </label>

            <button
              className="edit-profile-modal__save-btn"
              onClick={handleSave}
              disabled={!name.trim()}
            >
              Сохранить
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
