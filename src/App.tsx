import React from 'react';
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

  return (
    <div>
      <header className='header'>
        <h1>
          MD Editor<br />
          with<br />
          PDF Generator
        </h1>
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