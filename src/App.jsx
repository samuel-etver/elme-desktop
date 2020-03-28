import React from 'react';
import logo from './logo.svg';
import './App.css';
import ValuePane from './components/ValuePane.jsx';
const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
/*  <ValuePane caption = {{text: 'aaa'}}
             value   = {{text: 'bbb'}}
             units   = {{text:'mm'}} />*/

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit this <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React {ipcRenderer.toString()}
        </a>
      </header>
    </div>
  );
}

export default App;
