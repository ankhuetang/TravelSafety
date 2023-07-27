const CircleStyle = (isHovered) => ({
  width: "100px",
  height: "100px",
  borderRadius: "50%",
  background: "lightblue",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: isHovered ? "10%" : "0", // Slide down if hovered, otherwise halfway off the screen
  left: "50%",
  transform: "translate(-50%, -50%)",
  transition: "top 0.5s ease-in-out",
  zIndex: 2,
});

export default CircleStyle;
