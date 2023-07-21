import React, {useContext, useState} from 'react';
import './editor-settings-page.scss';
import Button from '../../components/button';
import CodeEditor from '../../components/code-editor';
import {AuthContext} from '../../context/auth-context';
import useHttpServices from '../../hooks/useHttpServices';
import {useAlert} from 'react-alert';


export default function EditorSettingsPage() {
  const auth = useContext(AuthContext);
  const alert = useAlert();
  const {changeProfile} = useHttpServices();

  const [styles, setStyles] = useState({
    theme: auth.user.editor.theme,
    fontSize: auth.user.editor.fontSize
  });
  const [lang, setLang] = useState('javascript');

  const onLangChange = (lang) => {
    setLang(lang);
  };

  const onThemeChange = (e) => {
    setStyles({...styles, theme: e.target.value});
  };

  const onFontSizeChange = (e) => {
    setStyles({...styles, fontSize: e.target.value});
  };

  const onSaveStyle = async () => {
    try {
      await changeProfile.request({editor: {...styles}});
      auth.setUser({...auth.user, editor: {...styles}});
      alert.success('Настройка редактора сохранена')
    } catch (e) {
      alert.error(e.message)
    }
  };

  return (
    <div className='settings editor-settings'>

      <section className='section'>

        <span className='section-title'>
          Editor preview
        </span>

        <span className='section-description'>
          Choose your theme and fonts below and see how they look here.
        </span>

        <div className='section-content-editor'>
          <Button
            active={lang === 'javascript'}
            onClick={() => onLangChange('javascript')}
          >JS</Button>

          <Button
            active={lang === 'css'}
            onClick={() => onLangChange('css')}
          >CSS</Button>

          <Button
            active={lang === 'xml'}
            onClick={() => onLangChange('xml')}
          >HTML</Button>

          <CodeEditor
            code='//code'
            theme={styles.theme}
            lang={lang}
            fontSize={styles.fontSize}
          />
        </div>

      </section>

      <section className='section'>
        <div className='section-content themes'>
          <input
            name="theme"
            type="radio"
            value='monokai'
            checked={styles.theme === 'monokai'}
            onClick={onThemeChange}
            onChange={e => {
            }}
            id='radio-monokai'
          />
          <label htmlFor='radio-monokai'>Monokai</label>

          <input
            name="theme"
            type="radio"
            value='oceanic-next'
            checked={styles.theme === 'oceanic-next'}
            onClick={onThemeChange}
            onChange={e => {
            }}
            id='radio-oceanic'
          />
          <label htmlFor='radio-oceanic'>Oceanic</label>

          <input
            name="theme"
            type="radio"
            value='the-matrix'
            checked={styles.theme === 'the-matrix'}
            onClick={onThemeChange}
            onChange={e => {
            }}
            id='radio-matrix'
          />
          <label htmlFor='radio-matrix'>Matrix</label>

          <input
            name="theme"
            type="radio"
            value='twilight'
            checked={styles.theme === 'twilight'}
            onClick={onThemeChange}
            onChange={e => {
            }}
            id='radio-twilight'
          />
          <label htmlFor='radio-twilight'>Twilight</label>
        </div>
      </section>

      <section className='section'>
        <div className='section-content'>
          <div className='input-wrapper'>
            <span className='section__content__title'>Font Size</span>
            <select onChange={onFontSizeChange} defaultValue={styles.fontSize}>
              <option>15</option>
              <option>16</option>
              <option>17</option>
              <option>18</option>
              <option>19</option>
              <option>20</option>
              <option>26</option>
            </select>
          </div>

          <Button onClick={onSaveStyle}>
            <span>Save Editor Styles</span>
          </Button>
        </div>
      </section>

    </div>
  )
}