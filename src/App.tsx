import React from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import './App.css';
import { MdState } from './states/state';
import Editor from './components/Editor';

const mapStateToProps = (state: MdState) => {
  return {
    title: state.title,
    mdText: state.text
  };
};

const App = () => {
  // eslint-disable-next-line
  const openVersionWebsite = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target && e.target.value) {
      window.location.href = e.target.value;
    }
  };

  const meta = {
    title: 'MD Editor with PDF Generator',
    description: 'PDF作成機能を備えたMarkdownエディタです',
    url: 'https://chonai-flora.github.io/',
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
            { property: 'og:url', content: `${meta.url}${meta.name}/` },
            { property: 'og:image', content: `${meta.url}${meta.name}/ogp.png` },
            { property: 'og:description', content: meta.description },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:image', content: `${meta.url}${meta.name}/ogp.png` },
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

export default connect(mapStateToProps)(App);