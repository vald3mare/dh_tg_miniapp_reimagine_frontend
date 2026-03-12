import './OrderList.css';

const SkeletonCard = () => (
  <div className="order-item order-item--skeleton">
    <div className="skeleton-line skeleton-line--title" />
    <div className="skeleton-line skeleton-line--text" />
    <div className="skeleton-line skeleton-line--text skeleton-line--short" />
    <div className="skeleton-line skeleton-line--btn" />
  </div>
);

const OrderListSkeleton = ({ count = 3 }) => (
  <div className="order-list">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default OrderListSkeleton;
