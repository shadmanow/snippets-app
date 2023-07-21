import React from 'react';
import './snippet-card.scss'

import {useModal} from 'react-modal-hook';
import {useParams} from 'react-router-dom';
import SnippetDetailsModal from '../snippet-details-modal';
import Button from '../button';
import {commentImg, viewImg} from '../../assets/images';
import NavLink from '../nav-link';
import useHttpServices from '../../hooks/useHttpServices';
import {useAlert} from 'react-alert';

export default function SnippetCard({snippet, onDelete}) {
  const params = useParams();
  const alert = useAlert();
  const {deleteSnippet} = useHttpServices();

  const [showSnippet, hideSnippet] = useModal(() => (
    <SnippetDetailsModal snippet={snippet} hideSnippet={hideSnippet}/>
  ));

  const onDeleteClick = async () => {
    try {
      const deleteIt = window.confirm(`Вы действительно хотите удалить ${snippet.name}?`);
      if (deleteIt) await deleteSnippet.request(snippet._id);
      onDelete(snippet._id);
      alert.success('Сниппет удален');
    } catch (e) {
      alert.error(e.message);
    }
  };

  return (
    <div className='snippet-card'>

      <span className='hover-text-open' onClick={showSnippet}>Открыть</span>
      { snippet.canDeleted && <span className='hover-text-delete' onClick={onDeleteClick}>Удалить</span> }

      <img
        src={snippet.img}
        className='snippet-img'
        alt='snippet-img'
      />

      {
        !params.username &&
        <>
          <img
            src={snippet.user.avatar}
            className='user-avatar'
            alt='user-avatar'
          />
          <NavLink
            to={`/profile/${snippet.user.username}`}
            className='user-username'
          >
            @{snippet.user.username}
          </NavLink>
        </>
      }

      <span className='snippet-name'>{snippet.name}</span>

      <footer className='snippet-info'>
        <Button img={viewImg}>{snippet.views}</Button>
        <Button img={commentImg}>{snippet.comments}</Button>
      </footer>
    </div>
  )
}