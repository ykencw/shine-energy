import React from 'react';
import './App.css';

class App extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      readings: {}
    };
  }

  componentDidMount() {

  }

  handleInput = event => {
    this.setState(() => ({
      readings: {
        gas: event.target.value
      }
    }));
  }

  render() {
    return (
      <div className="App">
        <label for='gas'>Gas Reading:</label>
        <input name='gas' type='number' 
          onChange={this.handleInput} />
        <input type='number' />
      </div>
    );
  }
}

export default App;
