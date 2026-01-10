// import React, { createContext, useState, useEffect } from 'react';
// import { retrieveRawInitData } from '@tma.js/sdk';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const initDataRaw = retrieveRawInitData();
//     if (!initDataRaw) {
//       setLoading(false);
//       return;
//     }

//     fetch('https://vald3mare-dh-tg-miniapp-reimagine-backend-e40f.twc1.net/', {
//       method: 'POST',
//       headers: { Authorization: `tma ${initDataRaw}` },
//     })
//       .then(res => res.json())
//       .then(data => {
//         setUser(data.user);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, loading }}>
//       {children}
//     </UserContext.Provider>
//   );
// };