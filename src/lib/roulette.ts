export const spinDuration = 4200;

export function draw(count: number, currentAngle: number) {
  if (count < 1) return null;

  const index = Math.floor(Math.random() * count);
  const sectorCenter = (index + 0.5) * 360 / count;
  const target = (360 - sectorCenter) % 360;
  const distance = (target - currentAngle % 360 + 360) % 360;
  return { index, angle: currentAngle + 5 * 360 + distance };
}