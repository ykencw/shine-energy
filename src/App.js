import React from 'react';
import './App.scss';

// import './Utilities/KeyFrames.scss';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gas: {
        prev: 11000, current: 0, used: 0, bill: 0,
      },
      elec: {
        prev: 11000, current: 0, used: 0, bill: 0,
      }
    };
  }

  componentDidMount() {
    fetch(`https://cors-anywhere.herokuapp.com/shine-energy.netlify.com/.netlify/functions/meter-readings`, {
      headers: {
        "x-requested-with": "XMLHttpRequest",
        "origin": "https://google.com"

      }
    },
    )
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log('This is our response  ' + Object.entries(res));
        this.setState(() => ({
          gas: { prev: res.gas.reading, current: 0, used: 0, bill: 0 },
          elec: { prev: res.electricity.reading, current: 0, used: 0, bill: 0 },
          
        }))
      }).catch(err => {
        console.log("Our fetch request is failing, error: " + err);
      });
  }

  handleInput = event => {
    const reading = +event.target.value;
    const name = event.target.name;
    this.setState(() => ({
      [name]: {
        prev: this.state[name].prev,
        current: reading,
        used: reading - this.state[name].prev,
        bill: (100 * 10) + ((reading - this.state[name].prev - 100) * 20)
      }
    }));
  }

  render() {
    return (
      <div className="App">
        <h1 className='title'>SHINE ENERGY</h1>
        <h2 className='subtitle'>Your Account Summary</h2>

        <div className='container container1'>
          <div className='item'>
            <label htmlFor='gas'>Gas Reading:</label>
            <input name='gas' type='number'
              onChange={e => this.handleInput(e)} /></div>
          <div className='item'>Gas Reading Entered:
            <span>{this.state.gas.current}</span></div>
          <div className='item'>Gas units used =>

            <div className='used'>
              Current:
            <span>{this.state.gas.current}</span>
              <br />
              previous:
            <span>{this.state.gas.prev}</span> <br />Used:
            <span>{this.state.gas.used}</span>
            </div>

          </div>
          <div className='item'>Gas bill amount =>
            <span>{this.state.gas.bill}</span>p (£
            <span id='pound'>{this.state.gas.bill / 100}</span>)
          </div>
        </div>

        <div className='container'>
          <div className='item'>
            <label htmlFor='elec'>Electricity Reading:</label>
            <input name='elec' type='number'
              onChange={e => this.handleInput(e)} />
          </div>
          <div className='item'>Electricty Reading Entered: <span>{this.state.elec.current}</span></div>
          <div className='item'>Electricty units used =>

          <div className='used'>
              Current:
            <span>{this.state.elec.current}</span>
              <br />
              previous:
              <span>{this.state.elec.prev}</span> => <br />Used:
              <span>{this.state.elec.used}</span>
            </div>
          </div>

          <div className='item'>Electricty bill amount =>
            <span>{this.state.elec.bill}</span>p (£
            <span id='pound'>{this.state.elec.bill / 100}</span>)
          </div>

        </div>
      </div>
    );
  }
}

export default App;
