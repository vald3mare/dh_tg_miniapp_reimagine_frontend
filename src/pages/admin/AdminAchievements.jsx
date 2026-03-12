import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { admin } from '../../api';
import PageTransition from '../../components/PageTransition/PageTransition';
import './admin.css';

const EMPTY_FORM = { key: '', name: '', description: '', icon_emoji: '🏆', condition_type: 'orders_completed', threshold: '' };

const AdminAchievements = () => {
  const { initDataRaw } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!initDataRaw) return;
    admin.getAchievements(initDataRaw).then(d => { setItems(d.achievements || []); setLoading(false); });
  };

  useEffect(() => { load(); }, [initDataRaw]);

  const openCreate = () => { setForm(EMPTY_FORM); setModal('create'); };
  const openEdit = (item) => {
    setForm({
      key: item.key || '',
      name: item.name || '',
      description: item.description || '',
      icon_emoji: item.icon_emoji || '🏆',
      condition_type: item.condition_type || 'orders_completed',
      threshold: item.threshold ?? '',
    });
    setModal(item);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = { ...form, threshold: parseInt(form.threshold) || 0 };
      if (modal === 'create') {
        await admin.createAchievement(body, initDataRaw);
      } else {
        await admin.updateAchievement(modal.ID, body, initDataRaw);
      }
      setModal(null);
      load();
    } catch (e) {
      window.Telegram?.WebApp?.showAlert
        ? window.Telegram.WebApp.showAlert(e.message)
        : alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await admin.deleteAchievement(id, initDataRaw);
    setDeleteTarget(null);
    load();
  };

  return (
    <PageTransition>
      <div className="admin-page">
        <div className="admin-row">
          <h1 className="admin-page-title" style={{ flex: 1 }}>Ачивки</h1>
          <button className="admin-btn admin-btn--primary" onClick={openCreate}>+ Добавить</button>
        </div>

        {loading && <p className="admin-empty">Загрузка...</p>}

        <div className="admin-section">
          {items.length === 0 && !loading && <p className="admin-empty">Нет ачивок</p>}
          {items.map(item => (
            <div className="admin-list-item" key={item.ID}>
              <span style={{ fontSize: 24 }}>{item.icon_emoji}</span>
              <div className="admin-list-item__info">
                <div className="admin-list-item__name">{item.name}</div>
                <div className="admin-list-item__sub">
                  {item.condition_type === 'manual' ? 'Вручную' : `≥ ${item.threshold} заказов`}
                  {' · '}{item.key}
                </div>
              </div>
              <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => openEdit(item)}>✏️</button>
              <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteTarget(item)}>🗑</button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(null)}>
            <motion.div className="admin-modal" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={e => e.stopPropagation()}>
              <p className="admin-modal__title">{modal === 'create' ? 'Новая ачивка' : 'Редактировать'}</p>
              <div className="admin-form">
                <input className="admin-input" placeholder="Ключ (уникальный, en)" value={form.key}
                  onChange={e => setForm(f => ({ ...f, key: e.target.value }))} disabled={modal !== 'create'} />
                <input className="admin-input" placeholder="Название" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="admin-input" placeholder="Описание" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                <input className="admin-input" placeholder="Иконка (эмодзи)" value={form.icon_emoji}
                  onChange={e => setForm(f => ({ ...f, icon_emoji: e.target.value }))} />
                <select className="admin-input" value={form.condition_type}
                  onChange={e => setForm(f => ({ ...f, condition_type: e.target.value }))}>
                  <option value="orders_completed">По кол-ву заказов</option>
                  <option value="manual">Вручную</option>
                </select>
                {form.condition_type === 'orders_completed' && (
                  <input className="admin-input" placeholder="Порог (кол-во заказов)" type="number" value={form.threshold}
                    onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))} />
                )}
                <div className="admin-row">
                  <button className="admin-btn admin-btn--outline" style={{ flex: 1 }} onClick={() => setModal(null)}>Отмена</button>
                  <button className="admin-btn admin-btn--primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                    {saving ? 'Сохраняем...' : 'Сохранить'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <motion.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}>
            <motion.div className="admin-modal" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={e => e.stopPropagation()}>
              <p className="admin-modal__title">Удалить ачивку?</p>
              <p style={{ margin: 0, fontSize: 14, color: '#555' }}>«{deleteTarget.name}»</p>
              <div className="admin-row" style={{ marginTop: 4 }}>
                <button className="admin-btn admin-btn--outline" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>Отмена</button>
                <button className="admin-btn admin-btn--danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteTarget.ID)}>Удалить</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default AdminAchievements;
