import { useEffect, useRef, useState, useCallback } from 'react';
import { tgAlert } from '../utils/tg';

const useAdminForm = (initDataRaw, { emptyForm, fetchItems, createItem, updateItem, deleteItem, toForm, toBody = f => f }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Ref keeps fetchItems fresh without making load() unstable
  const fetchItemsRef = useRef(fetchItems);
  fetchItemsRef.current = fetchItems;

  const load = useCallback(() => {
    if (!initDataRaw) return;
    fetchItemsRef.current(initDataRaw).then(list => {
      setItems(list);
      setLoading(false);
    });
  }, [initDataRaw]);

  useEffect(() => { load(); }, [load]);

  const openCreate = useCallback(() => { setForm(emptyForm); setModal('create'); }, [emptyForm]);
  const openEdit = useCallback((item) => { setForm(toForm(item)); setModal(item); }, [toForm]);

  const handleSave = useCallback(async () => {
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
  }, [form, modal, initDataRaw, toBody, createItem, updateItem, load]);

  const handleDelete = useCallback(async (id) => {
    await deleteItem(id, initDataRaw);
    setDeleteTarget(null);
    load();
  }, [deleteItem, initDataRaw, load]);

  return { items, loading, modal, deleteTarget, form, saving, setForm, setModal, setDeleteTarget, openCreate, openEdit, handleSave, handleDelete };
};

export default useAdminForm;
