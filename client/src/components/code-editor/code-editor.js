import React, {useEffect, useState} from 'react';
import './code-editor.scss'

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/theme/monokai.css';
import 'codemirror/theme/oceanic-next.css';
import 'codemirror/theme/the-matrix.css';
import 'codemirror/theme/twilight.css';
import CodeMirror from 'react-codemirror';

export default function CodeEditor({theme, fontSize, onCode, code, lang, title}) {

  const [show, setShow] = useState(false);

  const options = {
    lineNumbers: true,
    lineWrapping: true,
    tabSize: 2,
    theme,
    mode: lang,
    viewportMargin: Infinity,
  };

  useEffect(() => {
    if (code) {
      setShow(true);
    }
  }, [code]);

  const onChange = (value) => {
    if (onCode) onCode(value);
  };

  return (
    <div className={`CodeEditor ${theme}`}>
      { title && <header className='CodeEditor__header'>{title}</header> }
      <div className="CodeEditor__editor">
        {
          (code || show) &&
          <CodeMirror
            value={code}
            onChange={value => onChange(value)}
            className={`fz${fontSize}`}
            options={options}
          />
        }
      </div>
    </div>
  )
}