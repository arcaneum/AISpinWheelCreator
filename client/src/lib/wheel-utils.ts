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
  const radius = Math.min(width, height) / 2 - 20; // Reduced radius to accommodate pointer

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  const angleStep = (2 * Math.PI) / segments.length;

  // Draw segments
  segments.forEach((segment, i) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, i * angleStep, (i + 1) * angleStep);
    ctx.closePath();

    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw text
    ctx.save();
    const textAngle = i * angleStep + angleStep / 2;
    ctx.rotate(textAngle);
    ctx.translate(radius * 0.6, 0); // Position text at 60% of radius
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Wrap text if too long
    const maxWidth = radius * 0.4;
    const words = segment.split(' ');
    let line = '';
    let y = 0;

    words.forEach((word, index) => {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && index > 0) {
        ctx.fillText(line, 0, y);
        line = word + ' ';
        y += 20;
      } else {
        line = testLine;
      }
    });
    ctx.fillText(line, 0, y);

    ctx.restore();
  });

  // Draw center circle
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  // Draw pointer
  ctx.save();
  ctx.translate(centerX, centerY - radius);
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.moveTo(-15, -10);
  ctx.lineTo(15, -10);
  ctx.lineTo(0, 15);
  ctx.closePath();
  ctx.fill();
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

// Create audio context and spinning sound
let audioContext: AudioContext | null = null;

export async function playSpinSound() {
  if (!audioContext) {
    audioContext = new AudioContext();
  }

  const duration = 1;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(
    200,
    audioContext.currentTime + duration
  );

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration
  );

  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
}