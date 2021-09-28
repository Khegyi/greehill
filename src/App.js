import React, { useEffect, useState } from "react";
import presets from "./presets";
import {
  PauseOutlined,
  CaretRightOutlined,
  ForwardOutlined,
  StepForwardOutlined,
  RollbackOutlined,
  ClearOutlined,
  GiftOutlined,
  CopyOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import "./App.css";

function App() {
  const [theGrid, setTheGrid] = useState([]);
  const [theOriginalGrid, setTheOriginalGrid] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState();
  const [globalAliveCounter, setGlobalAliveCounter] = useState(0);
  const [generationCounter, setGenerationCounter] = useState(0);
  const [playMode, setPlayMode] = useState(false);
  const [currentAction, setCurrentAction] = useState("");
  const [playSpeed, setPlaySpeed] = useState(500);
  const [intervalId, setIntervalId] = useState(0);
  const defaultStartingRowNumber = 30;
  const defaultStartingCollNumber = 30;

  const clone = require("rfdc")();

  const createTheGrid = (mode) => {
    let gAC = 0;
    let value = false;
    let grid = [];

    for (let i = 0; i < defaultStartingRowNumber; i++) {
      for (let z = 0; z < defaultStartingCollNumber; z++) {
        if (mode === "random") {
          const rndnum = Math.floor(Math.random() * 2);
          value = rndnum === 1 ? true : false;
        }
        grid.push({ row: i, coll: z, alive: value });
        if (value) gAC++;
      }
    }
    setGlobalAliveCounter(gAC);
    setTheGrid(grid);
    setTheOriginalGrid(clone(grid));
  };

  const renderTheGrid = () => {
    let table = [];
    for (let t = 0; t < defaultStartingRowNumber; t++) {
      const eachRow = theGrid
        .filter((r) => r.row === t)
        .map((ren) => {
          return (
            <div
              className="cell"
              data-cellnum={ren.coll}
              key={`${ren.row}${ren.coll}`}
            >
              <button
                title="cell"
                disabled={playMode || generationCounter !== 0 ? "disabled" : ""}
                onClick={() => handleCellClick(ren)}
                className={ren.alive ? "alive" : "dead"}
              ></button>
            </div>
          );
        });
      const rowRes = (
        <div key={t} data-rownum={t} className="row">
          {eachRow}
        </div>
      );
      table.push(rowRes);
    }

    return table;
  };

  const isCellAlive = (cell, grid) => {
    //check cell current lifesignal
    const result = grid.find((c) => c.row === cell.row && c.coll === cell.coll);
    return result.alive;
  };

  const getNeighboursPosition = (cell) => {
    //Find cell's neighbours Position
    let neighbours = [];
    for (let h = cell.row - 1; h < cell.row + 2; h++) {
      for (let k = cell.coll - 1; k < cell.coll + 2; k++) {
        if (
          h >= 0 &&
          h <= defaultStartingRowNumber - 1 &&
          k >= 0 &&
          k <= defaultStartingCollNumber - 1
        ) {
          if (h !== cell.row || k !== cell.coll)
            neighbours.push({ row: h, coll: k });
        }
      }
    }
    return neighbours;
  };

  const willCellSurvive = (cell, grid) => {
    //Decide if the cell will live depending on it' live neighbours
    const neighbours = getNeighboursPosition(cell);
    const isalive = isCellAlive(cell, grid);
    let counter = 0;
    neighbours.forEach((cell) => {
      if (isCellAlive(cell, grid)) {
        counter++;
      }
    });
    if (isalive) {
      if (counter < 2 || counter > 3) {
        return false;
      } else {
        return true;
      }
    } else {
      if (counter === 3) {
        return true;
      } else {
        return false;
      }
    }
  };

  const nextGeneration = (grid) => {
    let gAC = 0;
    grid.map((cell) => {
      cell.alive = willCellSurvive(cell, grid);
      if (cell.alive) {
        gAC++;
      }
      return cell;
    });
    setGenerationCounter((genNumber) => genNumber + 1);
    setGlobalAliveCounter(gAC);
    setTheGrid(grid);
  };

  const handleCellClick = (data) => {
    const grid = [...theGrid];
    grid.map((cell) => {
      if (cell.row === data.row && cell.coll === data.coll) {
        cell.alive = !data.alive;
        willCellSurvive(cell, grid);
      }
      return cell;
    });
    setTheGrid(grid);
    setTheOriginalGrid(clone(grid));
  };

  const handlePlay = () => {
    if (playMode) {
      clearInterval(intervalId);
      setIntervalId(0);
      setPlayMode(false);
      setCurrentAction("Start");
    } else {
      const newIntervalID = setInterval(() => {
        nextGeneration(theGrid);
      }, playSpeed);
      setPlayMode(true);
      setIntervalId(newIntervalID);
      setCurrentAction("Pause");
    }
  };

  const handleSpeedChange = (e) => {
    const reverseval = 1001 - e.target.value;
    setPlaySpeed(reverseval);
  };

  const handleClear = () => {
    const tempGrid = [...theGrid];
    tempGrid.map((cell) => {
      cell.alive = false;
      return cell;
    });
    setTheGrid(tempGrid);
    setGlobalAliveCounter(0);
    setGenerationCounter(0);
  };

  const resetOriginalGrid = () => {
    setTheGrid(JSON.parse(JSON.stringify(theOriginalGrid)));
    setGenerationCounter(0);
  };

  const getRandomGrid = () => {
    createTheGrid("random");
  };
  const getMap = () => {
    navigator.clipboard.writeText(JSON.stringify(theGrid));
    setCurrentAction("Grid was copied to Clipboard");
  };

  const handlePreset = (e) => {
    setSelectedPreset(clone(presets[e.target.value]));
  };
  const setPreset = () => {
    setGenerationCounter(0);
    setTheGrid(clone(selectedPreset));
    setTheOriginalGrid(clone(selectedPreset));
  };

  useEffect(() => {
    createTheGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    renderTheGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theGrid]);

  return (
    <div className="App">
      <div className="App-body">
        <div className="controll">
          <header className="App-header">
            <h1>Game of Life</h1>
            <p className="grid_info">
              <span title="gen_counter">{generationCounter}th generation</span>
              <span> | </span>
              <span title="alive_counter">
                Cells alive:
                {globalAliveCounter}
              </span>
            </p>
            <div className="tooltip">
              <p title="tooltip">{currentAction}</p>
            </div>
          </header>
          <div className="first_row">
            <button
              className={playMode ? "stop" : "go"}
              title="start"
              onMouseEnter={() =>
                setCurrentAction(playMode ? "Pause" : "Start")
              }
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => handlePlay()}
            >
              {playMode ? <PauseOutlined /> : <CaretRightOutlined />}
            </button>
            <button
              className="next"
              title="next"
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Next Generation")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => nextGeneration(theGrid)}
            >
              <StepForwardOutlined />
            </button>
            <button
              className="reset"
              title="reset"
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Reset to  0th Generation")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => resetOriginalGrid()}
            >
              <RollbackOutlined />
            </button>
            <button
              className="clear"
              title="clear"
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Clear Grid")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => handleClear()}
            >
              <ClearOutlined />
            </button>
            <button
              className="random"
              title="random"
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Random Grid")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => getRandomGrid()}
            >
              <GiftOutlined />
            </button>
            <button
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Copy Grid to Clipboard")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => getMap()}
            >
              <CopyOutlined />
            </button>
          </div>
          <select
            disabled={playMode ? "disabled" : ""}
            onChange={(e) => handlePreset(e)}
          >
            <option value="" defaultValue hidden>
              Choose Preset
            </option>
            {Object.keys(presets).map((preset, i) => {
              return (
                <option value={preset} key={i}>
                  {preset}
                </option>
              );
            })}
          </select>
          <button
            className="preset"
            disabled={
              playMode || selectedPreset === undefined ? "disabled" : ""
            }
            onMouseEnter={() => setCurrentAction("Load Preset Grid")}
            onMouseLeave={() => setCurrentAction("")}
            onClick={() => setPreset()}
          >
            <ImportOutlined />
          </button>
          <div className="speedslider">
            <CaretRightOutlined />
            <input
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Change Evolution Speed")}
              onMouseLeave={() => setCurrentAction("")}
              onChange={(e) => handleSpeedChange(e)}
              type="range"
              min="1"
              defaultValue="500"
              max="1000"
            />
            <ForwardOutlined />
          </div>
        </div>
        <div
          className={`Game-grid ${
            playMode || generationCounter !== 0 ? "disabled" : ""
          }`}
        >
          <div className="border">{renderTheGrid()}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
