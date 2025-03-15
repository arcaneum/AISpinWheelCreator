export function generateColors(count: number): string[] {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => 
    `hsl(${i * hueStep}, 70%, 50%)`
  );
}

export function drawWheel(
  ctx: CanvasRenderingContext2D,
  segments: string[],
  colors: string[],
  rotation: number = 0
) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 10;
  
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  const angleStep = (2 * Math.PI) / segments.length;
  
  segments.forEach((segment, i) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, i * angleStep, (i + 1) * angleStep);
    ctx.closePath();
    
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke();

    // Draw text
    ctx.save();
    ctx.rotate(i * angleStep + angleStep / 2);
    ctx.translate(radius / 2, 0);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = 'white';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(segment, 0, 0);
    ctx.restore();
  });

  ctx.restore();
}

export function getWinningSegment(
  segments: string[],
  rotation: number
): string {
  const segmentAngle = (2 * Math.PI) / segments.length;
  const normalizedRotation = (rotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  const index = Math.floor(segments.length - (normalizedRotation / segmentAngle));
  return segments[index % segments.length];
}
