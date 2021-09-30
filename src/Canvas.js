import React, { useRef } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  const size = 20;
  const drawgrid = [];

  props.draw.forEach((cell, id) => {
    drawgrid.push(
      <rect
        disabled={props.disabled}
        onClick={props.clickFN}
        key={`${cell.row}${cell.coll}${id}`}
        id={id}
        data-lifesignal={cell.alive}
        className={props.disabled ? "disabled" : cell.alive ? "alive" : "dead"}
        x={cell.coll * size}
        y={cell.row * size}
        width={size}
        height={size}
        style={{
          fill: cell.alive ? "black" : "white",
          stroke: "black",
          strokeWidth: "0.2",
        }}
      />
    );
  });

  return (
    <svg
      width={props.gridRow * size}
      height={props.gridColl * size}
      ref={canvasRef}
    >
      {drawgrid}
    </svg>
  );
};

export default Canvas;
