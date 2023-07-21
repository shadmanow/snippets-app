import React from 'react';
import './button.scss'
import Loading from '../loading';

export default function Button(props) {

  return (
    <button

      onClick={props.onClick}
      disabled={props.loading}
      className={`Button${props.active? ' active' : ''} ${props.className ? props.className : ''}`}
    >
      {props.img && !props.loading?
        <img
          style={props.children ? {} : {marginRight: 0}}
          src={props.img}
          alt={props.alt ? props.alt : ''}
        /> : null}
      { props.loading && <Loading width={22} height={22}/> }
      {props.children}
    </button>
  )
}