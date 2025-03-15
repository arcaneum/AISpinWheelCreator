import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { drawWheel, getWinningSegment, playSpinSound } from "@/lib/wheel-utils";
import { toast } from "@/hooks/use-toast";

interface SpinWheelProps {
  segments: string[];
  colors: string[];
}

export function SpinWheel({ segments, colors }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [size, setSize] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      const containerWidth = window.innerWidth * (window.innerWidth < 768 ? 0.9 : 0.8);
      setSize(Math.min(containerWidth, 500));
    };

    // Initial size
    updateSize();

    // Update size on window resize
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    drawWheel(ctx, segments, colors, rotation);
  }, [segments, colors, rotation, size]);

  const spin = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    const targetRotation = rotation + 
      (Math.random() * 4 + 8) * Math.PI; // 4-12 full rotations

    let start: number | null = null;
    const duration = 5000; // 5 seconds

    // Play spin sound
    await playSpinSound();

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;

      if (progress < 1) {
        // Ease out cubic
        const t = 1 - Math.pow(1 - progress, 3);
        setRotation(rotation + (targetRotation - rotation) * t);
        requestAnimationFrame(animate);

        // Play sound at intervals during spin
        if (progress > 0.1 && progress < 0.8 && Math.random() < 0.1) {
          playSpinSound();
        }
      } else {
        setRotation(targetRotation);
        setIsSpinning(false);
        const winner = getWinningSegment(segments, targetRotation);
        toast({
          title: "The wheel has spoken!",
          description: `It landed on: ${winner}`,
        });
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="max-w-full"
          style={{ width: size, height: size }}
        />
      </div>
      <Button 
        onClick={spin}
        disabled={isSpinning}
        className="w-32"
      >
        {isSpinning ? "Spinning..." : "Spin!"}
      </Button>
    </div>
  );
}