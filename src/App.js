import React, {Component} from 'react';
import logo from './logo.svg';
import './css/App.css';

const ipcRenderer = window.ipcRenderer

ipcRenderer.on('text', (event, text) => {
  console.log(text)
  textRef.current.innerHTML=text;
});

ipcRenderer.on('command', (event, command) => {
  console.log('command: ' + command);
  commands[command]();
});

const commands = {
  pi: () => {},
  up: () => {},
  phi: () => {},
  left: () => {},
  enter: () => {},
  right: () => {},
  beta: () => {},
  down: () => {},
  lambda: () => {}
}



let textRef = React.createRef()

class App extends Component {
  state = {}

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
        <div ref={textRef}>
        
        </div>
      </div>
    );
  }
}

export default App;
  