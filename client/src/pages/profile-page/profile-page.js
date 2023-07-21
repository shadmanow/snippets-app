import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import './profile-page.scss';
import SnippetsList from '../../components/snippets-list';
import useHttpServices from '../../hooks/useHttpServices';

export default function ProfilePage() {
  const params = useParams();
  const {findProfile, findSnippets} = useHttpServices();

  const [profile, setProfile] = useState({});
  const [snippets, setSnippets] = useState([]);

  useEffect(async () => {
    try {
      const profile = await findProfile.request(params.username);
      setProfile({...profile});

      const snippets = await findSnippets.request(params.username);
      setSnippets(snippets);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return (
    <div className='profile'>
      <header className='header'/>

      <div className='user-info'>
        <img className='user-avatar' src={profile.avatar} alt='user-avatar'/>
        <div className='user-name-wrapper'>
          <span className='name'>{profile.name}</span>
          <span className='username'>@{profile.username}</span>
        </div>
        <a className='user-link' href={profile.contactLink} target='_blank'>{profile.contactLink}</a>
        <p className='user-bio'>{profile.bio}</p>
      </div>

      <SnippetsList
        snippets={snippets}
        loading={findSnippets.loading}
        setSnippets={setSnippets}
      />
    </div>
  )
}