import React from 'react';
import Modal from 'react-modal';
import logo from './Images/bomb.svg';
import fired from './Images/fired.svg';
import target from './Images/target.svg';
import './App.css';

function CompFired() {
  return <img className='cell-img' src={fired} alt="" />
}

function CompTarget() {
  return <img className='cell-img' src={target} alt="" />
}

function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

let bombList = [];
for (let i = 1; i <= 10; i++) {
  var randCol = randomInt(1, 8);
  var randRow = randomInt(1, 9);
  if (bombList.includes([randRow, randCol])) {

  } else {
    bombList.push([randRow, randCol]);
  }
} 

let zeroList = [];
let targetCounterVar = 10;

class Cell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      val: 'closed', 
      isBomb: false, 
      isFlagged: false, 
      col: 0, 
      row: 0,
      bombCounter: 0}
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
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

  componentWillUnmount() {
    document.removeEventListener("contextmenu", this.handleRightClick);
    clearInterval(this.interval);
  }

  handleClick() {
    if (this.state.isFlagged){
      targetCounterVar++;
    }
    this.setState(state => ({val: 'open'}));
    this.addZero();
  }

  

  handleRightClick = (e) => {
    e.preventDefault();
    if (this.state.val === 'closed') {
      if (this.state.isFlagged){
        this.setState(state => ({isFlagged: false}));
        targetCounterVar++;
      }else{
        this.setState(state => ({isFlagged: true}));
        targetCounterVar--;
      }
    }
  }

  addZero() {
    if (this.state.bombCounter === 0) {
      zeroList.push([this.props.row, this.props.col]);
    }
  } 

  revealTiles() {
    if (this.state.val === 'closed') {
      for (const x of zeroList) {
        if (x[0] === this.props.row && (x[1] - 1) === this.props.col) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if (x[0] === this.props.row && (x[1] + 1) === this.props.col) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]-1) === this.props.row && x[1] === this.props.col) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]+1) === this.props.row && x[1] === this.props.col) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]-1) === this.props.row && (x[1]-1) === this.props.col) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]-1) === this.props.row && (x[1]+1) === this.props.col) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]+1) === this.props.row && (x[1]-1) === this.props.col) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]+1) === this.props.row && (x[1]+1) === this.props.col) {
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
      };
    }
  }

  updateId() {
    this.setState(state => ({row: this.props.row}));
    this.setState(state => ({col: this.props.col}));
  }

  bombAdd() {
    this.setState(prevState => ({bombCounter: prevState.bombCounter + 1}));
  }

  bombSetup() {
    for (const x of bombList) {
      if (x[0] === this.props.row && x[1] === this.props.col) {
        this.setState(state => ({bombCounter: 99}));
        this.setState(state => ({isBomb: true}));
        return;
      };
    };
    
    for (const x of bombList) {
      if (x[0] === this.props.row && (x[1] - 1) === this.props.col) {
        this.bombAdd();
      };
      if (x[0] === this.props.row && (x[1] + 1) === this.props.col) {
        this.bombAdd();
      };
      if ((x[0]-1) === this.props.row && x[1] === this.props.col) {
        this.bombAdd();
      };
      if ((x[0]+1) === this.props.row && x[1] === this.props.col) {
        this.bombAdd();
      };
      if ((x[0]-1) === this.props.row && (x[1]-1) === this.props.col) {
        this.bombAdd();
      };
      if ((x[0]-1) === this.props.row && (x[1]+1) === this.props.col) {
        this.bombAdd();
      };
      if ((x[0]+1) === this.props.row && (x[1]-1) === this.props.col) {
        this.bombAdd();
      };
      if ((x[0]+1) === this.props.row && (x[1]+1) === this.props.col) {
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

class TargetCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      num: 10
    }
  }
  updateCounter() {
    this.setState(state => ({num: targetCounterVar}));
  }
  componentDidMount() {
    this.interval = setInterval(() => this.updateCounter(), 100);
  }

  render() { 
    return (  
     <p>{this.state.num}</p>
    );
  }
}
 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {uselessUpdate: 0};
  }

  nestedArray = [
    [<Cell row={1} col={1} />, <Cell row={1} col={2} />, <Cell row={1} col={3} />, <Cell row={1} col={4} />, <Cell row={1} col={5} />, <Cell row={1} col={6} />, <Cell row={1} col={7} />, <Cell row={1} col={8} />],
    [<Cell row={2} col={1} />, <Cell row={2} col={2} />, <Cell row={2} col={3} />, <Cell row={2} col={4} />, <Cell row={2} col={5} />, <Cell row={2} col={6} />, <Cell row={2} col={7} />, <Cell row={2} col={8} />],
    [<Cell row={3} col={1} />, <Cell row={3} col={2} />, <Cell row={3} col={3} />, <Cell row={3} col={4} />, <Cell row={3} col={5} />, <Cell row={3} col={6} />, <Cell row={3} col={7} />, <Cell row={3} col={8} />],
    [<Cell row={4} col={1} />, <Cell row={4} col={2} />, <Cell row={4} col={3} />, <Cell row={4} col={4} />, <Cell row={4} col={5} />, <Cell row={4} col={6} />, <Cell row={4} col={7} />, <Cell row={4} col={8} />],
    [<Cell row={5} col={1} />, <Cell row={5} col={2} />, <Cell row={5} col={3} />, <Cell row={5} col={4} />, <Cell row={5} col={5} />, <Cell row={5} col={6} />, <Cell row={5} col={7} />, <Cell row={5} col={8} />],
    [<Cell row={6} col={1} />, <Cell row={6} col={2} />, <Cell row={6} col={3} />, <Cell row={6} col={4} />, <Cell row={6} col={5} />, <Cell row={6} col={6} />, <Cell row={6} col={7} />, <Cell row={6} col={8} />],
    [<Cell row={7} col={1} />, <Cell row={7} col={2} />, <Cell row={7} col={3} />, <Cell row={7} col={4} />, <Cell row={7} col={5} />, <Cell row={7} col={6} />, <Cell row={7} col={7} />, <Cell row={7} col={8} />],
    [<Cell row={8} col={1} />, <Cell row={8} col={2} />, <Cell row={8} col={3} />, <Cell row={8} col={4} />, <Cell row={8} col={5} />, <Cell row={8} col={6} />, <Cell row={8} col={7} />, <Cell row={8} col={8} />],
    [<Cell row={9} col={1} />, <Cell row={9} col={2} />, <Cell row={9} col={3} />, <Cell row={9} col={4} />, <Cell row={9} col={5} />, <Cell row={9} col={6} />, <Cell row={9} col={7} />, <Cell row={9} col={8} />]
  ]

  uselessUpdateFunction() {
    this.setState(prevState => ({uselessUpdate: prevState.uselessUpdate + 1}));
  }

  

  render() {
    return (
      <div className="App">
        <div className="App-container">
          <div className="App-Header">
            <p className="App-title">Minesweeper</p>
            <img src={logo} className="App-logo" alt="logo"></img>
          </div>
          <div className="Control">
            <div className="flagCounter">
              <TargetCounter var={targetCounterVar} func={this.uselessUpdateFunction}/>
            </div>
            <div className="reset">
              <button>Reset</button>
            </div>
            <div className="timer">
              <p>0:00</p>
            </div>
          </div>
          <div className="Field">
            {this.nestedArray}
          </div>
        </div>
      </div>
    );
  };
}

export default App;


