import { useContext } from 'react';
import classes from "./index.module.css";

import cx from "classnames";
import {
    FaSlash,
    FaRegCircle,
    FaArrowRight,
    FaPaintBrush,
    FaEraser,
    FaUndoAlt,
    FaRedoAlt,
    FaFont,
    FaDownload,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";

import { TOOL_ITEMS } from '../constants';
import boardContext from '../../store/board-context';

const Toolbar = () => {

    const { activeToolItem, toolChangeHandler, boardUndoHandler, boardRedoHandler } = useContext(boardContext);

    const downloadClickHandler = () => {
    const canvas = document.getElementById("canvas");
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "board.png";
    anchor.click();
  };

    return (
        <div className={classes.container}>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.BRUSH })} onClick={() => toolChangeHandler(TOOL_ITEMS.BRUSH)} ><FaPaintBrush /></div>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.LINE })} onClick={() => toolChangeHandler(TOOL_ITEMS.LINE)} ><FaSlash /></div>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.RECTANGLE })} onClick={() => toolChangeHandler(TOOL_ITEMS.RECTANGLE)} ><LuRectangleHorizontal /></div>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.CIRCLE })} onClick={() => toolChangeHandler(TOOL_ITEMS.CIRCLE)} ><FaRegCircle /></div>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.ARROW })} onClick={() => toolChangeHandler(TOOL_ITEMS.ARROW)} ><FaArrowRight /></div>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.TEXT })} onClick={() => toolChangeHandler(TOOL_ITEMS.TEXT)} ><FaFont /></div>
            <div className={cx(classes.toolItem, { [classes.active]: activeToolItem === TOOL_ITEMS.ERASER })} onClick={() => toolChangeHandler(TOOL_ITEMS.ERASER)} ><FaEraser /></div>
            <div className={(classes.toolItem)} onClick={boardUndoHandler} ><FaUndoAlt /></div>
            <div className={(classes.toolItem)} onClick={boardRedoHandler} ><FaRedoAlt /></div>
            <div className={(classes.toolItem)} onClick={downloadClickHandler} ><FaDownload /></div>
        </div>
    )
}

export default Toolbar;
