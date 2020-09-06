import React, {Component} from 'react';
import logo from './logo.svg';
import './css/App.css';

const ipcRenderer = window.ipcRenderer

ipcRenderer.on('text', (event, text) => {
  console.log(text)
  boxRef.current.querySelector('p').innerHTML=text;
});

ipcRenderer.on('command', (event, command) => {
  console.log('command: ' + command);
  commands[command]();
});

const mvLen = 10;

const commands = {
  pi: () => {
    moveBox(-mvLen, -mvLen);
  },
  up: () => {
    moveBox(0, -mvLen);
  },
  phi: () => {
    moveBox(mvLen, -mvLen);
  },
  left: () => {
    moveBox(-mvLen, 0);
  },
  enter: () => {
    moveBox((Math.random() - .5) * 10 * mvLen, (Math.random() - .5) * 10 * mvLen);
  },
  right: () => {
    moveBox(mvLen, 0);
  },
  beta: () => {
    moveBox(-mvLen, mvLen);
  },
  down: () => {
    moveBox(0, mvLen);
  },
  lambda: () => {
    moveBox(mvLen, mvLen);
  }
}

let boxPos = {
  x: window.innerWidth / 2 - 100,
  y: window.innerHeight / 2 - 50,
}

const moveBox = (x, y) => {
  let maxW = window.innerWidth - 100;
  let maxH = window.innerHeight - 50;
  boxPos.x = Math.max(0, Math.min(maxW, boxPos.x + x));
  boxPos.y = Math.max(0, Math.min(maxH, boxPos.y + y));
  boxRef.current.style.left = `${boxPos.x}px`
  boxRef.current.style.top = `${boxPos.y}px`
}


const boxRef = React.createRef()

class App extends Component {
  state = {
  }

  sendMessage = (str) => {
    console.log('sending info: ' + str)
    ipcRenderer.send('info', str);
  } 








  componentDidMount() {
    this.sendMessage('app loaded!')
  }

  render() {
    return (
      <div className="App">
        <div className='example-box' ref={boxRef}><p></p>
        </div>
      </div>
    );
  }
}

export default App;
  