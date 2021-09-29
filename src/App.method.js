export function isCellAlive(cellpos, grid, gridRowNum) {
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
  while (i < neighbours.length) {
    const index = neighbours[i].row * gridRowNum + neighbours[i].coll;
    const res = grid[index].alive;
    if (res) {
      counter++;
    }
    i++;
    if (counter > 3) {
      break;
    }
  }
  return counter;
}

export function willCellSurvive(cell, grid, gridRowNum, griCollNum) {
  const aliveCounter = countAliveNeighbours(cell.neighbours, grid, gridRowNum);
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
