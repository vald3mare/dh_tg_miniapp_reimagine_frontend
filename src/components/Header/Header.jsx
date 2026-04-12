import UserPreview from '../UserPreview/UserPreview';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import Notify from '../Notify/Notify';
import './Header.css';

/*
 * layoutId="header" убран — layout-анимации между страницами вызывали
 * перерасчёт layout всего дерева и были заметны на мобиле.
 * react.dev/learn/preserving-and-resetting-state — анимации перехода
 * лучше делать через PageTransition, а не через layoutId на обёртках.
 */
const Header = () => (
  <header className="header">
    <UserPreview />
    <div className="header__actions">
      <div className="header__action-btn header__action-btn--notify">
        <Notify />
      </div>
      <div className="header__action-btn header__action-btn--cart">
        <ShoppingCart />
      </div>
    </div>
  </header>
);

export default Header;
