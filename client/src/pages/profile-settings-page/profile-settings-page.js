import React, {useContext, useState} from 'react';
import Button from '../../components/button';
import useHttpServices from '../../hooks/useHttpServices';
import {useAlert} from 'react-alert';
import ImageCrop from '../../components/image-crop/image-crop';
import {AuthContext} from '../../context/auth-context';

export default function ProfileSettingsPage() {
  const auth = useContext(AuthContext);
  const alert = useAlert();

  const {
    changeProfile,
    changeAvatar
  } = useHttpServices();

  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    banner: '',
    contactLink: '',
    ...auth.user
  });

  const inputHandler = e => setProfile({...profile, [e.target.name]: e.target.value});

  const onAboutSave = async () => {
    try {
      const {name, bio} = profile;
      await changeProfile.request({ name, bio });
      auth.setUser({ ...auth.user, name, bio });
      alert.success('Имя пользователя и описание изменены');
    } catch (e) {
      console.log(e.message);
      alert.error('Что-то пошло не так');
    }
  };

  const onContactLinkSave = async () => {
    try {
      const {contactLink} = profile;
      await changeProfile.request({ contactLink });
      auth.setUser({ ...auth.user, contactLink });
      alert.success('Контактный адрес изменен');
    } catch (e) {
      console.log(e.message);
      alert.error('Что-то пошло не так');
    }
  };

  const onAvatarSave = async (img) => {
    try {
      const uri = await changeAvatar.request(img);
      auth.setUser({ ...auth.user, avatar: `${uri}?${Date.now()}` });
      alert.success('Изображение профиля изменено');
    } catch (e) {
      console.log(e.message);
      alert.error('Что-то пошло не так');
    }
  };

  return (
    <div className='settings profile-settings'>

      <section className='section'>
        <span className='section-title'>Изображение профиля</span>
        <span className='section-description'>Данное изображение будут видеть все пользователи</span>
        <div className='section-content'>
          <ImageCrop onUpload={onAvatarSave}/>
        </div>
      </section>

      <section className='section'>
        <span className='section-title'>О вас</span>
        <span className='section-description'>Расскажите о себе немного поподробнее</span>
        <div className='section-content'>

          <div className='input-wrapper'>
            <span className='input-title'>Имя</span>
            <input
              type='text'
              name='name'
              value={profile.name}
              onChange={inputHandler}
            />
          </div>

          <div className='input-wrapper'>
            <span className='input-title'>Биография</span>
            <textarea
              name='bio'
              value={profile.bio}
              onChange={inputHandler}
            />
          </div>
          <Button onClick={onAboutSave}>
            <span>Сохранить изменения</span>
          </Button>
        </div>
      </section>

      <section className='section'>
        <span className='section-title'>Ссылка в профиле</span>
        <span className='section-description'>Вы можете добавить контактный адрес, например: http://vk.com/you</span>
        <div className='section-content'>
          <div className='input-wrapper'>
            <span className='input-title'>Контактный адрес</span>
            <input
              type='text'
              name='contactLink'
              value={profile.contactLink}
              onChange={inputHandler}
            />
          </div>

          <Button onClick={onContactLinkSave}>
            <span>Сохранить контактный адрес</span>
          </Button>
        </div>
      </section>
    </div>
  )
}