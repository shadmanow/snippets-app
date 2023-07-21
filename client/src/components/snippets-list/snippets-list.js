import React from 'react';
import './snippets-list.scss';
import SnippetCard from '../snippet-card';
import Loading from '../loading';


export default function SnippetsList({snippets = null, loading = false, setSnippets}) {

  const onDelete = (id) => {
    const _snippets = snippets.filter(snippet => snippet._id !== id);
    setSnippets(_snippets);
  };

  return (
    <div className='SnippetsList'>
      {
        snippets &&
        snippets.map((snippet) => <SnippetCard
          key={snippet._id}
          snippet={snippet}
          onDelete={onDelete}
        />)
      }
      {loading && <Loading text='Сниппеты загружаются...'/>}
      {!loading && (!snippets || !snippets.length) && <h1>Сниппеты не найдены</h1>}
    </div>
  )
}