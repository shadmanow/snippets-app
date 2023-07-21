import React from 'react';
import './loading.scss';
import Loader from 'react-loader-spinner';

export default function Loading({ text, width, height }) {
  return (
    <div className="Loading">
      <Loader
        type="Oval"
        color="#00BFFF"
        height={width? width: 100}
        width={height? height: 100}
        timeout={100000}
      />
      <span className='loading-text'>{text}</span>
    </div>
  )
}