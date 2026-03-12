import './AchievementCard.css';

const AchievementCard = ({ achievement }) => {
  const { IconEmoji, Name, Description, earned, EarnedAt } = achievement;

  return (
    <div className={`achievement-card ${earned ? 'achievement-card--earned' : 'achievement-card--locked'}`}>
      <span className="achievement-card__icon">{IconEmoji}</span>
      <div className="achievement-card__info">
        <span className="achievement-card__name">{Name}</span>
        <span className="achievement-card__desc">{Description}</span>
        {earned && EarnedAt && (
          <span className="achievement-card__date">{EarnedAt}</span>
        )}
      </div>
      {!earned && <span className="achievement-card__lock">🔒</span>}
    </div>
  );
};

export default AchievementCard;
