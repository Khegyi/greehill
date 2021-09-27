import React, { useEffect, useState } from "react";
import './App.css';

function App() {

  const [theGrid, setTheGrid] = useState([]);
  const [globalAliveCounter, setGlobalAliveCounter] = useState(0);
  const [playMode, setPlayMode] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const defaultStartingRowNumber = 30;
  const defaultStartingCollNumber = 30;

  
  function createTheGrid (mode) {
    let gAC = 0; 
    let value = false;
    let grid  = [];
    for (let i = 0; i < defaultStartingRowNumber; i++) {
      for (let z = 0; z < defaultStartingCollNumber; z++) {
        if(mode === "random"){
          const rndnum = Math.floor(Math.random() * 2 );
          value = (rndnum === 1 ? true : false);
        }
          grid.push({row: i, coll: z, alive: value})
          if(value) gAC++;
      }
    }
    setGlobalAliveCounter(gAC);
    setTheGrid(grid);
  }

const renderTheGrid = () => {

  let table = [];

  for (let t = 0; t < defaultStartingRowNumber; t++) {
    const eachRow = theGrid.filter(r =>  r.row === t)
    .map(ren => {
      return <div className="cell" data-cellnum={ren.coll} key={`${ren.row}${ren.coll}`}><button onClick={() => handleCellClick(ren)} className={(ren.alive ? "alive" : "dead")}>{(ren.alive ? "I" : "0")}</button></div>;
    })
    const rowRes = <div key={t} data-rownum={t} className="row">{eachRow}</div>
    table.push(rowRes);
  }

return table;
} 

/* const SchrodringersQuestion = (cell) => {

  //corner
  if(cell.row === 0 || cell.row === defaultStartingRowNumber-1 || cell.coll === 0 || cell.coll === defaultStartingCollNumber-1 ){
    if((cell.row === 0 || cell.row === defaultStartingRowNumber-1) && (cell.coll === 0 || cell.coll === defaultStartingCollNumber-1 )){
      console.log("corner");
       //3 neighbour
    }else{
        //border
      console.log("border");
       //5 neighbour
    }
  }else{
      //else
    console.log("else");
    //8 neighbour
  }
} */

const shouldCellSurvive = (neighbours, isalive) => {
let counter = 0;
neighbours.forEach(c => {
  if(isCellAlive(c)){
    counter++;
  }
});
  if(isalive){
    if(counter < 2 || counter > 3){
      return false;
    }else{
      return true;
    }
  }else{
    if(counter === 3){
      return true;
    }else{
      return false;
    }
  }
}

const isCellAlive = (cell) => {
  const tempGrid = [...theGrid];
  const result = tempGrid.find(c => c.row === cell.row && c.coll === cell.coll);
  return result.alive;
}

const NeighbourCounter = (cell) => {
  let neighbours = [];
  for (let h = cell.row - 1; h < cell.row + 2; h++) {
    for (let k = cell.coll - 1; k < cell.coll + 2; k++) {
      if(((h >= 0) && (h <= defaultStartingRowNumber-1)) && ((k >= 0) && (k <= defaultStartingCollNumber-1))){
        if(h !==cell.row || k !==cell.coll )
          neighbours.push({row: h, coll: k})
      }
    } 
  } 
  const isnextphasealive = shouldCellSurvive(neighbours, isCellAlive(cell));
 // console.log("now alive: ",  isCellAlive(cell), " will Live:", isnextphasealive);
 // console.log(neighbours);
  return isnextphasealive;
}

const nextGeneration = () => {
      
      let gAC = 0; 
      const tempGrid = [...theGrid];
      tempGrid.map(cell => {
          cell.alive = NeighbourCounter(cell);
          if(cell.alive){
            gAC++;
          }
           return cell;
      })
      console.log(tempGrid);
      console.log("gAC: ", gAC);
      setGlobalAliveCounter(gAC);
      setTheGrid(tempGrid);
}

const handleCellClick = (data) => {
  const tempGrid = [...theGrid];
  tempGrid.map(cell => {
    if(cell.row === data.row && cell.coll === data.coll){
     // SchrodringersQuestion(cell);
     cell.alive = !data.alive;
     NeighbourCounter(cell);
    }
    return cell;
  })
  setTheGrid(tempGrid);
} 

const handlePlay = () => {

  if(playMode){
    clearInterval(intervalId);
    setIntervalId(0);
    setPlayMode(false)
    
  }else{
    const newIntervalID = setInterval(() => {
      nextGeneration();
    }, 10);
    setPlayMode(true)
    setIntervalId(newIntervalID);
  }
}

  useEffect(() => {
     createTheGrid("random");
  }, []);


  renderTheGrid();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Game of Life</h1>
        <h3>Cells alive: {globalAliveCounter}</h3>
      </header>
      <div className="App-body">
        <div>
          <button onClick={() => nextGeneration()}>Next Gen</button>
          <button onClick={() => handlePlay()}>{(playMode ? "Stop" : "Go")}</button>
        </div>
        <div className="Game-grid">
          {renderTheGrid()}
        </div>
      </div>
    </div>
  );
}

export default App;
