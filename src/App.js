import React, { useEffect, useState } from "react";
import './App.css';

function App() {

  const [theGrid, setTheGrid] = useState([]);
  const defaultStartingRowNumber = 32;
  const defaultStartingCollNumber = 32;

  
  function createTheGrid () {
  
    let grid  = [];
  
    for (let i = 0; i < defaultStartingRowNumber; i++) {
      for (let z = 0; z < defaultStartingCollNumber; z++) {
          grid.push({row: i, coll: z, alive: false})
      }
    }
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

const handleCellClick = (data) => {
  console.log(data);
  const tempGrid = [...theGrid];
  tempGrid.map(cell => {
    if(cell.row === data.row && cell.coll === data.coll){
     cell.alive = !data.alive;
    }
    return cell;
  })

  setTheGrid(tempGrid);
} 

  useEffect(() => {
     createTheGrid();
  }, []);


  renderTheGrid();

  return (
    <div className="App">
      <header className="App-header">
        <h1>Game of Life</h1>
      </header>
      <div className="App-body">
        <div className="Game-grid">
          {renderTheGrid()}
        </div>
      </div>
    </div>
  );
}

export default App;
