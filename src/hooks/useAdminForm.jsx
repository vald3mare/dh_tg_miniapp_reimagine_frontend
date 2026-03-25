import { useEffect, useState } from 'react';
import { tgAlert } from '../utils/tg';

/**
 * Shared CRUD state for admin pages that have a list + create/edit modal + delete confirm.
 *
 * @param {string|null} initDataRaw  - Telegram init data for API auth
 * @param {object} opts
 * @param {object}   opts.emptyForm   - blank form state
 * @param {Function} opts.fetchItems  - (initDataRaw) => Promise<item[]>
 * @param {Function} opts.createItem  - (body, initDataRaw) => Promise
 * @param {Function} opts.updateItem  - (id, body, initDataRaw) => Promise
 * @param {Function} opts.deleteItem  - (id, initDataRaw) => Promise
 * @param {Function} opts.toForm      - (item) => form object
 * @param {Function} [opts.toBody]    - (form) => body object, default identity
 */
const useAdminForm = (initDataRaw, { emptyForm, fetchItems, createItem, updateItem, deleteItem, toForm, toBody = f => f }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);       // null | 'create' | item-object
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    if (!initDataRaw) return;
    fetchItems(initDataRaw).then(list => {
      setItems(list);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, [initDataRaw]);

  const openCreate = () => { setForm(emptyForm); setModal('create'); };
  const openEdit = (item) => { setForm(toForm(item)); setModal(item); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = toBody(form);
      if (modal === 'create') {
        await createItem(body, initDataRaw);
      } else {
        await updateItem(modal.ID, body, initDataRaw);
      }
      setModal(null);
      load();
    } catch (e) {
      tgAlert(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteItem(id, initDataRaw);
    setDeleteTarget(null);
    load();
  };

  return { items, loading, modal, deleteTarget, form, saving, setForm, setModal, setDeleteTarget, openCreate, openEdit, handleSave, handleDelete };
};

export default useAdminForm;
