import Skeleton from '../Skeleton/Skeleton'
import './CatalogListSkeleton.css'

const CatalogItemSkeleton = () => (
  <div className="catalog-item-skeleton">
    <Skeleton className="catalog-item-skeleton__bg" />
    <div className="catalog-item-skeleton__footer">
      <Skeleton className="catalog-item-skeleton__title" />
      <Skeleton className="catalog-item-skeleton__desc" />
    </div>
    <Skeleton className="catalog-item-skeleton__btn" />
  </div>
)

const CatalogListSkeleton = ({ count = 2, showTitle = false }) => (
  <div className="catalog-list">
    {showTitle && (
      <div className="catalog-list__header">
        <Skeleton width={130} height={28} borderRadius="8px" />
        <Skeleton width={60}  height={18} borderRadius="8px" />
      </div>
    )}
    <div className="catalog-list__items">
      {Array.from({ length: count }).map((_, i) => (
        <CatalogItemSkeleton key={i} />
      ))}
    </div>
  </div>
)

export default CatalogListSkeleton
