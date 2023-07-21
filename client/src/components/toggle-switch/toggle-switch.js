import React from 'react';
import './toggle-switch.scss';

export default function ToggleSwitch(props) {
  return (
    <div className='ToggleSwitch'>
      { props.children[0] }
      <label className='switch'>
        <input type='checkbox' onChange={(e) => props.onToggle(e.target.checked)}
          checked={props.checked}
        />
        <span className='slider' />
      </label>
      { props.children[1] }
    </div>
  );

}