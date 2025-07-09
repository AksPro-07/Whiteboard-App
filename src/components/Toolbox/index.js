import { useContext } from 'react';
import { COLORS, STROKE_TOOL_TYPES, FILL_TOOL_TYPES, SIZE_TOOL_TYPES, TOOL_ITEMS } from '../constants';
import classes from './index.module.css';
import cx from 'classnames';
import toolboxContext from '../../store/toolbox-context';
import boardContext from '../../store/board-context';

const Toolbox = () => {
    const { activeToolItem } = useContext(boardContext);
    const { toolboxState, changeStrokeColor, changeFillColor, changeSize } = useContext(toolboxContext);

    // Get the stroke color for the active tool item
    const strokeColor = toolboxState[activeToolItem]?.strokeColor;
    // Get the fill color for the active tool item
    const fillColor = toolboxState[activeToolItem]?.fillColor;
    // Get the size for the active tool item
    const size = toolboxState[activeToolItem]?.size;



    return (
        <div className={classes.container}>
            {STROKE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLabel}>Stroke Color</div>
                <div className={classes.colorsContainer}>
                    <div>
                        <input className={classes.colorPicker} type="color" value={strokeColor} onChange={(e) => changeStrokeColor(activeToolItem, e.target.value)}></input>
                    </div>
                    {Object.keys(COLORS).map((c) => {
                        return (
                            <div key={c} className={cx(classes.colorBox, { [classes.activeColorBox]: strokeColor === COLORS[c] })} style={{ backgroundColor: COLORS[c] }} onClick={() => changeStrokeColor(activeToolItem, COLORS[c])}></div>
                        )
                    }
                    )}
                </div>
            </div>}
            {FILL_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLabel}>Fill Color</div>
                <div className={classes.colorsContainer}>

                    {fillColor === null ? (
                        <div className={cx(classes.colorPicker, classes.noFillColorBox)} onClick={() => changeFillColor(activeToolItem, COLORS.BLACK)} ></div>)
                        : (
                            <div> <input className={classes.colorPicker} type="color" value={fillColor} onChange={(e) => changeFillColor(activeToolItem, e.target.value)} ></input> </div>
                        )}
                    <div className={cx(classes.colorBox, classes.noFillColorBox, { [classes.activeColorBox]: fillColor === null })} onClick={() => changeFillColor(activeToolItem, null)}></div>

                    {Object.keys(COLORS).map((c) => {
                        return (
                            <div key={c} className={cx(classes.colorBox, { [classes.activeColorBox]: fillColor === COLORS[c] })} style={{ backgroundColor: COLORS[c] }} onClick={() => changeFillColor(activeToolItem, COLORS[c])}></div>
                        )
                    }
                    )}
                </div>
            </div>}
            {SIZE_TOOL_TYPES.includes(activeToolItem) && <div className={classes.selectOptionContainer}>
                <div className={classes.toolBoxLabel}>{
                    activeToolItem === TOOL_ITEMS.TEXT ? "Font Size" : "Brush Size"}
                </div>
                <input
                    type="range"
                    min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
                    max={activeToolItem === TOOL_ITEMS.TEXT ? 128 : 30}
                    value={size}
                    step={activeToolItem === TOOL_ITEMS.TEXT ? 4 : 1}
                    className='cursor-pointer'
                    onChange={(e) => changeSize(activeToolItem, e.target.value)}
                />
            </div>}
        </div >
    )
}

export default Toolbox;