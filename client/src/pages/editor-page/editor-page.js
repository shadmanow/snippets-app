import React, {useContext, useEffect, useState} from 'react';
import {Prompt, useHistory, useParams} from 'react-router-dom';
import './editor-page.scss';

import {cloudImg, leftPanelImg, settingsImg, topPanelImg} from '../../assets/images';

import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/markdown/markdown';
import Button from '../../components/button';
import UserMenu from '../../components/user-menu';
import useHttpServices from '../../hooks/useHttpServices';
import SplitContainer from '../../components/split-container';
import Dropdown from '../../components/dropdown';
import ToggleSwitch from '../../components/toggle-switch';
import CodeEditor from '../../components/code-editor';
import {AuthContext} from '../../context/auth-context';
import Iframe from '../../components/iframe';
import Logo from '../../components/logo';
import NavLink from '../../components/nav-link';


export default function EditorPage() {
  const params = useParams();
  const history = useHistory();

  const {user, token} = useContext(AuthContext);

  const [editorSettings,] = useState({
    theme: user ? user.editor.theme : 'monokai',
    fontSize: user ? user.editor.fontSize : 15
  });

  const {
    findSnippetDetails,
    saveSnippet,
    updateSnippet
  } = useHttpServices();

  const [snippet, setSnippet] = useState({
    modified: false,
    canEdit: false,
    name: '',
    description: '',
    keywords: [],
    code: {js: '', css: '', html: ''}
  });

  const [splitView, setSplitView] = useState({
    mainSplit: 'horizontal',
    editorsSplit: 'vertical'
  });


  useEffect(async () => {
    console.log('!!');

    // Когда пользователь загрузил сниппет
    if (params.username && params.snippetId) {
      try {
        const details = await findSnippetDetails.request(params.snippetId);
        setSnippet({...details});
      } catch (e) {
        console.log(e);
      }
      console.log('!1');
      return;
    }


    // Когда пользователь создает сниппет
    if (token) {
      setSnippet({
        ...snippet,
        name: `Сниппет от ${user.username}`,
        code: {js: '//javascript ', css: '//styles', html: '//html'},
        canEdit: true
      });

      console.log('!2');
      return;
    }

    // Когда пользователь анонимный
    setSnippet({
      ...snippet,
      name: 'Сниппет от анонима',
      code: {js: '//javascript ', css: '//styles', html: '//html'},
    });

    console.log('!3');
  }, []);

  const onSaveHandler = async () => {
    if (snippet && snippet.canEdit && !snippet._id) {
      try {
        const data = await saveSnippet.request(snippet);
        history.push(`/editor/${user.username}/${data.snippetId}`);
        window.location.reload();
      } catch (e) {
        console.log(e);
      }
    }

    if (snippet && snippet.canEdit && snippet._id) {
      try {
        await updateSnippet.request(snippet);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onCodeChange = (fieldName, value) => {
    setSnippet({
      ...snippet,
      modified: !!snippet.canEdit,
      code: {
        ...snippet.code,
        [fieldName]: value
      }
    });
  };

  const onViewToggle = (value) => {
    setSplitView({
      editorsSplit: value ? 'horizontal' : 'vertical',
      mainSplit: value ? 'vertical' : 'horizontal'
    })
  };

  return (
    <div className='editor-page'>

      {
        snippet && snippet.modified && snippet.canEdit && snippet._id &&
        <Prompt message="Вы уверены, что хотите уйти? Изменения не сохранятся."/>
      }

      <header className='header'>
        <Logo/>

        <div className='snippet-info'>
          <span className='snippet-name'>{snippet.name}</span>
          {
            params.username &&
            <NavLink
              to={`/profile/${params.username}`}
              className='snippet-author'
            >@{params.username}
            </NavLink>
          }
        </div>


        {
          token && snippet.canEdit &&
          <Button
            img={cloudImg}
            value='Save'
            className='SaveButton'
            disabled={saveSnippet.loading || updateSnippet.loading}
            loading={saveSnippet.loading || updateSnippet.loading}
            onClick={onSaveHandler}
          >
            <span>Сохранить</span>
          </Button>
        }


        {
          token && snippet.canEdit &&
          <Dropdown className='SettingsButton'>
            <Button
              img={settingsImg}
              value='Settings'
            >
              <span>Настройки</span>
            </Button>
            <div className='form'>
              <div className='input-wrapper'>
                <span className='input-title'>Имя</span>
                <input
                  type="text"
                  value={snippet.name}
                  onChange={(e) => setSnippet({...snippet, name: e.target.value})}
                />
              </div>
              <div className='input-wrapper'>
                <span className='input-title'>Описание</span>
                <textarea
                  value={snippet.description}
                  onChange={(e) => setSnippet({...snippet, description: e.target.value})}
                />
              </div>
              <div className='input-wrapper'>
                <span className='input-title-keywords'>Ключевые слова</span>
                <span className='input-description'>
                  Ключевые слова указывается через запятую, например: auth, form
                </span>
                <input
                  type="text"
                  value={snippet.keywords.join(',')}
                  onChange={(e) => setSnippet({
                    ...snippet, keywords: e.target.value.split(',').map(k => k.trim())
                  })}
                />
              </div>
            </div>
          </Dropdown>
        }

        <Dropdown className='ViewButton'>
          <Button img={splitView.mainSplit === 'horizontal' ? leftPanelImg : topPanelImg}>
            <span>Вид</span>
          </Button>
          <ToggleSwitch onToggle={onViewToggle}>
            <img src={leftPanelImg} alt='left-panel'/>
            <img src={topPanelImg} alt='top-panel'/>
          </ToggleSwitch>
        </Dropdown>

        <UserMenu/>

      </header>

      <main className='main'>
        <SplitContainer
          direction={splitView.mainSplit}
          gutterSize={10}
          minSize={0}
          sizes={[25, 75]}
        >

          <SplitContainer direction={splitView.editorsSplit} gutterSize={6} minSize={40}>
            <CodeEditor
              lang='xml'
              code={snippet.code.html}
              theme={editorSettings.theme}
              fontSize={editorSettings.fontSize}
              title='HTML'
              onCode={(html) => onCodeChange('html', html)}
            />

            <CodeEditor
              lang='css'
              code={snippet.code.css}
              theme={editorSettings.theme}
              fontSize={editorSettings.fontSize}
              title='CSS'
              onCode={(css) => onCodeChange('css', css)}
            />
            <CodeEditor
              lang='javascript'
              code={snippet.code.js}
              theme={editorSettings.theme}
              fontSize={editorSettings.fontSize}
              title='JS'
              onCode={(js) => onCodeChange('js', js)}
            />
          </SplitContainer>

          <Iframe
            html={snippet.code.html}
            css={snippet.code.css}
            js={snippet.code.js}
          />
        </SplitContainer>
      </main>

    </div>
  )
}