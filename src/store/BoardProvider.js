import { useCallback, useReducer } from 'react';
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from '../components/constants';
import boardContext from './board-context';
import { createElement, getSvgPathFromStroke, isPointNearElement } from '../utils/element';
import getStroke from 'perfect-freehand';

// Reducer function to manage the board state
const boardReducer = (state, action) => {
    switch (action.type) {
        case BOARD_ACTIONS.CHANGE_TOOL:

            return {
                ...state,
                activeToolItem: action.payload.toolItem
            }

        case BOARD_ACTIONS.DRAW_DOWN:
            {
                const { clientX, clientY, strokeColor, fillColor, size } = action.payload;
                const newElement = createElement(
                    state.elements.length,
                    clientX,
                    clientY,
                    clientX,
                    clientY,
                    { type: state.activeToolItem, strokeColor, fillColor, size }
                )
                const prevElements = [...state.elements];
                return {
                    ...state,
                    elements: [...prevElements, newElement],
                    toolActionType: state.activeToolItem === TOOL_ITEMS.TEXT ? TOOL_ACTION_TYPES.WRITING : TOOL_ACTION_TYPES.DRAWING,
                }
            };
        case BOARD_ACTIONS.DRAW_MOVE:
            {
                if (state.toolActionType !== TOOL_ACTION_TYPES.DRAWING) {
                    return state;
                }
                const { clientX, clientY, strokeColor, fillColor, size } = action.payload;
                const newElements = [...state.elements];
                const index = state.elements.length - 1;
                const { x1, y1 } = newElements[index];
                switch (state.activeToolItem) {
                    case TOOL_ITEMS.LINE:
                    case TOOL_ITEMS.RECTANGLE:
                    case TOOL_ITEMS.CIRCLE:
                    case TOOL_ITEMS.ARROW:
                        newElements[index] = createElement(index, x1, y1, clientX, clientY, { type: state.activeToolItem, strokeColor, fillColor, size });
                        return {
                            ...state,
                            elements: newElements
                        }
                    case TOOL_ITEMS.BRUSH:
                        const strokeOptions = {
                            size, // Adjust this value to control stroke width
                            thinning: 0.5, // optional: uniform thickness
                            smoothing: 0.5, // optional: smooths the path
                            streamline: 0.5, // optional: smooths the input points
                            simulatePressure: true // optional: disables pressure-based width
                        };
                        newElements[index].points = [...newElements[index].points, { x: clientX, y: clientY }];
                        newElements[index].path = new Path2D(getSvgPathFromStroke(getStroke(newElements[index].points, strokeOptions)));
                        return {
                            ...state,
                            elements: newElements,

                        }
                    default:
                        throw new Error("Type not recognized");
                }
            };
        case BOARD_ACTIONS.CHANGE_ACTION_TYPE:
            return {
                ...state,
                toolActionType: action.payload.toolActionType
            }
        case BOARD_ACTIONS.ERASE:
            const { clientX, clientY } = action.payload;
            let newElements = [...state.elements];
            let newFilteredElements = newElements.filter((element) => {
                return !isPointNearElement(element, clientX, clientY);
            })
            if (newFilteredElements.length === newElements.length) {
                // If no element was erased, we return the state as is
                return state;
            }
            // Save the current state to history
            const newHistory = state.history.slice(0, state.index + 1);
            newHistory.push(newElements);
            return {
                ...state,
                elements: newFilteredElements,
                history: newHistory,
                index: state.index + 1
            }
        case BOARD_ACTIONS.CHANGE_TEXT:
            {
                const { text } = action.payload;
                const newElements = [...state.elements];
                const Index = newElements.length - 1;
                newElements[Index].text = text;
                // Save the current state to history
                const newHistory = state.history.slice(0, state.index + 1);
                newHistory.push(newElements);
                return {
                    ...state,
                    elements: newElements,
                    history: newHistory,
                    index: state.index + 1,
                    toolActionType: TOOL_ACTION_TYPES.NONE
                }
            }
        case BOARD_ACTIONS.DRAW_UP:
            // When the mouse is released, we save the current state to history
            {
                const newElements = [...state.elements];
                const newHistory = state.history.slice(0, state.index + 1);
                newHistory.push(newElements);
                return {
                    ...state,
                    history: newHistory,
                    index: state.index + 1
                }
            }
        case BOARD_ACTIONS.UNDO:
            if (state.index === 0) return state;
            const prevIndex = state.index - 1;
            const prevElements = state.history[prevIndex];
            return {
                ...state,
                elements: prevElements,
                index: prevIndex,
                toolActionType: TOOL_ACTION_TYPES.NONE
            }
        case BOARD_ACTIONS.REDO:
            if (state.index === state.history.length - 1) return state;
            const nextIndex = state.index + 1;
            const nextElements = state.history[nextIndex];
            return {
                ...state,
                elements: nextElements,
                index: nextIndex,
                toolActionType: TOOL_ACTION_TYPES.NONE
            }
            case BOARD_ACTIONS.SET_INITIAL_ELEMENTS:
                {
                    const { elements } = action.payload;
                    return {
                        ...state,
                        elements: [...elements],
                        history: [ [...elements] ],
                        index: 0
                    };
                }
                


        default:
            return state;
    }
}

