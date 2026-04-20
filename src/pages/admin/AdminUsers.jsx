import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m';
import { useUser } from '../../context/UserContext';
import { admin } from '../../api';
import PageTransition from '../../components/PageTransition/PageTransition';
import './admin.css';
import { tgAlert } from '../../utils/tg';

const ROLES = ['customer', 'executor', 'admin'];

const AdminUsers = () => {
  const { initDataRaw } = useUser();
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grantModal, setGrantModal] = useState(null);
  const [selectedAch, setSelectedAch] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!initDataRaw) return;
    Promise.all([
      admin.getUsers(initDataRaw),
      admin.getAchievements(initDataRaw),
    ]).then(([u, a]) => {
      setUsers(u.users || []);
      setAchievements(a.achievements || []);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [initDataRaw]);

  const handleRoleChange = async (userId, role) => {
    await admin.setUserRole(userId, role, initDataRaw);
    load();
  };

  const handleGrantAchievement = async () => {
    if (!selectedAch) return;
    setSaving(true);
    try {
      await admin.grantAchievement(grantModal.ID, parseInt(selectedAch), initDataRaw);
      setGrantModal(null);
    } catch (e) {
      tgAlert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageTransition>
      <div className="admin-page">
        <h1 className="admin-page-title">Пользователи</h1>

        {loading && <p className="admin-empty">Загрузка...</p>}

        <div className="admin-section">
          {users.length === 0 && !loading && <p className="admin-empty">Нет пользователей</p>}
          {users.map(user => {
            const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || `ID ${user.telegram_id}`;
            return (
              <div className="admin-list-item" key={user.ID} style={{ flexWrap: 'wrap', gap: 8 }}>
                <div className="admin-list-item__info">
                  <div className="admin-list-item__name">{name}</div>
                  <div className="admin-list-item__sub">@{user.username || '—'} · tg:{user.telegram_id}</div>
                </div>
                <select
                  className="admin-input admin-input--small"
                  style={{ width: 'auto' }}
                  value={user.role || 'customer'}
                  onChange={e => handleRoleChange(user.ID, e.target.value)}
                >
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button className="admin-btn admin-btn--outline admin-btn--sm"
                  onClick={() => { setGrantModal(user); setSelectedAch(''); }}>
                  🏆
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {grantModal && (
          <m.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setGrantModal(null)}>
            <m.div className="admin-modal" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={e => e.stopPropagation()}>
              <p className="admin-modal__title">Выдать ачивку</p>
              <p style={{ margin: 0, fontSize: 13, color: '#555' }}>
                {[grantModal.first_name, grantModal.last_name].filter(Boolean).join(' ')}
              </p>
              <select className="admin-input" value={selectedAch}
                onChange={e => setSelectedAch(e.target.value)}>
                <option value="">Выберите ачивку...</option>
                {achievements.map(a => (
                  <option key={a.ID} value={a.ID}>{a.icon_emoji} {a.name}</option>
                ))}
              </select>
              <div className="admin-row">
                <button className="admin-btn admin-btn--outline" style={{ flex: 1 }} onClick={() => setGrantModal(null)}>Отмена</button>
                <button className="admin-btn admin-btn--primary" style={{ flex: 1 }} onClick={handleGrantAchievement}
                  disabled={!selectedAch || saving}>
                  {saving ? 'Выдаём...' : 'Выдать'}
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default AdminUsers;
