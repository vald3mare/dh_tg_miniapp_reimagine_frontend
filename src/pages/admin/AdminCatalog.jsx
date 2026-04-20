import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m';
import { useUser } from '../../context/UserContext';
import { admin } from '../../api';
import PageTransition from '../../components/PageTransition/PageTransition';
import useAdminForm from '../../hooks/useAdminForm';
import './admin.css';

const EMPTY_FORM = { name: '', description: '', full_description: '', price: '', image_url: '', type: 'service' };

const AdminCatalog = () => {
  const { initDataRaw } = useUser();
  const {
    items, loading, modal, deleteTarget, form, saving,
    setForm, setModal, setDeleteTarget,
    openCreate, openEdit, handleSave, handleDelete,
  } = useAdminForm(initDataRaw, {
    emptyForm: EMPTY_FORM,
    fetchItems: (tok) => admin.getCatalog(tok).then(d => d.items || []),
    createItem: (body, tok) => admin.createCatalogItem(body, tok),
    updateItem: (id, body, tok) => admin.updateCatalogItem(id, body, tok),
    deleteItem: (id, tok) => admin.deleteCatalogItem(id, tok),
    toForm: (item) => ({
      name: item.name || '',
      description: item.description || '',
      full_description: item.full_description || '',
      price: item.price ?? '',
      image_url: item.image_url || '',
      type: item.type || 'service',
    }),
    toBody: (form) => ({ ...form, price: parseFloat(form.price) || 0 }),
  });

  return (
    <PageTransition>
      <div className="admin-page">
        <div className="admin-row">
          <h1 className="admin-page-title" style={{ flex: 1 }}>Каталог</h1>
          <button className="admin-btn admin-btn--primary" onClick={openCreate}>+ Добавить</button>
        </div>

        {loading && <p className="admin-empty">Загрузка...</p>}

        <div className="admin-section">
          {items.length === 0 && !loading && <p className="admin-empty">Нет услуг</p>}
          {items.map(item => (
            <div className="admin-list-item" key={item.ID}>
              <div className="admin-list-item__info">
                <div className="admin-list-item__name">{item.name || '—'}</div>
                <div className="admin-list-item__sub">{item.price}₽ · {item.type}</div>
              </div>
              <button className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => openEdit(item)}>✏️</button>
              <button className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => setDeleteTarget(item)}>🗑</button>
            </div>
          ))}
        </div>
      </div>

      {/* Модал создания/редактирования */}
      <AnimatePresence>
        {modal && (
          <m.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModal(null)}>
            <m.div className="admin-modal" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={e => e.stopPropagation()}>
              <p className="admin-modal__title">{modal === 'create' ? 'Новая услуга' : 'Редактировать'}</p>
              <div className="admin-form">
                <input className="admin-input" placeholder="Название" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                <input className="admin-input" placeholder="Краткое описание" value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                <textarea className="admin-input" placeholder="Полное описание" rows={3} value={form.full_description}
                  onChange={e => setForm(f => ({ ...f, full_description: e.target.value }))} />
                <input className="admin-input" placeholder="Цена (₽)" type="number" value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
                <input className="admin-input" placeholder="URL изображения" value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
                <input className="admin-input" placeholder="Тип (service)" value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))} />
                <div className="admin-row">
                  <button className="admin-btn admin-btn--outline" style={{ flex: 1 }} onClick={() => setModal(null)}>Отмена</button>
                  <button className="admin-btn admin-btn--primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                    {saving ? 'Сохраняем...' : 'Сохранить'}
                  </button>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      {/* Модал подтверждения удаления */}
      <AnimatePresence>
        {deleteTarget && (
          <m.div className="admin-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setDeleteTarget(null)}>
            <m.div className="admin-modal" initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }}
              onClick={e => e.stopPropagation()}>
              <p className="admin-modal__title">Удалить услугу?</p>
              <p style={{ margin: 0, fontSize: 14, color: '#555' }}>«{deleteTarget.name}» будет удалена</p>
              <div className="admin-row" style={{ marginTop: 4 }}>
                <button className="admin-btn admin-btn--outline" style={{ flex: 1 }} onClick={() => setDeleteTarget(null)}>Отмена</button>
                <button className="admin-btn admin-btn--danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteTarget.ID)}>Удалить</button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default AdminCatalog;
