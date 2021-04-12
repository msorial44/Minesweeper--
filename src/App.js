import React from 'react';
import logo from './Images/bomb.svg';
import Modal from 'react-bootstrap/Modal'
import fired from './Images/fired.svg';
import target from './Images/target.svg';
import './App.scss';

function CompFired() { //component to house image
  return <img className='cell-bomb-img' src={fired} alt="" />
}

function CompTarget() { //component to house image
  return <img className='cell-img' src={target} alt="" />
}

function randomInt(min, max) { // random integer for bomb, min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}


let bombList = []; //list of bombs
for (let i = 1; i <= 10; i++) { //get random tiles to become bombs
  var randCol = randomInt(1, 8);
  var randRow = randomInt(1, 9);
  if (bombList.includes([randRow, randCol])) {

  } else {
    bombList.push([randRow, randCol]);
  }
} 

let zeroList = []; //list of tiles that have no bombs near it
let targetCounterVar = 10; //var to count how many flags left
let isEnd = false; //if true will trigger EndModal
let endCheck = true; //stops EndModal from infinitley refreshing itself
let updateInt; //updates in modal to cause rerender

class Cell extends React.Component { //main cell code
  constructor(props) {
    super(props);
    this.state = {
      val: 'closed', //has the tile been opened or not
      isBomb: false, 
      isFlagged: false, 
      col: 0, 
      row: 0,
      bombCounter: 0}
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.bombSetup();
    this.interval = setInterval(() => this.revealTiles(), 100); //set timer to check for opened zero tiles
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

  componentWillUnmount() { //stop timer and right click menu
    document.removeEventListener("contextmenu", this.handleRightClick);
    clearInterval(this.interval);
  }

  handleClick() { //function to handle clicks
    if (this.state.isFlagged){ //if player opens a tile with a target removes target and adds to total targets
      targetCounterVar++;
    }
    if (this.state.isBomb) {
      isEnd = true;
    }
    this.setState(state => ({val: 'open'})); //opens tile
    this.addZero();//if tile is a 0 add to zerolist
  }

  

  handleRightClick = (e) => { //right click handler
    e.preventDefault();
    if (this.state.val === 'closed') { //check if tile is still closed
      if (this.state.isFlagged){ //unflag a tile
        this.setState(state => ({isFlagged: false}));
        targetCounterVar++;
      }else{ //flag a tile
        this.setState(state => ({isFlagged: true}));
        targetCounterVar--;
      }
    }
  }

  addZero() { //add to zerolist if no bombs next to it
    if (this.state.bombCounter === 0) {
      zeroList.push([this.props.row, this.props.col]);
    }
  } 

  revealTiles() { //handle reavling neighbor zeros
    if (this.state.val === 'closed') {
      for (const x of zeroList) {
        if (x[0] === this.props.row && (x[1] - 1) === this.props.col) { //checks if a zero is directly above
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if (x[0] === this.props.row && (x[1] + 1) === this.props.col) {//checks if a zero is directly below
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]-1) === this.props.row && x[1] === this.props.col) { //checks if a zero is directly left
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]+1) === this.props.row && x[1] === this.props.col) { //checks if a zero is directly right
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]-1) === this.props.row && (x[1]-1) === this.props.col) { //checks if a zero is to the top left
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]-1) === this.props.row && (x[1]+1) === this.props.col) { //checks if a zero is to the bottom left
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]+1) === this.props.row && (x[1]-1) === this.props.col) { //checks if a zero is to the top right
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
        if ((x[0]+1) === this.props.row && (x[1]+1) === this.props.col) {//checks if a zero is to the bottom right
          this.setState(state => ({val: 'open'}));
          this.addZero();
        };
      };
    }
  }

  updateId() { //adds passed props to state
    this.setState(state => ({row: this.props.row}));
    this.setState(state => ({col: this.props.col}));
  }

  bombAdd() { //if called adds to bombCounter which displays amount of bombs adjacent
    this.setState(prevState => ({bombCounter: prevState.bombCounter + 1}));
  }

  bombSetup() { //checks current tile if its a bomb
    for (const x of bombList) {
      if (x[0] === this.props.row && x[1] === this.props.col) {
        this.setState(state => ({bombCounter: 99}));
        this.setState(state => ({isBomb: true}));
        return;
      };
    };
    
    for (const x of bombList) {
      if (x[0] === this.props.row && (x[1] - 1) === this.props.col) { //checks for bomb in top tile
        this.bombAdd();
      };
      if (x[0] === this.props.row && (x[1] + 1) === this.props.col) { //checks for bomb in bottom tile
        this.bombAdd();
      };
      if ((x[0]-1) === this.props.row && x[1] === this.props.col) { //checks for bomb in left tile
        this.bombAdd();
      };
      if ((x[0]+1) === this.props.row && x[1] === this.props.col) { //checks for bomb in right tile
        this.bombAdd();
      };
      if ((x[0]-1) === this.props.row && (x[1]-1) === this.props.col) { //checks for bomb in top left tile
        this.bombAdd();
      };
      if ((x[0]-1) === this.props.row && (x[1]+1) === this.props.col) { //checks for bomb in bottom left tile
        this.bombAdd();
      };
      if ((x[0]+1) === this.props.row && (x[1]-1) === this.props.col) { //checks for bomb in top right tile
        this.bombAdd();
      };
      if ((x[0]+1) === this.props.row && (x[1]+1) === this.props.col) {//checks for bomb in bottom right tile
        this.bombAdd();
      };
    };
  }

  render() { 
    let img;
    let clsName;
    if (this.state.val === 'closed') { //displays tile if revealed, closed, flagged, or bomb
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
        img = <p className="bomb-counter">{this.state.bombCounter}</p>;
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

class TargetCounter extends React.Component { //counter component for counting flagged tiles
  constructor(props) {
    super(props);
    this.state = {  
      num: 10
    }
  }
  updateCounter() {
    this.setState(state => ({num: targetCounterVar})); //changes state to current flags left
  }
  componentDidMount() {
    this.interval = setInterval(() => this.updateCounter(), 100); //time to keep checking flags
  }

  render() { 
    return (  
     <p>{this.state.num}</p>
    );
  }
};
 
class ResetButton extends React.Component { //reset button
  handleClick() {
    window.location.reload(); //reloads page
  }

  render() { 
    return (  
      <button type="button" class="btn btn-dark" onClick={this.handleClick}>Reset</button>
    );
  }
};
 

class EndModal extends React.Component { //Modal for the end screen
  constructor(props) {
    super(props);
    this.state = {  
      isOpen: true,
      updateInt: 1
    }
  }


  componentDidMount() {
    endCheck = true
    this.interval = setInterval(() => this.checkEnd(), 100);
  }

  checkEnd() {
    if (isEnd && endCheck) {
      this.setState({updateInt: 2})
      endCheck = false;
    }
  }

  closeModal = () => this.setState({ isOpen: false });

  onExit() {
    window.location.reload();
  }

  render() { 
    if (isEnd) {
      return (  
        <>
        <Modal show={this.state.isOpen} onHide={this.closeModal} onExit={this.onExit} size="lg"
        aria-labelledby="contained-modal-title-vcenter" centered className="end-modal">
          <Modal.Header>
            <Modal.Title>You lost!</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <ResetButton/>
          </Modal.Footer>
        </Modal>
      </>
      );
    } else {
      return (
        <div></div>
      );
    };
  }
}
 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {uselessUpdate: 0};
  }

  nestedArray = [ //nested array for all tiles
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

  uselessUpdateFunction() { //dont ask
    this.setState(prevState => ({uselessUpdate: prevState.uselessUpdate + 1}));
  }

  

  render() { //page heirarchy
    return (
      <>
      <EndModal/>
      <div className="App">
        <div className="App-container">
          <div className="App-Header">
            <p className="App-title">Minesweeper</p>
            <div className="logo-container">
              <img src={logo} className="App-logo" alt="logo"></img>
            </div>
          </div>
          <div className="Control">
            <div className="flagCounter">
              <TargetCounter var={targetCounterVar} func={this.uselessUpdateFunction}/>
            </div>
            <div className="reset">
              <ResetButton />
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
    </>
    );
  };
}

export default App;


