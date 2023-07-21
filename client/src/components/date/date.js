import React from 'react';
import 'moment/locale/ru';
import moment from 'moment';

moment.locale('ru');

export default function Date({date, type}) {
  return (
    <>
      {type === 'from-now' && <span>{moment(date).startOf('minute').fromNow()}</span>}
      {type === 'default' && <span>{moment(date).format('LL')}</span>}
    </>
  )
}