import React from 'react';
import logo from './images/bomb.svg';
import fired from './images/fired.svg';
import target from './images/target.svg';
import ReactDOM from 'react-dom';
import './App.css';

function CompFired() {
  return <img className='cell-img' src={fired} />
}

function CompTarget() {
  return <img className='cell-img' src={target} />
}

function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let bombList = [];
for (let i = 1; i <= 10; i++) {
  bombList.push(randomInt(1, 72));
} 

let zeroList = [];
var idCounter = 1;

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 'closed', 
      isBomb: false, 
      isFlagged: false, 
      id: 0, 
      bombCounter: 0}
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.updateId();
    idCounter++;
    this.bombSetup();
    this.interval = setInterval(() => this.revealTiles(), 100);
  }

  updateState = () => {
    this.setState({
        val: this.state.val,
        isBomb: this.state.isBomb,
        isFlagged: this.state.isFlagged, 
        id: this.state.id,
        bombCounter: this.state.bombCounter
      })
  };

  componentDidUpdate() {
    
  }

  componentWillUnmount() {
    document.removeEventListener("contextmenu", this.handleRightClick);
    clearInterval(this.interval);
  }

  uuf = () => {
    this.props.uuf()
  }

  handleClick() {
    this.setState(state => ({val: 'open'}));
    this.addZero();
  }

  

  handleRightClick = (e) => {
    e.preventDefault();
    if (this.state.val == 'closed') {
      this.setState(state => ({isFlagged: true}));
    }
  }

  addZero() {
    if (this.state.bombCounter == 0) {
      zeroList.push(this.props.id);
    }
  } 

  revealTiles() {
    if (this.state.val == 'closed') {
      for (const x of zeroList) {
        if ((this.props.id - 1) === x) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((this.props.id + 1) === x) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((this.props.id - 8) === x) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((this.props.id + 8) === x) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((this.props.id - 9) === x) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((this.props.id + 9) === x) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((this.props.id - 7) === x) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((this.props.id + 7) === x) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
      }
    }
  }

  updateId() {
    this.setState(state => ({id: this.props.id}));
  }

  bombAdd() {
    this.setState(prevState => ({bombCounter: prevState.bombCounter + 1}));
  }

  bombSetup() {
    for (const x of bombList) {
      if (x == this.props.id) {
        this.setState(state => ({bombCounter: 99}));
        this.setState(state => ({isBomb: true}));
        return;
      };
    };
    
    for (const x of bombList) {
      if ((this.props.id - 1) === x) {
        this.bombAdd();
      };
      if ((this.props.id + 1) === x) {
        this.bombAdd();
      };
      if ((this.props.id - 8) === x) {
        this.bombAdd();
      };
      if ((this.props.id + 8) === x) {
        this.bombAdd();
      };
      if ((this.props.id - 9) === x) {
        this.bombAdd();
      };
      if ((this.props.id + 9) === x) {
        this.bombAdd();
      };
      if ((this.props.id - 7) === x) {
        this.bombAdd();
      };
      if ((this.props.id + 7) === x) {
        this.bombAdd();
      };
    };
  }

  render() { 
    let img;
    let clsName;
    if (this.state.val === 'closed') {
      if (this.state.isFlagged) {
        img = <CompTarget />
        clsName = 'cell-closed';
      } else {
        img = <p>{this.props.id}</p>;
        clsName = 'cell-closed';
      }
    } else if (this.state.val === 'open') {
      if (this.state.isBomb) {
        img = <CompFired />
        clsName = 'cell-bomb';
      } else {
        img = <p>{this.state.bombCounter}</p>;
        clsName = 'cell-open';
      }
    }
  
    
    return (
      <div className={clsName} onClick={this.handleClick} onContextMenu={this.handleRightClick}>
        {img}
      </div> 
    )
  }
}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {uselessUpdate: 0};
  }

  uselessUpdateFunction() {
    this.setState(prevState => ({uselessUpdate: prevState.uselessUpdate + 1}));
  }

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <div className="App-Header">
            <p className="App-title">Minesweeper</p>
            <img src={logo} className="App-logo"></img>
          </div>
          <div className="Control">
            <div className="flagCounter">
              <p>10</p>
            </div>
            <div className="reset">
              <button>Reset</button>
            </div>
            <div className="timer">
              <p>0:00</p>
            </div>
          </div>
          <div className="Field">
            <Cell id={1} />
            <Cell id={2} />
            <Cell id={3} />
            <Cell id={4} />
            <Cell id={5} />
            <Cell id={6} />
            <Cell id={7} />
            <Cell id={8} />
            <Cell id={9} />
            <Cell id={10} />
            <Cell id={11} />
            <Cell id={12} />
            <Cell id={13} />
            <Cell id={14} />
            <Cell id={15} />
            <Cell id={16} />
            <Cell id={17} />
            <Cell id={18} />
            <Cell id={19} />
            <Cell id={20} />
            <Cell id={21} />
            <Cell id={22} />
            <Cell id={23} />
            <Cell id={24} />
            <Cell id={25} />
            <Cell id={26} />
            <Cell id={27} />
            <Cell id={28} />
            <Cell id={29} />
            <Cell id={30} />
            <Cell id={31} />
            <Cell id={32} />
            <Cell id={33} />
            <Cell id={34} />
            <Cell id={35} />
            <Cell id={36} />
            <Cell id={37} />
            <Cell id={38} />
            <Cell id={39} />
            <Cell id={40} />
            <Cell id={41} />
            <Cell id={42} />
            <Cell id={43} />
            <Cell id={44} />
            <Cell id={45} />
            <Cell id={46} />
            <Cell id={47} />
            <Cell id={48} />
            <Cell id={49} />
            <Cell id={50} />
            <Cell id={51} />
            <Cell id={52} />
            <Cell id={53} />
            <Cell id={54} />
            <Cell id={55} />
            <Cell id={56} />
            <Cell id={57} />
            <Cell id={58} />
            <Cell id={59} />
            <Cell id={60} />
            <Cell id={61} />
            <Cell id={62} />
            <Cell id={63} />
            <Cell id={64} />
            <Cell id={65} />
            <Cell id={66} />
            <Cell id={67} />
            <Cell id={68} />
            <Cell id={69} />
            <Cell id={70} />
            <Cell id={71} />
            <Cell id={72} />
          </div>
        </div>
      </div>
    );
  };
}

export default App;


