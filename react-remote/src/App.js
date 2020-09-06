import React, {Component} from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import './css/App.css';

const socket = io('http://192.168.0.11:5000', {path: '/remote'});

socket.on('info', info => {
  console.log('[Pi-TV]: ' + info)
});

/*

Events emitted:
  
  fullscreen

  message
    -any string

  command
    -pi
    -up
    -phi
    -left
    -enter
    -right
    -beta
    -down
    -lambda

*/


class App extends Component {
  
  sendMessage = (e) => {
    let formDataObj = Object.fromEntries(new FormData(e.target).entries());
    console.log(formDataObj);
    socket.emit('text', formDataObj.message);
    e.preventDefault();
  }
  
  sendCommand = (c) => {
    socket.emit('command', c);
  }
  
  fullscreen = () => {
    socket.emit('fullscreen');
  }
  
  render() {
    return (
      <div className="app">
        <button className='fullscreen' onClick={this.fullscreen}>Fullscreen</button>
        <div className='textfield-container'>
          <form onSubmit={this.sendMessage}>
            <input name='message' type='text' />
            <input type='submit' value='Ok' />
          </form>
        </div>
        <div className='buttons-container'>
          <div className='buttons'>
            {
              [
                {name: 'pi',     symbol: '\u03C0'},
                {name: 'up',     symbol: '\u25B2'},
                {name: 'phi',    symbol: '\u03C6'},
                {name: 'left',   symbol: '\u25C0'},
                {name: 'enter',  symbol: 'o'},
                {name: 'right',  symbol: '\u25B6'},
                {name: 'beta',   symbol: '\u03B2'},
                {name: 'down',   symbol: '\u25BC'},
                {name: 'lambda', symbol: '\u03BB'}
              ].map((but) => {
                return (
                  <div className={but.name} onClick={this.sendCommand.bind(null, but.name)}>{but.symbol}</div>
                )
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
