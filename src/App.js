import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      readings: { 
        gasPrev: 11000, gas: 0, gasUsed: 0, gasBill: 0,
        elecPrev: 11000, elec: 0, elecUsed: 0, elecBill: 0 }
    };
  }

  componentDidMount() {
    fetch(`https://shine-energy.netlify.com/.netlify/functions/meter-readings`, { mode: 'no-cors'} )
      .then(res => {
        return res.ok ? res.json() : Promise.reject()
      })
      .then(res => {
        console.log('This is our response  ' + res);
        this.setState(() => ({
          readings: { 
            gasPrev: res.gas.reading,
            elecPrev: res.electricity.reading
          }
        }))
      }).catch(() => {
        console.log("Our fetch request is failing");
      });
  }

  handleInput = event => {
    const reading = +event.target.value;
    const name = event.target.name;
    this.setState(() => ({
      readings: {
        [name + 'Prev']: this.state.readings[name + 'Prev'],
        [name]: reading,
        [name + 'Used']: reading - this.state.readings[name + 'Prev'],
        [name +'Bill']: (100 * 10) + ((reading - this.state.readings[name + 'Prev'] - 100) * 20)
      }
    }));
  }

  render() {
    return (
      <div className="App">
        <label htmlFor='gas'>Gas Reading:</label>
        <input name='gas' type='number'
          onChange={e => this.handleInput(e)} />
        
        <div className='container'>
          <div className='item'>Gas Reading Entered: {this.state.readings.gas}</div>
          <div className='item'>Gas units used => Current: {this.state.readings.gas} Previous: {this.state.readings.gasPrev} => Used: {this.state.readings.gasUsed}</div>
          <div className='item'>Gas bill amount => {this.state.readings.gasBill}p (£{this.state.readings.gasBill / 100})</div>
        </div>

        <label htmlFor='elec'>Electricity Reading:</label>
        <input name='elec' type='number' 
          onChange={e => this.handleInput(e)}/>
        <div className='container'>
          <div className='item'>Electricty Reading Entered: {this.state.readings.elec}</div>
          <div className='item'>Electricty units used => Current: {this.state.readings.elec} Previous: {this.state.readings.elecPrev} => Used: {this.state.readings.elecUsed}</div>
          <div className='item'>Electricty bill amount => {this.state.readings.elecBill}p (£{this.state.readings.elecBill / 100})</div>
        </div>
      </div>
    );
  }
}

export default App;
