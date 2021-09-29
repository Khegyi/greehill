import _ from "underscore";
export function isCellAlive(cellpos, grid, gridRowNum) {
  /*  
  const result = grid.find(
    (c) => c.row === cellpos.row && c.coll === cellpos.coll
  );
  return result.alive; */
  const index = cellpos.row * gridRowNum + cellpos.coll;
  return grid[index].alive;
}

export function getNeighboursPosition(cell, gridRowNum, griCollNum) {
  let neighbours = [];
  //One Row left and right
  for (let h = cell.row - 1; h < cell.row + 2; h++) {
    //One Coll above and below
    for (let k = cell.coll - 1; k < cell.coll + 2; k++) {
      //Inside the Grid border
      if (h >= 0 && h <= gridRowNum - 1 && k >= 0 && k <= griCollNum - 1) {
        //Exclude the original Cell
        if (h !== cell.row || k !== cell.coll)
          neighbours.push({ row: h, coll: k });
      }
    }
  }
  return neighbours;
}

export function countAliveNeighbours(neighbours, grid, gridRowNum) {
  let counter = 0;
  let i = 0;
  // console.log("length:", neighbours.length);
  while (i < neighbours.length) {
    //  console.log(i);
    //  console.log("i:", i, "counter", counter, neighbours[i]);
    const index = neighbours[i].row * gridRowNum + neighbours[i].coll;
    const res = grid[index].alive;
    /*  console.log("res"); */
    if (res) {
      //  console.log(res);
      counter++;
    }
    i++;
    //   console.log(i);
    if (counter > 3) {
      //  console.log("break", counter);
      break;
    }
  }
  /*   neighbours.forEach((cell) => {
    const index = cell.row * gridRowNum + cell.coll;
    const res = grid[index].alive;
    console.log("cs");
    if (res) {
      //  console.log(res);
      counter++;
    }
    /*     while (counter < 4) {
      

      if (counter < 4) {
        break;
      }
    } 
  }); */
  // console.log(counter);
  return counter;
}

export function willCellSurvive(cell, grid, gridRowNum, griCollNum) {
  //console.log(cell);
  const aliveCounter = countAliveNeighbours(cell.neighbours, grid, gridRowNum);
  // const aliveCounter = Math.floor(Math.random() * 8);
  if (cell.alive) {
    if (aliveCounter < 2 || aliveCounter > 3) {
      return false;
    } else {
      return true;
    }
  } else {
    if (aliveCounter === 3) {
      return true;
    } else {
      return false;
    }
  }
}
