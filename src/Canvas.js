import React, { useRef, useEffect } from "react";

const Canvas = (props) => {
  const canvasRef = useRef(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const draw = (ctx, size) => {
    /*    size = size || 10;
    begin = 0;
    end = 0; */

    props.draw.forEach((cell, id) => {
      ctx.beginPath();
      ctx.moveTo(cell.coll * size, cell.row * size); // 0 0
      ctx.lineTo(cell.coll * size + size, cell.row * size); // 20 0
      ctx.lineTo(cell.coll * size + size, cell.row * size + size); // 20 20
      ctx.lineTo(cell.coll * size, cell.row * size + size); //0 20
      ctx.lineTo(cell.coll * size, cell.row * size); // 0 0
      ctx.stroke();
      if (cell.alive) {
        ctx.fillStyle = "#000";
      } else {
        ctx.fillStyle = "#fff";
      }
      ctx.fill();
      ctx.addHitRegion({ id: id });
      ctx.closePath();
    });

    /*     for (let i = 0; i < props.gridRow; i++) {
      for (let z = 0; z < props.gridRow; z++) {
        ctx.beginPath();
        ctx.moveTo(i * size, z * size); // 0 0
        ctx.lineTo(i * size + size, z * size); // 20 0
        ctx.lineTo(i * size + size, z * size + size); // 20 20
        ctx.lineTo(i * size, z * size + size); //0 20
        ctx.lineTo(i * size, z * size); // 0 0
        ctx.stroke();
        ctx.fill();
      }
    } */
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    //Our draw come here
    draw(context, 20);
  }, [draw]);

  return (
    <canvas
      width={props.gridRow * 20}
      height={props.gridColl * 20}
      ref={canvasRef} /* {...props} */
    />
  );
};

export default Canvas;
