# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




Итог

  Backend

  Новые модели (AutoMigrate запустится при старте):
  - Order — заявки от заказчиков
  - Achievement / UserAchievement — ачивки
  - User — добавлены поля Role, Rating, OrdersCompleted

  Авторизация админа:
  - Задаёшь ADMIN_TELEGRAM_IDS=123456789,987654321 в env
  - При первом обращении к /profile роль автоматически ставится admin

  Новые роуты:
  POST /orders                      — создать заявку (X-API-Key для Тильды)
  GET  /executor/orders             — открытые заявки
  POST /executor/orders/:id/accept  — принять заявку
  GET  /executor/orders/my          — мои заявки
  GET  /executor/achievements       — ачивки исполнителя
  POST /profile/role                — сменить роль

  GET    /admin/stats
  GET/POST/PUT/DELETE /admin/catalog/:id
  GET/POST/PUT/DELETE /admin/achievements/:id
  GET    /admin/users
  PUT    /admin/users/:id/role
  POST   /admin/users/:id/achievement
  GET    /admin/orders
  PUT    /admin/orders/:id/status

  Frontend

  Роли и навигация:
  - Welcome → авто-редирект по роли (customer→/home, executor→/executor/home, admin→/admin)
  - Разные BottomNav для каждого слоя
  - /admin/* защищён RoleGuard

  Админ-панель (5 вкладок):
  - Стата — пользователи, заявки, платежи, топ услуг
  - Каталог — CRUD услуг (слайд-модал снизу)
  - Ачивки — CRUD ачивок (условия, иконки, пороги)
  - Пользователи — смена роли, выдача ачивок вручную
  - Заявки — все заявки + смена статуса