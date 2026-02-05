import { useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

const PROFILE_ENDPOINT = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net';

export function AuthInitializer() {
  useEffect(() => {
    const initDataRaw = retrieveRawInitData();

    if (!initDataRaw) {
      console.warn('initDataRaw не найдена. Вы не в Telegram Mini App?');
      return;
    }

    // Отправляем данные на сервер
    fetch(PROFILE_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `tma ${initDataRaw}`
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err)
    });
  }, []);
}