import { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { admin } from '../../api';
import PageTransition from '../../components/PageTransition/PageTransition';
import './admin.css';

const STATUS_LABEL = {
  pending:  { text: 'Ожидает',  bg: '#FFF3E0', color: '#F57C00' },
  approved: { text: 'Одобрен',  bg: '#E8F5E9', color: '#388E3C' },
  rejected: { text: 'Отклонён', bg: '#FCE4EC', color: '#C62828' },
};

const FILTERS = [
  { value: '',         label: 'Все'      },
  { value: 'pending',  label: 'Ожидают'  },
  { value: 'approved', label: 'Одобрены' },
  { value: 'rejected', label: 'Отклонены'},
];

/* Модалка с полной анкетой */
const FormModal = ({ app, onClose }) => {
  let form = null;
  try { form = JSON.parse(app.form_data_json); } catch (e) { console.error('[FormModal] Invalid form_data_json:', e); }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" style={{ maxHeight: '80dvh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <p className="admin-modal__title">Анкета — {app.full_name || app.telegram_username}</p>

        {!form && <p className="admin-empty">Данные анкеты недоступны</p>}

        {form && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}>
            {[
              ['ФИО',          form.FIO],
              ['Возраст',      form.Age],
              ['Деятельность', form.Activity?.join(', ')],
              ['Город / метро',form.CityDistrict],
              ['Телефон',      form.Phone],
              ['Telegram',     form.Telegram],
              ['Самозанятый',  form.IsSelfEmployed ? 'Да' : 'Нет'],
              ['Услуги',       form.Services?.join(', ')],
              ['Животные',     form.Animals?.join(', ')],
              ['Опыт',         form.Experience],
              ['График',       form.Schedule],
              ['Договор',      form.SignContract ? 'Да' : 'Нет'],
              ['Первая помощь',form.FirstAid ? 'Да' : 'Нет'],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} style={{ display: 'flex', gap: 6 }}>
                <span style={{ color: '#888', minWidth: 110, flexShrink: 0 }}>{label}:</span>
                <span style={{ color: '#1a1a1a', fontWeight: 500 }}>{String(value)}</span>
              </div>
            ))}
          </div>
        )}

        <button className="admin-btn admin-btn--outline" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

/* Модалка отклонения с комментарием */
const RejectModal = ({ onConfirm, onClose }) => {
  const [note, setNote] = useState('');
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={e => e.stopPropagation()}>
        <p className="admin-modal__title">Причина отклонения</p>
        <textarea
          className="admin-input"
          rows={3}
          placeholder="Комментарий для кандидата (необязательно)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ resize: 'none' }}
        />
        <div className="admin-row">
          <button className="admin-btn admin-btn--danger" style={{ flex: 1 }} onClick={() => onConfirm(note)}>
            Отклонить
          </button>
          <button className="admin-btn admin-btn--outline" style={{ flex: 1 }} onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

/* Карточка одной заявки */
const AppCard = ({ app, onApprove, onReject, onViewForm }) => {
  const s = STATUS_LABEL[app.status] ?? STATUS_LABEL.pending;
  const date = new Date(app.CreatedAt || app.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="admin-list-item" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="admin-list-item__name">
            {app.full_name || '—'}
            {app.telegram_username && (
              <span style={{ fontWeight: 400, color: '#888', marginLeft: 6 }}>@{app.telegram_username}</span>
            )}
          </div>
          <div className="admin-list-item__sub">{date}</div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '3px 8px',
          borderRadius: 6, background: s.bg, color: s.color, whiteSpace: 'nowrap',
        }}>
          {s.text}
        </span>
      </div>

      {app.review_note && (
        <div style={{ fontSize: 12, color: '#888', fontStyle: 'italic' }}>
          💬 {app.review_note}
        </div>
      )}

      <div className="admin-row" style={{ flexWrap: 'wrap' }}>
        <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => onViewForm(app)}>
          📋 Анкета
        </button>
        {app.status === 'pending' && (
          <>
            <button
              className="admin-btn admin-btn--primary admin-btn--sm"
              style={{ background: '#40C057' }}
              onClick={() => onApprove(app.ID)}
            >
              ✓ Одобрить
            </button>
            <button
              className="admin-btn admin-btn--danger admin-btn--sm"
              onClick={() => onReject(app)}
            >
              ✕ Отклонить
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Главная страница ── */
const AdminApplications = () => {
  const { initDataRaw } = useUser();
  const [apps, setApps]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('pending');
  const [viewApp, setViewApp]     = useState(null);   // модалка анкеты
  const [rejectApp, setRejectApp] = useState(null);   // модалка отклонения

  const load = useCallback(() => {
    if (!initDataRaw) return;
    setLoading(true);
    admin.getApplications(initDataRaw, filter)
      .then(d => setApps(d.applications || []))
      .finally(() => setLoading(false));
  }, [initDataRaw, filter]);

  useEffect(() => { load(); }, [load]);

  const handleApprove = async (id) => {
    await admin.approveApplication(id, initDataRaw);
    load();
  };

  const handleReject = async (note) => {
    await admin.rejectApplication(rejectApp.ID, note, initDataRaw);
    setRejectApp(null);
    load();
  };

  const pending = apps.filter(a => a.status === 'pending').length;

  return (
    <PageTransition>
      <div className="admin-page">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1 className="admin-page-title">Исполнители</h1>
          {pending > 0 && (
            <span style={{
              background: '#FA5252', color: '#fff',
              borderRadius: '100px', fontSize: 12, fontWeight: 700,
              padding: '2px 8px', lineHeight: 1.4,
            }}>
              {pending}
            </span>
          )}
        </div>

        {/* Фильтр */}
        <div className="admin-row" style={{ flexWrap: 'wrap', gap: 6 }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              className={`admin-btn admin-btn--sm ${filter === f.value ? 'admin-btn--primary' : 'admin-btn--outline'}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="admin-section">
          {loading && <p className="admin-empty">Загрузка...</p>}
          {!loading && apps.length === 0 && (
            <p className="admin-empty">Заявок нет</p>
          )}
          {apps.map(app => (
            <AppCard
              key={app.ID}
              app={app}
              onApprove={handleApprove}
              onReject={setRejectApp}
              onViewForm={setViewApp}
            />
          ))}
        </div>
      </div>

      {viewApp   && <FormModal   app={viewApp}   onClose={() => setViewApp(null)} />}
      {rejectApp && <RejectModal onConfirm={handleReject} onClose={() => setRejectApp(null)} />}
    </PageTransition>
  );
};

export default AdminApplications;
