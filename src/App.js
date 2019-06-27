import React from 'react';
import './App.scss';



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
        this.setState(prevState => ({
          gas: {
            ...(prevState.gas),
            prev: res.gas.reading
          },
          elec: {
            ...(prevState.elec),
            prev: res.electricity.reading
          },

        }))
      }).catch(err => {
        console.log("Our fetch request is failing, error: " + err);
      });
  }

  handleInput = event => {
    if (event.target.value >= 1000000000) {
      event.target.value = 999999999;
    } else if (event.target.value <= -1000000000) {
      event.target.value = -999999999;
    }
    const reading = event.target.value;
    const name = event.target.name;
    this.setState(prevState => {
      const subtotal = reading - prevState[name].prev;
      return ({
        [name]: {
          prev: prevState[name].prev,
          current: reading,
          used: subtotal,
          bill: subtotal <= 100 ?
            (subtotal) * 10 :
            (100 * 10) + ((subtotal - 100) * 20)
        }
      });
    });
  }

  render() {
    return (
      <div className="App">
        <h1 className='title'>SHINE ENERGY</h1>
        <h2 className='subtitle'>Your Account Summary</h2>
        <div className='container container1'>
          <div className='item'>
            Total Bill: <span>{format(this.state.gas.bill + this.state.elec.bill)}
            p (£{format((this.state.gas.bill + this.state.elec.bill) / 100)})</span>
          </div>
        </div>
        <div className='container container2'>
          <div className='item'>
            <label htmlFor='gas'>Gas Reading:</label>
            <input type='number' max="999" name='gas' 
              onChange={e => this.handleInput(e)} /></div>
          <div className='item'>Gas Reading Entered:
            <span>{format(this.state.gas.current)}</span></div>
          <div className='item'>Gas units used =>

            <div className='used'>
              Current:
            <span>{format(this.state.gas.current)}</span>
              <br />
              previous:
            <span>{format(this.state.gas.prev)}</span> <br />Used:
            <span>{format(this.state.gas.used)}</span>
            </div>

          </div>
          <div className='item'>Gas bill amount =>
            <span>{format(this.state.gas.bill)}</span>p (£
            <span id='pound'>{format(this.state.gas.bill / 100)}</span>)
          </div>
        </div>

        <div className='container'>
          <div className='item'>
            <label htmlFor='elec'>Electricity Reading:</label>
            <input type='number' max="999" name='elec' 
              onChange={e => this.handleInput(e)} />
          </div>
          <div className='item'>Electricty Reading Entered: <span>{format(this.state.elec.current)}</span></div>
          <div className='item'>Electricty units used =>

          <div className='used'>
              Current:
            <span>{format(this.state.elec.current)}</span>
              <br />
              previous:
              <span>{format(this.state.elec.prev)}</span> => <br />Used:
              <span>{format(this.state.elec.used)}</span>
            </div>
          </div>

          <div className='item'>Electricty bill amount =>
            <span>{format(this.state.elec.bill)}</span>p (£
            <span id='pound'>{format(this.state.elec.bill / 100)}</span>)
          </div>

        </div>
      </div>
    );
  }
}

const format = number => {
  return number == 0 ? 0 : commaDelimit(number)
}

const commaDelimit = number => {
  let string = number.toString();
  return !string.includes('.') ? string
    .split('')
    .reverse()
    .map((char, index) => {
      return index % 3 == 0 && index != 0 && char != '-' ? char + ',' : char
    }).reverse().join('') :
    string
      .split('.').reduce((whole, fraction) => {
        console.log("Whole " + whole + " fraction " + fraction);
        return whole.split('')
          .reverse()
          .map((char, index) => {
            return index % 3 == 0 && index != 0 && char != '-' ? char + ',' : char
          }).reverse().join('').concat('.' + fraction);
      });
}

export default App;
