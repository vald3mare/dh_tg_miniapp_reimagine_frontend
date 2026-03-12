import React from 'react';
import UserPreview from '../UserPreview/UserPreview';
import ShoppingCart from '../ShoppingCart/ShoppingCart';
import Notify from '../Notify/Notify';
import './Header.css';
import SearchLabel from '../SearchLabel/SearchLabel';
import { motion } from 'framer-motion';

const Header = () => {
    return (
        <motion.header 
            className='header'
            layoutId="header"
        >
            <div className='header__container'>
                <UserPreview />
                <div className='header__spacer'>
                    <ShoppingCart />
                    <Notify />
                </div>
            </div>
            {/*<div className='header__container header__container_last'>
                <SearchLabel />
            </div>*/}
      </motion.header>
    );
}

export default Header;
