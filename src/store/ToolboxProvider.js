import { COLORS, TOOL_ITEMS, TOOLBOX_ACTIONS } from '../components/constants';
import ToolboxContext from './toolbox-context'
import { useReducer } from 'react';

// Reducer function to manage the toolbox state
const toolboxReducer = (state, action) => {
    switch (action.type) {
        case TOOLBOX_ACTIONS.CHANGE_STROKE:
            {
                const { toolItem, strokeColor } = action.payload;
                const newState = { ...state };
                newState[toolItem].strokeColor = strokeColor;
                return newState;
            }
        case TOOLBOX_ACTIONS.CHANGE_FILL:
            {
                const { toolItem, fillColor } = action.payload;
                const newState = { ...state };
                newState[toolItem].fillColor = fillColor;
                return newState;
            }
        case TOOLBOX_ACTIONS.CHANGE_SIZE:
            {
                const { toolItem, size } = action.payload;
                const newState = { ...state };
                newState[toolItem].size = size;
                return newState;
            }
        default:
            return state;
    }
}

// Initial state for the toolbox
const initialToolboxState = {
    [TOOL_ITEMS.LINE]: {
        strokeColor: COLORS.BLACK,
        size: 2
    },
    [TOOL_ITEMS.RECTANGLE]: {
        strokeColor: COLORS.BLACK,
        fillColor: null,
        size: 2
    },
    [TOOL_ITEMS.CIRCLE]: {
        strokeColor: COLORS.BLACK,
        fillColor: null,
        size: 2
    },
    [TOOL_ITEMS.ARROW]: {
        strokeColor: COLORS.BLACK,
        size: 2
    },
    [TOOL_ITEMS.BRUSH]: {
        strokeColor: COLORS.BLACK,
        size: 10
    },
    [TOOL_ITEMS.TEXT]: {
        strokeColor: COLORS.BLACK,
        size: 32
    }
}

const ToolboxProvider = ({ children }) => {

    // Using useReducer to manage the toolbox state
    const [toolboxState, dispatchToolboxAction] = useReducer(toolboxReducer, initialToolboxState);

    // Handler function to change the stroke color of a tool item
    const changeStrokeColorHandler = (toolItem, strokeColor) => {
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_STROKE,
            payload: {
                toolItem,
                strokeColor,
            }
        })
    }

    // Handler function to change the fill color of a tool item
    const changeFillColorHandler = (toolItem, fillColor) => {
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_FILL,
            payload: {
                toolItem,
                fillColor,
            }
        })
    }

    // Handler function to change the size of a tool item
    const changeSizeHandler = (toolItem, size) => {
        dispatchToolboxAction({
            type: TOOLBOX_ACTIONS.CHANGE_SIZE,
            payload: {
                toolItem,
                size,
            }
        })
    }

    // Context value to be provided to the children components
    const toolboxContextValue = {
        toolboxState,
        changeStrokeColor: changeStrokeColorHandler,
        changeFillColor: changeFillColorHandler,
        changeSize: changeSizeHandler,
    }

    return (
        <ToolboxContext.Provider value={toolboxContextValue}>
            {children}
        </ToolboxContext.Provider>
    )
}

export default ToolboxProvider;
