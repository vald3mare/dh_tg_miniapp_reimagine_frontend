import React, { useEffect } from 'react'
import { retrieveRawInitData } from '@tma.js/sdk'

const App = () => {
  useEffect(() => {
    const initDataRaw = retrieveRawInitData()

    // Отправляем сырую init data на бекенд
    fetch('https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/', {
      method: 'POST',
      headers: {
        Authorization: `tma ${initDataRaw}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Backend error')
        return res.json()
      })
      .then((data) => console.log('Backend response:', data))
      .catch((err) => console.error('Fetch error:', err))
  }, [])

  return (
    <div>
      <h1>Welcome to the App</h1>
      <p>Init data: {initDataRaw}</p>
    </div>
  );
};

export default App;