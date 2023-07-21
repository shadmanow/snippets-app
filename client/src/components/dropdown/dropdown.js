import React, {useState} from 'react';
import './dropdown.scss';

export default function Dropdown(props) {
  const [active, setActive] = useState(false);

  return (
    <div className={`Dropdown ${props.className ? props.className : ''}`}>
      <div onClick={() => setActive(!active)}>{props.children[0]}</div>
      <div className={`DropdownContent ${active ? 'active' : ''}`}>
        {props.children.slice(1)}
      </div>
    </div>
  )
}