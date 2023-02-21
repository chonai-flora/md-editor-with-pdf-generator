import React from 'react';
import './App.css';
import Helmet from 'react-helmet';

import Editor from './components/Editor';

const App = () => {
  // eslint-disable-next-line
  const openVersionWebsite = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target && e.target.value) {
      window.location.href = e.target.value;
    }
  };

  const meta = {
    title: 'Markdown Editor with PDF Generator',
    description: 'PDF作成機能を備えたMarkdownエディタです',
    domain: 'https://chonai-flora.github.io',
    name: 'md-editor-with-pdf-generator'
  };

  return (
    <div>
      <header className='header'>
        <h1>
          Markdown Editor<br />
          with<br />
          PDF Generator
        </h1>
        <Helmet
          title={meta.title}
          meta={[
            { name: 'description', content: meta.description },
            { property: 'og:title', content: meta.title },
            { property: 'og:type', content: 'website' },
            { property: 'og:url', content: `${meta.domain}${meta.name}/` },
            { property: 'og:image', content: `${meta.domain}${meta.name}/ogp.png` },
            { property: 'og:description', content: meta.description },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:image', content: `${meta.domain}${meta.name}/ogp.png` },
          ]}
        />
      </header>

      <div className='warpper'>
        <Editor />
      </div>

      <footer className='footer'>
        <hr />
        Copyright (c) 2020 uiw<br />
        Released under the&nbsp;
        <a href='https://github.com/uiwjs/react-md-editor/blob/master/LICENSE'>
          MIT license
        </a>
      </footer>
    </div>
  );
}

export default App;