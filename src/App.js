import React, { useEffect, useState, useRef } from "react";
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
import Canvas from "./Canvas";
import { willCellSurvive, getNeighboursPosition } from "./App.method";

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

  const PlayBtn = useRef(null);

  const clone = require("rfdc")();

  const createTheGrid = (mode) => {
    let gAC = 0;
    let value = false;
    let grid = [];
    let neighbours = [];
    let index = 0;

    for (let i = 0; i < defaultStartingRowNumber; i++) {
      for (let z = 0; z < defaultStartingCollNumber; z++) {
        if (mode === "random") {
          const rndnum = Math.floor(Math.random() * 2);
          value = rndnum === 1 ? true : false;
        }
        neighbours = getNeighboursPosition(
          { row: i, coll: z },
          defaultStartingRowNumber,
          defaultStartingCollNumber
        );
        grid.push({
          index,
          row: i,
          coll: z,
          alive: value,
          neighbours: [...neighbours],
        });
        if (value) gAC++;
      }
    }
    setGlobalAliveCounter(gAC);
    setTheGrid(grid);
    setTheOriginalGrid(clone(grid));
  };

  const nextGeneration = (grid) => {
    let gAC = 0;
    const tempGrid = clone(grid);
    tempGrid.map((cell) => {
      cell.alive = willCellSurvive(
        cell,
        grid,
        defaultStartingRowNumber,
        defaultStartingCollNumber
      );
      if (cell.alive) {
        gAC++;
      }
      return cell;
    });
    setGenerationCounter((genNumber) => genNumber + 1);
    setGlobalAliveCounter(gAC);
    setTheGrid(tempGrid);
  };

  const handleCellClick = (e) => {
    if (!playMode && generationCounter === 0) {
      const cellindex = e.target.id;
      let gAC = globalAliveCounter;
      const tempGrid = clone(theGrid);
      tempGrid[cellindex].alive = !tempGrid[cellindex].alive;

      if (tempGrid[cellindex].alive) {
        gAC++;
      } else {
        gAC--;
      }
      setGlobalAliveCounter(gAC);
      setTheGrid(tempGrid);
      setTheOriginalGrid(clone(tempGrid));
    }
  };

  const handlePlay = () => {
    if (playMode) {
      clearInterval(intervalId);
      setIntervalId(0);
      setPlayMode(false);
      setCurrentAction("Start");
    } else {
      const newIntervalID = setInterval(() => {
        PlayBtn.current.click();
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
    const gAC = theOriginalGrid.filter((cell) => cell.alive === true).length;
    setTheGrid(clone(theOriginalGrid));
    setGlobalAliveCounter(gAC);
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
    const gAC = selectedPreset.filter((cell) => cell.alive === true).length;
    setGlobalAliveCounter(gAC);
    setGenerationCounter(0);
    setTheGrid(clone(selectedPreset));
    setTheOriginalGrid(clone(selectedPreset));
  };

  useEffect(() => {
    createTheGrid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              ref={PlayBtn}
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
          <div className="border">
            <Canvas
              gridRow={defaultStartingRowNumber}
              gridColl={defaultStartingCollNumber}
              disabled={playMode || generationCounter !== 0}
              draw={theGrid}
              clickFN={(e) => handleCellClick(e)}
            ></Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
