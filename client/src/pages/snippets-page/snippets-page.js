import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import './snippets-page.scss';
import useHttpServices from '../../hooks/useHttpServices';
import NavLink from '../../components/nav-link';
import SnippetsList from '../../components/snippets-list';
import {AuthContext} from '../../context/auth-context';
import ToggleSwitch from '../../components/toggle-switch';
import Button from '../../components/button';

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);

  const auth = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();

  const {
    findUserSnippets,
    findSnippets,
    findPins
  } = useHttpServices();

  useEffect(async () => {
    let snippets = [];

    if (location.pathname === '/your-snippets') {
      snippets = await findUserSnippets.request(location.search);

    } else if (location.pathname === '/your-pins') {
      snippets = await findPins.request(location.search);

    } else if (location.pathname === '/search') {
      snippets = await findSnippets.request(location.search);
    }

    setSnippets(snippets);
  }, [location.pathname, location.search]);


  const onToggleSwitch = async (toggled) => {
    const params = new URLSearchParams(location.search);
    params.set('order', toggled ? 'top' : 'recent');
    history.push({
      pathname: location.pathname,
      search: params.toString()
    })
  };

  const onEditorButtonClick = () => {
    history.push('/editor');
  };

  return (
    <div className='snippets-page'>

      <nav className='navigation'>
        <div className='links'>
          {auth.token && <NavLink force={false} to='/your-snippets'>Сниппеты</NavLink>}
          {auth.token && <NavLink force={false} to='/your-pins'>Закрепленные</NavLink>}
          {<NavLink force={false} to='/search'>Поиск</NavLink>}
        </div>
        <div className='toggle-wrapper'>
          <ToggleSwitch
            onToggle={onToggleSwitch}
            checked={location.search.includes('order=top')}
          >
            <span>Недавние</span>
            <span>Популярные</span>
          </ToggleSwitch>

          <Button className='go-editor-button' onClick={onEditorButtonClick}>
            <span>Перейти в редактор</span>
          </Button>
        </div>
      </nav>

      {findSnippets.loading && <h1>Подождите...</h1>}

      <SnippetsList
        snippets={snippets}
        setSnippets={setSnippets}
        loading={findSnippets.loading || findUserSnippets.loading || findPins.loading}
      />
    </div>
  )
}
