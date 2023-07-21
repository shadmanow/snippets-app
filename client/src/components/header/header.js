import React, {useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import './header.scss';
import UserMenu from '../user-menu';
import Logo from '../logo';
import {searchImg} from '../../assets/images';

export default function Header() {
  const history = useHistory();
  const location = useLocation();
  const [searchValue, setSearchValue] = useState('');

  const onSearchKeyDown = (e) => {
    if (e.key === 'Enter') {

      let pathname = location.pathname;
      const params = new URLSearchParams(location.search);
      params.set('keywords', searchValue);

      if (pathname !== '/search' &&
        pathname !== '/your-snippets' &&
        pathname !== '/your-pins') pathname = '/search';

      history.push({
        pathname,
        search: params.toString()
      })
    }
  };

  return (
    <header className='Header'>
      <Logo/>
      <div className='search-wrapper'>
        <div className='search-box'>
          <img
            className='search-icon'
            src={searchImg}
            alt='search-img'/>
          <input
            className='search-input'
            autoComplete='off'
            placeholder='Найти сниппет...'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={onSearchKeyDown}
          />
        </div>
      </div>

      <UserMenu/>
    </header>
  )
}
