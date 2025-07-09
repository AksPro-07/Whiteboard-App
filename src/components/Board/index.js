import { useContext, useEffect, useLayoutEffect, useRef } from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import toolboxContext from "../../store/toolbox-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constants";
import classes from "./index.module.css";
import { useParams } from "react-router-dom";
import { updateCanvas } from "../../utils/api";
import { getSvgPathFromStroke } from "../../utils/element";
import getStroke from "perfect-freehand";


const Board = () => {
  const canvasRef = useRef(null);
  const textAreaRef = useRef(null);
  const { elements, toolActionType, boardMouseDownHandler, boardMouseMoveHandler, boardMouseUpHandler, textAreaBlurHandler, boardUndoHandler, boardRedoHandler } = useContext(boardContext);
  const { toolboxState } = useContext(toolboxContext);
  const { uuid } = useParams();


  useEffect(() => {

    // Initialize canvas
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

  }, []);

  useLayoutEffect(() => {

    // Clear the canvas and draw elements
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.save();

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          const strokeOptions = {
            size: element.size,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
            simulatePressure: true
          };
          ctx.fillStyle = element.strokeColor;
          const brushPath = element.path ? element.path : new Path2D(getSvgPathFromStroke(getStroke(element.points, strokeOptions)));
          ctx.fill(brushPath);
          ctx.restore();
          break;
        case TOOL_ITEMS.TEXT:
          ctx.textBaseline = "top";
          ctx.font = `${element.size}px Caveat`;
          ctx.fillStyle = element.strokeColor;
          ctx.fillText(element.text, element.x1, element.y1);
          ctx.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [elements]);

  useEffect(() => {

    // Clear the canvas and draw elements
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.save();

    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      
      console.log(elements);
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          const strokeOptions = {
            size: element.size,
            thinning: 0.5,
            smoothing: 0.5,
            streamline: 0.5,
            simulatePressure: true
          };
          ctx.fillStyle = element.strokeColor;
          const brushPath = element.path ? element.path : new Path2D(getSvgPathFromStroke(getStroke(element.points, strokeOptions)));
          ctx.fill(brushPath);
          ctx.restore();
          break;
        case TOOL_ITEMS.TEXT:
          ctx.textBaseline = "top";
          ctx.font = `${element.size}px Caveat`;
          ctx.fillStyle = element.strokeColor;
          ctx.fillText(element.text, element.x1, element.y1);
          ctx.restore();
          break;
        default:
          throw new Error("Type not recognized");
      }
    });

    return () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, []);


  useEffect(() => {
    // Focus the textarea when toolActionType is WRITING
    const textArea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textArea.focus();
      }, 0);
    }
  }, [toolActionType]);

  useEffect(() => {
    // Handle keyboard shortcuts for undo and redo
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        boardUndoHandler();
      } else if (event.ctrlKey && event.key === "y") {
        boardRedoHandler();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, [boardUndoHandler, boardRedoHandler]);

  const handleBoardMouseDown = (event) => {
    boardMouseDownHandler(event, toolboxState);
  };

  const handleBoardMouseMove = (event) => {
    boardMouseMoveHandler(event, toolboxState);
  };

  const handleBoardMouseUp = (event) => {
    boardMouseUpHandler(event);
    updateCanvas(uuid, elements);
  };

  return (
    <>
      {
        toolActionType === TOOL_ACTION_TYPES.WRITING &&
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.strokeColor,
          }}
          onBlur={textAreaBlurHandler}
        />
      }
      <canvas ref={canvasRef} id="canvas" onMouseDown={handleBoardMouseDown} onMouseMove={handleBoardMouseMove} onMouseUp={handleBoardMouseUp} />
    </>
  );
}

export default Board;

