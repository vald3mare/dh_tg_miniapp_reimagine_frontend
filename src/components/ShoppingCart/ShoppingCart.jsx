import cart from '../../assets/shopping-cart.svg';
import './ShoppingCart.css'

const ShoppingCart = () => {
    return (
        <div className='shopping-cart'>
            <img src={cart} alt="" />
        </div>
    );
}

export default ShoppingCart;
