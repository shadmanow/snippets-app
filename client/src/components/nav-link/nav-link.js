import React, {useEffect, useState} from 'react'
import './nav-link.scss';
import {Link, useLocation} from 'react-router-dom';

export default function NavLink(props) {
  const location = useLocation();
  const [to, setTo] = useState('');

  useEffect(() => {
    if (props.force === false) {
      setTo({...location, pathname: props.to})
    } else {
      setTo(props.to);
    }
  }, [location, props.to, props.force]);

  return (
    <Link
      onClick={props.onClick ? props.onClick : null}

      className={`NavLink 
      ${props.className ? props.className : ''} 
      ${location.pathname === props.to && !props.noStyle? 'active' : ''}`}
      target={props.target ? props.target : null}
      to={to}
    >
      {props.children}
    </Link>
  )
}