// Initial state for the board
const initialBoardState = {
    activeToolItem: TOOL_ITEMS.BRUSH,
    elements: [],
    toolActionType: TOOL_ACTION_TYPES.NONE,
    history: [[]],
    index: 0
}

const BoardProvider = ({ children, initialElements = []}) => {

    // Use the useReducer hook to manage the board state
    const [boardState, dispatchBoardAction] = useReducer(boardReducer, {
        ...initialBoardState,
        elements: [...initialElements],
        history: [ [...initialElements] ],
    });

    // Function to handle tool item click
    const toolChangeHandler = (toolItem) => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_TOOL,
            payload: {
                toolItem,
            }
        });
    };

    // Function to handle mouse down event on the board
    const boardMouseDownHandler = (event, toolboxState) => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
        const { clientX, clientY } = event;

        if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
                payload: {
                    toolActionType: TOOL_ACTION_TYPES.ERASING
                }
            })
            return;
        }

        dispatchBoardAction({
            type: BOARD_ACTIONS.DRAW_DOWN,
            payload: {
                clientX,
                clientY,
                strokeColor: toolboxState[boardState.activeToolItem]?.strokeColor,
                fillColor: toolboxState[boardState.activeToolItem]?.fillColor,
                size: toolboxState[boardState.activeToolItem]?.size
            }
        });
    }


    // Function to handle mouse move event on the board
    const boardMouseMoveHandler = (event, toolboxState) => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
        const { clientX, clientY } = event;
        if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.DRAW_MOVE,
                payload: {
                    clientX,
                    clientY,
                    strokeColor: toolboxState[boardState.activeToolItem]?.strokeColor,
                    fillColor: toolboxState[boardState.activeToolItem]?.fillColor,
                    size: toolboxState[boardState.activeToolItem]?.size
                }
            });
        } else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.ERASE,
                payload: {
                    clientX,
                    clientY
                }
            });
        }
    }

    // Function to handle mouse up event on the board
    const boardMouseUpHandler = () => {
        if (boardState.toolActionType === TOOL_ACTION_TYPES.WRITING) return;
        if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
            dispatchBoardAction({
                type: BOARD_ACTIONS.DRAW_UP
            });
        }
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_ACTION_TYPE,
            payload: {
                toolActionType: TOOL_ACTION_TYPES.NONE
            }
        });
    }

    const textAreaBlurHandler = (event) => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.CHANGE_TEXT,
            payload: {
                text: event.target.value
            }
        })
    }

    const boardUndoHandler = useCallback(() => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.UNDO
        });
    }, []);

    const boardRedoHandler = useCallback(() => {
        dispatchBoardAction({
            type: BOARD_ACTIONS.REDO
        });
    }, []);

    const setInitialElements = useCallback((elements) => {
        dispatchBoardAction({
          type: BOARD_ACTIONS.SET_INITIAL_ELEMENTS,
          payload: { elements }
        });
      }, []);
      

    // Create the context value to be provided to the children components
    const boardContextValue = {
        activeToolItem: boardState.activeToolItem,
        elements: boardState.elements,
        toolActionType: boardState.toolActionType,
        toolChangeHandler,
        boardMouseDownHandler,
        boardMouseMoveHandler,
        boardMouseUpHandler,
        textAreaBlurHandler,
        boardUndoHandler,
        boardRedoHandler,
        setInitialElements
    };


    return (
        <boardContext.Provider value={boardContextValue}>
            {children}
        </boardContext.Provider>
    )
}

export default BoardProvider;
