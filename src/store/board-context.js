import { createContext } from "react";

// Create a context for the board state and to manage the active tool item, elements, and tool actions

const boardContext = createContext({
    activeToolItem : "",
    elements : [],
    toolActionType : "",
    history : [[]],
    index : 0,
    toolChangeHandler : () => {},
    boardMouseDownHandler : () => {},
    boardMouseMoveHandler : () => {},
    boardMouseUpHandler : () => {},
    textAreaBlurHandler : () => {},
    boardUndoHandler : () => {},
    boardRedoHandler : () => {},
    setInitialElements : () => {}
});

export default boardContext;