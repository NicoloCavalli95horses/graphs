//==================================
// Const
//==================================
export const Screen = Object.freeze({
  yt_width: 1920,
  yt_height: 1080,
});


//==================================
// Functions
//==================================
export function getRgb( rgb ) {
  const match = rgb.match(/rgba?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
  return match ? { red: parseInt(match[1]), green: parseInt(match[2]), blue: parseInt(match[3]) } : {};
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}