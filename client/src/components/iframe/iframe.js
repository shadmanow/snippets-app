import React, {useEffect, useState} from 'react';
import './iframe.scss'

export default function Iframe({html, js, css, timeout}) {

  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    // const body = document.createElement('body');
    // body.innerHTML = html;
    //
    // const anchors = body.getElementsByTagName('a');
    // for (let anchor of anchors)
    //   anchor.target = '_blank';

    const _timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <base target="_parent">
          </head>
          <body>${html}</body>
          <style>${css}</style>
          <script>${js}</script>
        </html>
      `)
    }, timeout ? timeout : 1500);
    return () => clearTimeout(_timeout);
  }, [html, js, css, timeout]);

  return (
    <iframe
      id='result'
      srcDoc={srcDoc}
      allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; clipboard-read; clipboard-write"
      loading="lazy"
      sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
      scrolling="auto"
      allowFullScreen={true}
      allowtransparency="true"
      allowpaymentrequest="true"

      className='Iframe'
      title='Iframe'
    />
  )
}