import { createContext } from "react";

// Create a context for the toolbox state and to manage the stroke color

const toolboxContext = createContext({
    toolboxState: {},
    changeStrokeColor: () => {},
    changeFillColor: () => {},
    changeSize: () => {}
});

export default toolboxContext;