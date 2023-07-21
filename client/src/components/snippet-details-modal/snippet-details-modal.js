import React, {useContext, useEffect, useState} from 'react';
import './snippet-details-modal.scss'
import Button from '../button';
import useHttpServices from '../../hooks/useHttpServices';
import Comment from '../comment';
import Date from '../date';
import Iframe from '../iframe';
import NavLink from '../nav-link';
import {arrowImg} from '../../assets/images';
import {useAlert} from 'react-alert';
import {AuthContext} from '../../context/auth-context';
import UserMenu from '../user-menu';


export default function SnippetDetailsModal({snippet, hideSnippet}) {
  const {token} = useContext(AuthContext);
  const alert = useAlert();

  const [details, setDetails] = useState({
    code: {html: '', css: '', js: ''},
    keywords: []
  });

  const {
    findSnippetDetails,
    findSnippetComments,
    snippetViewAnalytics,
    addComment,
    addPin,
    deletePin
  } = useHttpServices();

  const [comments, setComments] = useState({
    userComment: '',
    commentsList: []
  });

  useEffect(async () => {
    try {
      const details = await findSnippetDetails.request(snippet._id);
      setDetails({...details});

      const commentsList = await findSnippetComments.request(snippet._id);
      setComments({userComment: '', commentsList});

    } catch (e) {
      alert.error(e.message);
    }

    const timeoutViewAnalytic = setTimeout(async () => {
      try {
        await snippetViewAnalytics.request(snippet._id);
      } catch (e) {
        console.log(e);
      }
    }, 20 * 1000);

    return () => clearTimeout(timeoutViewAnalytic);
  }, []);


  const onCommentChange = (e) => {
    setComments({...comments, userComment: e.target.value});
  };

  const onCommentAdd = async () => {
    if (!comments.userComment.trim()) return;
    try {
      const message = await addComment.request(snippet._id, comments.userComment.trim());
      const commentsList = await findSnippetComments.request(snippet._id);
      setComments({userComment: '', commentsList});
      alert.success(message);
    } catch (e) {
      alert.error(e.message);
    }
  };

  const onAddPin = async () => {
    try {
      const message = await addPin.request(snippet._id);
      setDetails({...details, pinned: true});
      alert.success(message);
    } catch (e) {
      alert.error(e.message);
    }
  };

  const onRemovePin = async () => {
    try {
      const message = await deletePin.request(snippet._id);
      setDetails({...details, pinned: false});
      alert.success(message);
    } catch (e) {
      alert.error(e.message);
    }
  };

  const onCommentDelete = (commentId) => {
    const filteredComments = comments.commentsList.filter(comment => comment._id !== commentId);
    setComments({ ... comments, commentsList: filteredComments });
  };

  return (
    <div className='snippet-details-modal'>

      <Button
        img={arrowImg}
        className='hide-snippet-arrow'
        onClick={hideSnippet}
      />


      <div className='content'>

        <header className='header'>

          <div className='author'>
            <img
              src={snippet.user.avatar}
              className='avatar'
              alt='avatar'
            />
            <span className='name'>{snippet.name}</span>
            <NavLink
              noStyle={true}
              to={`/profile/${snippet.user.username}`}>
              @{snippet.user.username}
            </NavLink>
          </div>

          <div className='actions'>
            {token &&
            <Button
              loading={addPin.loading || deletePin.loading}
              onClick={details.pinned ? onRemovePin : onAddPin}
            >
              {!details.pinned && token && <span>Закрепить</span>}
              {details.pinned && token && <span>Открепить</span>}
            </Button>
            }

            <Button>
              <NavLink to={`/editor/${snippet.user.username}/${snippet._id}`}>Редактор</NavLink>
            </Button>
          </div>

        </header>

        <Iframe
          html={details.code.html}
          css={details.code.css}
          js={details.code.js}
        />

        {
          token &&
          <div className='comment-form'>
            <textarea
              placeholder={`Напишите, что вы думаете о ${snippet.name}`}
              value={comments.userComment}
              onChange={onCommentChange}
            />
            <Button onClick={onCommentAdd} loading={addComment.loading}>
              <span>Отправить</span>
            </Button>
          </div>
        }

        {
          !token &&
          <div className='auth-callout'>
            <div className='wrapper'>
              Хотите оставить комментарий?
              <UserMenu/>
            </div>
          </div>
        }

        <div className='info'>

          <p className='description'>
            {details.description}
          </p>

          <div className='keywords'>
            {details.keywords && details.keywords.map(keyword => <Button>{keyword}</Button>)}
          </div>

          <span className='date'>
              Создано <Date date={details.createdAt} type='default'/>
          </span>

          <span className='date'>
              Обновлено <Date date={details.updatedAt} type='default'/>
          </span>

        </div>

        <div className='comment-list'>
          <span className='comment-count'>Комментариев {comments.commentsList.length}</span>

          {
            comments.commentsList.map(comment =>
              <Comment
                comment={comment}
                snippetId={snippet._id}
                onCommentDelete={onCommentDelete}
              />)
          }

        </div>
      </div>
    </div>
  )
}