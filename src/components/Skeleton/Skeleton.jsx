import './Skeleton.css'

const Skeleton = ({ width, height, borderRadius, className = '', style = {} }) => (
  <span
    className={`skeleton ${className}`}
    style={{ width, height, borderRadius, ...style }}
  />
)

export default Skeleton
