import Skeleton from '../Skeleton/Skeleton'
import './ProfileBlockSkeleton.css'

const ProfileBlockSkeleton = () => (
  <div className="profile-skeleton">
    <Skeleton className="profile-skeleton__title" />

    <Skeleton className="profile-skeleton__avatar" />

    <div className="profile-skeleton__info">
      <Skeleton className="profile-skeleton__name" />
      <Skeleton className="profile-skeleton__nickname" />
      <Skeleton className="profile-skeleton__subscription" />
    </div>

    <Skeleton className="profile-skeleton__button" />

    <div className="profile-skeleton__orders">
      <Skeleton className="profile-skeleton__orders-title" />
      <Skeleton className="profile-skeleton__order-row" />
      <Skeleton className="profile-skeleton__order-row" />
    </div>
  </div>
)

export default ProfileBlockSkeleton
