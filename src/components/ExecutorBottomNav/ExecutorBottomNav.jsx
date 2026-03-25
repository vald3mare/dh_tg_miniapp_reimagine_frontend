import HomeIcon from '@mui/icons-material/Home'
import ListAltIcon from '@mui/icons-material/ListAlt'
import PersonIcon from '@mui/icons-material/Person'
import BottomNav from '../BottomNav/BottomNav'

const EXECUTOR_TABS = [
  { path: '/executor/home',    label: 'Главная', icon: HomeIcon },
  { path: '/executor/orders',  label: 'Заявки',  icon: ListAltIcon },
  { path: '/executor/profile', label: 'Профиль', icon: PersonIcon },
]

const ExecutorBottomNav = () => (
  <BottomNav tabs={EXECUTOR_TABS} pillId="active-pill-executor" />
)

export default ExecutorBottomNav
