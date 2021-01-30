import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={()=>{this.props.onClick()}}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        wonBy: squares[a],
        line: lines[i]
      };
    }
  }
  return null;
}

function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]} key={i} onClick = {()=>{this.props.onClick(i)}}/>;
  }

  render() {
    const boardSquares = ()=>{
      let squares=[];
      for(let row=0; row<3; row++){
        squares.push(<div className="board-row" key={row}>{rowSquares(row)}</div>);
      }
      return <div>{squares}</div>;
    }

    const rowSquares = startIndex=>{
      let squares=[];
      for(let index=0; index<3; index++){
        squares.push(this.renderSquare(startIndex*3 +index));
      }
      console.log(squares);
      return squares;
    }

    return  <div>{boardSquares()}</div>
  }
}

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step%2)===0,
    })
  }

  getMoveCoords(history, step){
    const cur = history[step].squares;
    const prev = history[step-1].squares;
    const ind = cur.findIndex((val, index)=>(val!==prev[index]));
    return [Math.floor(ind/3), ind%3];
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status="";
    if(winner){
      status = `Winner ${winner.wonBy}`
    }else if(this.state.stepNumber===9){
      status = 'Match Draw'
    }else{
      status = `Next player: ${this.state.xIsNext ? 'X':'O'}`;
    }


    const moves = history.map((step, move)=>{
      let desc;
      if (move){
        let moveCoords = this.getMoveCoords(history, move)
        let moveBy = (move%2===1)?'X':'O'
        desc = `${moveBy} played (${moveCoords})`
        console.log(moveCoords)
      }else{
        desc = `Go to game start`
      }
      let descTag;
      if(this.state.stepNumber === move){
        descTag = <strong>{desc}</strong>
      }else{
        descTag = desc;
      }
      return (
        <li key={move}>
          <button onClick={()=>this.jumpTo(move)}>{descTag}</button>
        </li>
      );
    });



    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick = {(i)=>{this.handleClick(i);}}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
