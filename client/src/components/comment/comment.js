import React, {useState} from 'react';
import './comment.scss';
import {cloudImg} from '../../assets/images';
import Date from '../date';
import Button from '../button';
import useHttpServices from '../../hooks/useHttpServices';
import NavLink from '../nav-link';
import {useAlert} from 'react-alert';

export default function Comment({snippetId, comment, onCommentDelete}) {

  const alert = useAlert();
  const {deleteComment} = useHttpServices();
  const [deleteActive, setDeleteActive] = useState(false);

  const onMouseEnter = () => {
    if (comment.isYour) {
      setDeleteActive(true)
    }
  };

  const onMouseLeave = () => {
    setDeleteActive(false)
  };

  const onDelete = async () => {
    if (comment.isYour) {
      try {
        const message = await deleteComment.request(snippetId, comment._id);
        onCommentDelete(comment._id);
        alert.success(message);
      } catch (e) {
        alert.error(e.message);
      }
    }
  };

  return (
    <div
      className='Comment'
      key={comment._id}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >

      <img src={comment.user_avatar} className='avatar' alt='avatar'/>

      <NavLink
        className='username'
        noStyle={true}
        to={`/profile/${comment.username}`}
      >
        @{comment.username}
      </NavLink>

      <span className='date'>
        <Date date={comment.date} type='from-now'/>
      </span>

      <p className='text'>{comment.text}</p>

      <Button onClick={onDelete} className={`${deleteActive ? 'active' : ''}`}>X</Button>

    </div>
  );
}