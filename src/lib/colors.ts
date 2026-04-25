export const wheelColors = [
  '#ffe600',
  '#12162c',
  '#ffffff',
  '#ff7a00',
  '#2b2d48',
  '#e82010',
  '#ffd23f',
  '#363957',
] as const;

export function getWheelColor(index: number): string {
  return wheelColors[index % wheelColors.length] ?? wheelColors[0];
}

export function getWheelTextColor(index: number): string {
  const color = getWheelColor(index);

  return color === '#ffe600' || color === '#ffffff' || color === '#ffd23f' ? '#12162c' : '#ffffff';
}
