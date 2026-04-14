import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { usePets } from '../../hooks/usePets';
import { useProfileOverrides } from '../../hooks/useProfileOverrides';
import { useCustomerOrders } from '../../hooks/useCustomerOrders';
import EditProfileModal from '../EditProfileModal/EditProfileModal';
import AddPetModal from '../AddPetModal/AddPetModal';
import ProfileBlockSkeleton from './ProfileBlockSkeleton';
import ellipse from '../../assets/profile_skeleton.svg';
import './Profileblock.css';

/* Статусы заказов → русский + цвет (соответствуют backend: open/accepted/in_progress/done/canceled) */
const STATUS_MAP = {
  open:        { label: 'Ожидает',    color: '#FD7E14' },
  accepted:    { label: 'Принят',     color: '#476CEE' },
  in_progress: { label: 'В работе',   color: '#228BE6' },
  done:        { label: 'Выполнен',   color: '#40C057' },
  canceled:    { label: 'Отменён',    color: '#FA5252' },
};

const SERVICE_EMOJI = {
  'Выгул': '🐕', 'Зооняня': '🏠', 'Кинолог': '🎓',
  'Передержка': '🛏️', 'Ветеринар': '💊',
};

/* ── Карточка заказа ── */
const OrderCard = ({ order }) => {
  const emoji = Object.entries(SERVICE_EMOJI).find(([k]) =>
    order.service_type?.includes(k)
  )?.[1] ?? '🐾';
  const status = STATUS_MAP[order.status] ?? { label: order.status ?? 'Новый', color: '#868E96' };

  return (
    <div className="profile-order">
      <div className="profile-order__left">
        <span className="profile-order__emoji">{emoji}</span>
        <div className="profile-order__info">
          <p className="profile-order__type">{order.service_type || 'Услуга'}</p>
          {order.scheduled_at && (
            <p className="profile-order__date">
              {new Date(order.scheduled_at).toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'short',
              })}
            </p>
          )}
        </div>
      </div>
      <div className="profile-order__right">
        {order.price > 0 && (
          <p className="profile-order__price">{order.price} ₽</p>
        )}
        <span
          className="profile-order__status"
          style={{ color: status.color, background: `${status.color}18` }}
        >
          {status.label}
        </span>
      </div>
    </div>
  );
};

/* ── Карточка питомца ── */
const PetCard = ({ pet, onRemove }) => (
  <div className="pet-card">
    <button
      className="pet-card__remove"
      onClick={() => onRemove(pet.id)}
      aria-label={`Удалить ${pet.name}`}
    >
      ×
    </button>
    <span className="pet-card__emoji">{pet.emoji}</span>
    <p className="pet-card__name">{pet.name}</p>
    {pet.breed && <p className="pet-card__breed">{pet.breed}</p>}
  </div>
);

/* ── Карточка «Добавить питомца» ── */
const AddPetCard = ({ onClick }) => (
  <button className="pet-card pet-card--add" onClick={onClick} aria-label="Добавить питомца">
    <span className="pet-card__plus">+</span>
    <p className="pet-card__name">Добавить</p>
  </button>
);

/* ══════════════════════════════════════
   Главный компонент ProfileBlock
   ══════════════════════════════════════ */
const ProfileBlock = () => {
  const { user, loading, initDataRaw }  = useUser();
  const { pets, addPet, removePet }     = usePets();
  const { overrides, saveOverrides }    = useProfileOverrides();
  const { orders, loading: ordersLoad } = useCustomerOrders(initDataRaw);

  const [editOpen, setEditOpen]     = useState(false);
  const [addPetOpen, setAddPetOpen] = useState(false);

  if (loading) return <ProfileBlockSkeleton />;

  const tgName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`).trim() || user.username || 'Пользователь'
    : 'Пользователь';

  const displayName = overrides.displayName || tgName;
  const city        = overrides.city || '';
  const avatarSrc   = overrides.avatarDataUrl || user?.photo_url || ellipse;
  const username    = user?.username ? `@${user.username}` : '';

  return (
    <div className="profile">

      {/* ── Карточка профиля ── */}
      <div className="profile__card">
        <div className="profile__avatar-wrap">
          <motion.img
            className="profile__avatar"
            src={avatarSrc}
            alt="Аватар"
            layoutId="profile-avatar"
          />
        </div>

        <div className="profile__info">
          <motion.h2 className="profile__name" layoutId="profile-fullname">
            {displayName}
          </motion.h2>
          {username && <p className="profile__username">{username}</p>}
          {city && (
            <p className="profile__city">📍 {city}</p>
          )}
        </div>

        <button
          className="profile__edit-btn"
          onClick={() => setEditOpen(true)}
          aria-label="Редактировать профиль"
        >
          ✏️ Изменить
        </button>
      </div>

      {/* ── Питомцы ── */}
      <section className="profile__section">
        <div className="profile__section-header">
          <h3 className="profile__section-title">Мои питомцы</h3>
          <button
            className="profile__section-link"
            onClick={() => setAddPetOpen(true)}
          >
            + Добавить
          </button>
        </div>

        <div className="profile__pets-scroll">
          <AnimatePresence>
            {pets.map(pet => (
              <motion.div
                key={pet.id}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.2 }}
              >
                <PetCard pet={pet} onRemove={removePet} />
              </motion.div>
            ))}
          </AnimatePresence>
          <AddPetCard onClick={() => setAddPetOpen(true)} />
        </div>

        {pets.length === 0 && (
          <p className="profile__empty-hint">Добавьте своего питомца 🐾</p>
        )}
      </section>

      {/* ── Заказы ── */}
      <section className="profile__section">
        <h3 className="profile__section-title">Мои заказы</h3>

        {ordersLoad ? (
          <p className="profile__loading-hint">Загружаем…</p>
        ) : orders.length > 0 ? (
          <div className="profile__orders-list">
            {orders.map(order => (
              <OrderCard key={order.ID ?? order.id} order={order} />
            ))}
          </div>
        ) : (
          <div className="profile__orders-empty">
            <span className="profile__orders-empty-icon">🐕</span>
            <p>Заказов пока нет</p>
            <p className="profile__orders-empty-sub">
              Выберите услугу и закажите выгул или передержку
            </p>
          </div>
        )}
      </section>

      {/* ── Модальные окна ── */}
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initialName={displayName}
        initialCity={city}
        initialAvatar={overrides.avatarDataUrl ?? null}
        onSave={saveOverrides}
      />

      <AddPetModal
        open={addPetOpen}
        onClose={() => setAddPetOpen(false)}
        onAdd={addPet}
      />
    </div>
  );
};

export default ProfileBlock;
