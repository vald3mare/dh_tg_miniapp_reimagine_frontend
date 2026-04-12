import './TariffSection.css';

/*
 * Данные тарифов — статика до появления соответствующего API.
 * Структура взята с сайта, дизайн — Vivid Paws.
 *
 * variant определяет цветовую схему карточки:
 *   pale  → голубой светлый (#E8EDFF) — стартовый тариф
 *   blue  → primary blue (#476CEE)    — популярный
 *   pink  → hot pink (#EA6CCB)        — люкс
 *   dark  → dark (#1A1A2E)            — ультра-премиум
 */
const TARIFFS = [
  {
    id: 'work-life',
    variant: 'pale',
    name: 'Ворк Лайф Пет',
    price: '4 990',
    period: '/ месяц',
    features: [
      '5 выгулов по 1 часу',
      '1 короткий выгул в подарок',
      'Фото-, аудио- и текстовые отчёты',
      'Трекинг «Где мой пёс?»',
      'Дневник и история активности',
    ],
  },
  {
    id: 'top-tail',
    variant: 'blue',
    badge: '⭐ Хит продаж',
    name: 'Топ Хвостик',
    price: '8 250',
    period: '/ месяц',
    features: [
      '10 выгулов по 1 часу',
      'Закреплённый исполнитель',
      'Фото-, аудио- и текстовые отчёты',
      'Трекинг «Где мой пёс?»',
      'Поддержка менеджера во время выгула',
      'Дневник и история активности',
    ],
  },
  {
    id: 'lux-paw',
    variant: 'pink',
    name: 'Люкс-Лапка',
    price: '15 650',
    period: '/ месяц',
    features: [
      '20 выгулов по 1 часу',
      'Закреплённый исполнитель',
      '1 занятие с кинологом онлайн',
      'Приоритет в подборе',
      'Поддержка менеджера во время выгула',
      'Фото-, аудио- и текстовые отчёты',
    ],
  },
  {
    id: 'prime',
    variant: 'dark',
    name: 'Пушистый Прайм',
    price: '24 990',
    period: '/ месяц',
    features: [
      '30 выгулов по 1 часу',
      'Закреплённый исполнитель',
      '2 занятия с кинологом онлайн',
      'Приоритет в подборе',
      'Поддержка менеджера во время выгула',
      'Фото-, аудио- и текстовые отчёты',
    ],
  },
];

/* Полная карточка тарифа (для страницы Тарифы) */
const TariffCardFull = ({ tariff }) => (
  <div className={`tariff-card tariff-card--${tariff.variant}`}>
    <div className="tariff-card__header">
      {tariff.badge && (
        <span className="tariff-card__badge">{tariff.badge}</span>
      )}
      <h3 className="tariff-card__name">{tariff.name}</h3>
    </div>

    <div className="tariff-card__divider" />

    <ul className="tariff-card__features">
      {tariff.features.map((f) => (
        <li key={f} className="tariff-card__feature">
          <span className="tariff-card__check" aria-hidden="true">✓</span>
          {f}
        </li>
      ))}
    </ul>

    <div className="tariff-card__footer">
      <div className="tariff-card__pricing">
        <span className="tariff-card__price">{tariff.price} ₽</span>
        <span className="tariff-card__period">{tariff.period}</span>
      </div>
      <button className="tariff-card__btn">Подключить</button>
    </div>
  </div>
);

/* Компактная карточка (для главной страницы, 2 шт. в сетке) */
const TariffCardCompact = ({ tariff }) => (
  <div className={`tariff-card tariff-card--compact tariff-card--${tariff.variant}`}>
    {tariff.badge && (
      <span className="tariff-card__badge">{tariff.badge}</span>
    )}
    <p className="tariff-card__name tariff-card__name--compact">{tariff.name}</p>
    <p className="tariff-card__price tariff-card__price--compact">{tariff.price} ₽</p>
    <p className="tariff-card__period">{tariff.period}</p>
    <button className="tariff-card__btn">Подключить</button>
  </div>
);

/*
 * TariffSection
 * compact=true  → главная страница: 2 карточки в сетке
 * compact=false → страница Тарифы: все 4 в горизонтальной карусели
 */
const TariffSection = ({ compact = true }) => {
  const displayedTariffs = compact ? TARIFFS.slice(0, 2) : TARIFFS;

  return (
    <section className="tariff-section">
      <h2 className="tariff-section__title">Абонементы</h2>

      {compact ? (
        <div className="tariff-section__grid">
          {displayedTariffs.map(t => (
            <TariffCardCompact key={t.id} tariff={t} />
          ))}
        </div>
      ) : (
        <div className="tariff-section__carousel">
          {displayedTariffs.map(t => (
            <TariffCardFull key={t.id} tariff={t} />
          ))}
        </div>
      )}
    </section>
  );
};

export default TariffSection;
