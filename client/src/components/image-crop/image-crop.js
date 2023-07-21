import React, {useContext, useRef, useState} from 'react';
import './image-crop.scss';

import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop from 'react-image-crop';

import Button from '../button';
import {AuthContext} from '../../context/auth-context';

export default function ImageCrop(props) {
  const {user} = useContext(AuthContext);
  const inputFile = useRef();

  const [file, selectFile] = useState(null);
  const [image, setImage] = useState(null);

  const [crop, setCrop] = useState({
    unit: 'px',
    minWidth: '100',
    minHeight: '100',
    keepSelection: true,
    disabled: true
  });

  const handleUpload = () => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height,
    );

    canvas.toBlob(props.onUpload);
    selectFile(null);
    setImage(null);
  };

  const handleFileInput = e => {
    selectFile(URL.createObjectURL(e.target.files[0]));
  };

  const handleFileUpload = () => {
    if (inputFile.current) {
      inputFile.current.click();
    }
  };

  return (
    <div className='ImageCrop'>
      {file && <ReactCrop
        className='ImageCropper'
        onImageLoaded={setImage}
        src={file}
        crop={crop}
        onChange={newCrop => setCrop(newCrop)}/>
      }

      {
        file &&
        <Button onClick={handleUpload}>
          <span>Загрузить</span>
        </Button>
      }

      {!file && <img className='user-avatar' src={user.avatar} alt=''/>}

      {!file && <>
        <Button onClick={handleFileUpload}>
          <span>Загрузить новое изображение</span>
        </Button>
        <input
          ref={inputFile}
          className='FileInput'
          accept="image/png, image/jpeg"
          type='file'
          onChange={handleFileInput}
        />
      </>
      }

    </div>
  )
}