import { useEffect } from 'react';
import { retrieveRawInitData } from '@tma.js/sdk';

const PROFILE_ENDPOINT = 'https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net';

export function AuthInitializer() {
  useEffect(() => {
    // Выполняем только один раз при монтировании
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
      // body: JSON.stringify({ /* если нужно что-то передать в теле */ }),
      // credentials: 'include', // если нужны куки / сессия
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Ошибка ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Профиль успешно получен / авторизация прошла:', data);
        // Здесь можно сохранить токен, данные пользователя и т.д.
        // setUser(data);
      })
      .catch(err => {
        console.error('Ошибка при отправке initData в профиль:', err);
      });

  }, []);
  // Этот компонент ничего не рендерит, он только отправляет запрос
  return null;
}