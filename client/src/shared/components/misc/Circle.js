import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faCloud,
  faSnowflake,
  faCloudRain,
} from "@fortawesome/free-solid-svg-icons";
import { Box } from "@mui/joy";
import CircleStyle from "./CircleStyle"; // You can define the circle style in a separate file

const Circle = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null); // State to store the selected icon
  const icons = [faSun, faCloudRain, faCloud, faSnowflake];

  useEffect(() => {
    // Set the initial icon when the component mounts
    setSelectedIcon(getRandomIcon());
  }, []);

  const getRandomIcon = () => {
    const randomNumber = Math.random();
    if (randomNumber < 0.25) return icons[0]; // 25% chance for faSun
    else if (randomNumber < 0.5) return icons[1]; // 25% chance for faRain
    else if (randomNumber < 0.75) return icons[2]; // 25% chance for faCloud
    else return icons[3]; // 25% chance for faSnowflake
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleLeave = () => {
    setIsHovered(false);
  };

  return (
    <Box
      sx={CircleStyle(isHovered)}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <FontAwesomeIcon icon={selectedIcon} size="3x" />
    </Box>
  );
};

export default Circle;
