// @ts-nocheck

const beginner = {
  text: "#595959",
  border: "#D9D9D9",
  primary: "#F5F5F5",
  secondary: "#BFBFBF",
};
  
const bronze = {
  text: "#FA541C",
  border: "#FFBB96",
  primary: "#FFF2E8",
  secondary: "#FA541C",
};
  
const silver = {
  text: "#1890FF",
  border: "#91D5FF",
  primary: "#E6F7FF",
  secondary: "#40A9FF",
};
  
const gold = {
  text: "#FAAD14",
  border: "#FFE58F",
  primary: "#FFFBE6",
  secondary: "#FFC53D",
};
  
const platinum = {
  text: "#13C2C2",
  border: "#87E8DE",
  primary: "#E6FFFB",
  secondary: "#13C2C2",
};
  
const titanium = {
  text: "#722ED1",
  border: "#D3ADF7",
  primary: "#F9F0FF",
  secondary: "#722ED1",
};
  
const diamond = {
  text: "#2F54EB",
  border: "#ADC6FF",
  primary: "#F0F5FF",
  secondary: "#2F54EB",
};
  
const ColorMap = {
  beginner,
  bronze,
  silver,
  gold,
  platinum,
  titanium,
  diamond,
};
  
const availableColors = (totalLevels) => {
  const levelColors = {
    beginner: true,
    bronze: totalLevels > 3,
    silver: totalLevels > 2,
    gold: true,
    platinum: totalLevels > 4,
    titanium: totalLevels > 5,
    diamond: totalLevels > 6,
  };
  
  return Object.keys(levelColors).filter((c) => levelColors[c]);
};
  
// `levelPosition` refers to the level's position relative the other levels in the account. This is not always the
//    level's index since it's possible for gaps in level indexes to exist. e.g. for an account
//    with levels with indexes 0,1,2,4,5, the corresponding levelPositions would be 0,1,2,3,4
export const levelColor = (totalLevels, levelPosition) => {
  const filteredColors = availableColors(totalLevels);
  return ColorMap[filteredColors[levelPosition]];
};

export const levelColorPalette = (totalLevels) => {
  return availableColors(totalLevels).map((color) => ColorMap[color]);
};
