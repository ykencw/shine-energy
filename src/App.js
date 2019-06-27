import React from 'react';
import './App.css';

class App extends React.Component  {
  constructor(props) {
    super(props)
    this.state = {
      readings: { gas: 0, gasUsed: 0, gasBill: 0 }
    };
  }

  componentDidMount() {

  }

  handleInput = event => {
    const reading = event.target.value;
    this.setState(() => ({
      readings: {
        gas: reading,
        gasUsed: reading - 11000,
        gasBill: (100 * 10) + ((reading - 11000 )* 20)
      }
    }));
  }

  render() {
    return (
      <div className="App">
        <label for='gas'>Gas Reading:</label>
        <input name='gas' type='number' 
          onChange={e => this.handleInput(e)} />
        <input type='number' />

        <div>Gas Reading Entered: {this.state.readings.gas}</div>
        <div>Gas units used => Current: {this.state.readings.gas} Previous: 11000 => Used: {this.state.readings.gasUsed}</div>
        <div>Gas bill amount => {this.state.readings.gasBill}p</div>
      </div>
    );
  }
}

export default App;
