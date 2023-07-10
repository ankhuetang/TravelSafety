import React from "react";
import "./ColorBar.css";
import ColorRange from "./ColorRange";

const ColorBar = () => {
  const colorRange = ColorRange.normalColors;
  const colorRange1 = ColorRange.darkerColors;
  return (
    <div>
      <div className="color-bar">
        {Object.entries(colorRange).map(([level, color]) => (
          <div
            key={level}
            className="color-segment"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
      <div className="color-bar">
        {Object.entries(colorRange1).map(([level, color]) => (
          <div
            key={level}
            className="color-segment"
            style={{ backgroundColor: color }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ColorBar;
