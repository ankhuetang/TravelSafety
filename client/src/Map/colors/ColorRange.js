const generateColorRange = (startColor, middleColor, endColor, count) => {
  const startRGB = hexToRGB(startColor);
  const middleRGB = hexToRGB(middleColor);
  const endRGB = hexToRGB(endColor);
  const normalColors = {};
  const darkerColors = {};

  const firstHalfCount = Math.floor(count / 2); // Number of colors in the first half
  const secondHalfCount = count - firstHalfCount; // Number of colors in the second half

  for (let i = 0; i < firstHalfCount; i++) {
    const ratio = i / (firstHalfCount - 1); // Calculate the ratio based on the current index
    const r = Math.round(startRGB.r + (middleRGB.r - startRGB.r) * ratio);
    const g = Math.round(startRGB.g + (middleRGB.g - startRGB.g) * ratio);
    const b = Math.round(startRGB.b + (middleRGB.b - startRGB.b) * ratio);
    const hexColor = RGBToHex(r, g, b);
    normalColors[String(i + 1)] = hexColor;

    // Generate darker color by reducing RGB values
    const darkerR = Math.max(Math.round(r - 50), 0);
    const darkerG = Math.max(Math.round(g - 50), 0);
    const darkerB = Math.max(Math.round(b - 50), 0);
    const darkerHexColor = RGBToHex(darkerR, darkerG, darkerB);
    darkerColors[String(i + 1)] = darkerHexColor;
  }

  for (let i = 0; i < secondHalfCount; i++) {
    const ratio = i / (secondHalfCount - 1); // Calculate the ratio based on the current index
    const r = Math.round(middleRGB.r + (endRGB.r - middleRGB.r) * ratio);
    const g = Math.round(middleRGB.g + (endRGB.g - middleRGB.g) * ratio);
    const b = Math.round(middleRGB.b + (endRGB.b - middleRGB.b) * ratio);
    const hexColor = RGBToHex(r, g, b);
    normalColors[String(firstHalfCount + i + 1)] = hexColor;

    // Generate darker color by reducing RGB values
    const darkerR = Math.max(Math.round(r - 50), 0);
    const darkerG = Math.max(Math.round(g - 50), 0);
    const darkerB = Math.max(Math.round(b - 50), 0);
    const darkerHexColor = RGBToHex(darkerR, darkerG, darkerB);
    darkerColors[String(firstHalfCount + i + 1)] = darkerHexColor;
  }

  const colors = {
    normalColors,
    darkerColors,
  };
  
  return colors;
};

const hexToRGB = (hexColor) => {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
};

const RGBToHex = (r, g, b) => {
  const rHex = r.toString(16).padStart(2, "0");
  const gHex = g.toString(16).padStart(2, "0");
  const bHex = b.toString(16).padStart(2, "0");
  return `#${rHex}${gHex}${bHex}`;
};

export default generateColorRange("#ff1744", "#ffeb3b", "#4caf50", 100);
