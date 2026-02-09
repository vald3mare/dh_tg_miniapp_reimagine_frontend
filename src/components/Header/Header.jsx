import React from 'react';
import UserPreview from '../UserPreview/UserPreview';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import Notify from '../Notify/Notify';
import './Header.css';
import SearchLabel from '../SearchLabel/SearchLabel';   

const Header = () => {
    return (
        <header className='header'>
            <div className='header__container'>
                <UserPreview />
                <div className='header__spacer'>
                    <ShoppingCart />
                    <Notify />
                </div>
            </div>
            <div className='header__container header__container_last'>
                <SearchLabel />
            </div>
      </header>
    );
}

export default Header;
