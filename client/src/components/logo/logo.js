import React from 'react';
import { useHistory } from 'react-router';
import './logo.scss'

export default function Logo() {
  const history = useHistory();
  const onClick = () => {
    history.push('/')
  };

  return (
    <div className='Logo' onClick={onClick}>
      <span>{`</>`}</span>
      <span>MySnippet</span>
    </div>
  )
}