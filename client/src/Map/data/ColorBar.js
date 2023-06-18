import React from 'react'
import "./ColorBar.css"
import ColorRange from './ColorRange'

const ColorBar = () => {
    const colorRange = ColorRange.normalColors;
    return (
        <div className="color-bar">
            {Object.entries(colorRange).map(([level, color]) => (
                <div key={level} className="color-segment" style={{ backgroundColor: color }}></div>
            ))}
        </div>
    )
}

export default ColorBar;