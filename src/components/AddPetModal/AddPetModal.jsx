import { useState } from 'react';
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m';
import './AddPetModal.css';

const PET_TYPES = [
  { emoji: '🐶', label: 'Собака' },
  { emoji: '🐱', label: 'Кошка' },
  { emoji: '🐰', label: 'Кролик' },
  { emoji: '🐦', label: 'Птица' },
  { emoji: '🐠', label: 'Рыбка' },
  { emoji: '🦎', label: 'Рептилия' },
];

const BACKDROP = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const SHEET = {
  hidden:  { y: '100%' },
  visible: { y: 0, transition: { type: 'spring', stiffness: 380, damping: 38 } },
  exit:    { y: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
};

const AddPetModal = ({ open, onClose, onAdd }) => {
  const [type,  setType]  = useState(PET_TYPES[0]);
  const [name,  setName]  = useState('');
  const [breed, setBreed] = useState('');
  const [age,   setAge]   = useState('');

  const reset = () => { setType(PET_TYPES[0]); setName(''); setBreed(''); setAge(''); };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd({ emoji: type.emoji, label: type.label, name: name.trim(), breed: breed.trim(), age: age.trim() });
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="add-pet-modal__backdrop"
          variants={BACKDROP}
          initial="hidden" animate="visible" exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <m.div
            className="add-pet-modal"
            variants={SHEET}
            initial="hidden" animate="visible" exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <div className="add-pet-modal__handle" />
            <h2 className="add-pet-modal__title">Добавить питомца</h2>

            {/* Выбор типа */}
            <p className="add-pet-modal__section-label">Кто ваш питомец?</p>
            <div className="add-pet-modal__type-grid">
              {PET_TYPES.map(t => (
                <button
                  key={t.emoji}
                  className={`add-pet-modal__type-btn${type.emoji === t.emoji ? ' add-pet-modal__type-btn--active' : ''}`}
                  onClick={() => setType(t)}
                >
                  <span className="add-pet-modal__type-emoji">{t.emoji}</span>
                  <span className="add-pet-modal__type-label">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Кличка */}
            <label className="add-pet-modal__label">
              Кличка
              <input
                className="add-pet-modal__input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Например: Бобик"
                maxLength={30}
              />
            </label>

            {/* Порода */}
            <label className="add-pet-modal__label">
              Порода <span className="add-pet-modal__optional">(опционально)</span>
              <input
                className="add-pet-modal__input"
                value={breed}
                onChange={e => setBreed(e.target.value)}
                placeholder="Например: Лабрадор"
                maxLength={40}
              />
            </label>

            {/* Возраст */}
            <label className="add-pet-modal__label">
              Возраст <span className="add-pet-modal__optional">(опционально)</span>
              <input
                className="add-pet-modal__input"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="Например: 3 года"
                maxLength={20}
              />
            </label>

            <button
              className="add-pet-modal__add-btn"
              onClick={handleAdd}
              disabled={!name.trim()}
            >
              Добавить
            </button>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default AddPetModal;
