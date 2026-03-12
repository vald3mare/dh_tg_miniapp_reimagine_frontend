import './AchievementCard.css';

const AchievementCard = ({ achievement }) => {
  const { icon_emoji, name, description, earned, earned_at } = achievement;

  return (
    <div className={`achievement-card ${earned ? 'achievement-card--earned' : 'achievement-card--locked'}`}>
      <span className="achievement-card__icon">{icon_emoji}</span>
      <div className="achievement-card__info">
        <span className="achievement-card__name">{name}</span>
        <span className="achievement-card__desc">{description}</span>
        {earned && earned_at && (
          <span className="achievement-card__date">{earned_at}</span>
        )}
      </div>
      {!earned && <span className="achievement-card__lock">🔒</span>}
    </div>
  );
};

export default AchievementCard;
