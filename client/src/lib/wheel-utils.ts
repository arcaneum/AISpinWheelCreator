export function generateColors(count: number): string[] {
  const hueStep = 360 / count;
  return Array.from({ length: count }, (_, i) => 
    `hsl(${i * hueStep}, 85%, 55%)`  // Increased saturation and brightness
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
  const radius = Math.min(width, height) / 2 - 40; // More padding for pointer

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  const angleStep = (2 * Math.PI) / segments.length;

  // Draw segments with shadow
  ctx.shadowBlur = 10;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  segments.forEach((segment, i) => {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, i * angleStep, (i + 1) * angleStep);
    ctx.closePath();

    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw text radially
    ctx.save();
    const textAngle = i * angleStep + angleStep / 2;
    ctx.rotate(textAngle);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calculate segment size for text fitting
    const segmentHeight = 2 * radius * Math.sin(angleStep / 2);
    const words = segment.split(' ');
    const totalLength = segment.length;

    // Dynamic font size calculation - more responsive
    let fontSize = Math.min(
      24, // Further reduced max font size for better mobile fit
      Math.max(
        10, // Further reduced min font size
        Math.floor(segmentHeight / (words.length * 1.8)) // Increased spacing factor for smaller text
      )
    );
    if (totalLength > 8) { // Reduced length threshold for more aggressive reduction
      fontSize = Math.min(fontSize, Math.floor(240 / totalLength)); // More aggressive length factor
    }


    ctx.font = `bold ${fontSize}px sans-serif`;

    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;

    const lineSpacing = fontSize * 1.2; // Adjusted line spacing
    let yOffset = -((words.length - 1) * lineSpacing) / 2; // Center text block vertically

    words.forEach((word, index) => {
      const distanceFromCenter = radius * 0.5; // Increased distanceFromCenter
      ctx.fillText(word, distanceFromCenter, yOffset);
      yOffset += lineSpacing;
    });

    ctx.restore();
  });

  // Draw center circle with gradient
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(1, '#e0e0e0');

  ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI * 2);
  ctx.fillStyle = gradient;
  ctx.fill();
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();

  // Draw pointer on the right side
  ctx.save();
  ctx.translate(centerX + radius, centerY);
  ctx.fillStyle = '#333';
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(10, -15);
  ctx.lineTo(-15, 0);
  ctx.lineTo(10, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function getWinningSegment(
  segments: string[],
  rotation: number
): string {
  const segmentAngle = (2 * Math.PI) / segments.length;
  const normalizedRotation = (rotation % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  // Corrected index calculation - reversed rotation
  const index = Math.floor((2*Math.PI - normalizedRotation) / segmentAngle) % segments.length;
  return segments[index];
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

// Function to generate wheel options using AI
export async function generateWheelOptions(prompt: string): Promise<string[]> {
  try {
    const response = await fetch('/api/generate-options', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate options');
    }

    const data = await response.json();
    return data.options;
  } catch (error) {
    console.error('Error generating options:', error);
    throw error;
  }
}
