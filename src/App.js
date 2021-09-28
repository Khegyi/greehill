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
  const [selectedPreset, setSelectedPreset] = useState([]);
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

  const shouldCellSurvive = (neighbours, isalive) => {
    let counter = 0;
    neighbours.forEach((c) => {
      if (isCellAlive(c)) {
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

  const isCellAlive = (cell) => {
    const tempGrid = [...theGrid];
    const result = tempGrid.find(
      (c) => c.row === cell.row && c.coll === cell.coll
    );
    return result.alive;
  };

  const willCellLiveNextGen = (cell) => {
    // getting cell's direct neigbours and checking life signals
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
    const isNextPhaseAlive = shouldCellSurvive(neighbours, isCellAlive(cell));
    // console.log("now alive: ",  isCellAlive(cell), " will Live:", isNextPhaseAlive);
    // console.log(neighbours);
    return isNextPhaseAlive;
  };

  const nextGeneration = () => {
    let gAC = 0;
    const tempGrid = [...theGrid];
    tempGrid.map((cell) => {
      cell.alive = willCellLiveNextGen(cell);
      if (cell.alive) {
        gAC++;
      }
      return cell;
    });
    setGenerationCounter((genNumber) => genNumber + 1);
    setGlobalAliveCounter(gAC);
    setTheGrid(tempGrid);
  };

  const handleCellClick = (data) => {
    const tempGrid = [...theGrid];
    tempGrid.map((cell) => {
      if (cell.row === data.row && cell.coll === data.coll) {
        // SchrodringersQuestion(cell);
        cell.alive = !data.alive;
        willCellLiveNextGen(cell);
      }
      return cell;
    });
    setTheGrid(tempGrid);
  };

  const handlePlay = () => {
    if (playMode) {
      clearInterval(intervalId);
      setIntervalId(0);
      setPlayMode(false);
    } else {
      const newIntervalID = setInterval(() => {
        nextGeneration();
      }, playSpeed);
      setPlayMode(true);
      setIntervalId(newIntervalID);
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
    console.log(theOriginalGrid);
  };

  const getRandomGrid = () => {
    createTheGrid("random");
  };
  const getMap = () => {
    console.log(JSON.stringify(theGrid));
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
    createTheGrid("random");
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
            <p>
              {" "}
              {generationCounter}th generation | Cells alive:{" "}
              {globalAliveCounter}
            </p>
            <div className="tooltip">
              <p>{currentAction}</p>
            </div>
          </header>
          <div className="first_row">
            <button
              className={playMode ? "stop" : "go"}
              onMouseEnter={() =>
                setCurrentAction(playMode ? "Pause" : "Start")
              }
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => handlePlay()}
            >
              {playMode ? <PauseOutlined /> : <CaretRightOutlined />}
            </button>
            <button
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Next Generation")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => nextGeneration(generationCounter)}
            >
              <StepForwardOutlined />
            </button>
            <button
              className="reset"
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Reset to  0th Generation")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => resetOriginalGrid()}
            >
              <RollbackOutlined />
            </button>
            <button
              className="clear"
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Clear Grid")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => handleClear()}
            >
              <ClearOutlined />
            </button>
            <button
              className="random"
              disabled={playMode ? "disabled" : ""}
              onMouseEnter={() => setCurrentAction("Random Grid")}
              onMouseLeave={() => setCurrentAction("")}
              onClick={() => getRandomGrid()}
            >
              <GiftOutlined />
            </button>
            <button
              disabled={playMode ? "disabled" : ""}
              onClick={() => getMap()}
            >
              <CopyOutlined />
            </button>
          </div>
          <select
            disabled={playMode ? "disabled" : ""}
            onChange={(e) => handlePreset(e)}
          >
            <option value="" selected disabled hidden>
              Choose Preset
            </option>
            {Object.keys(presets).map((preset, i) => {
              return <option key={i}>{preset}</option>;
            })}
          </select>
          <button
            className="preset"
            disabled={playMode ? "disabled" : ""}
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
        <div className="Game-grid">{renderTheGrid()}</div>
      </div>
    </div>
  );
}

export default App;
