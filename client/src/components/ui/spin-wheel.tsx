import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { drawWheel, getWinningSegment } from "@/lib/wheel-utils";
import { toast } from "@/hooks/use-toast";

interface SpinWheelProps {
  segments: string[];
  colors: string[];
}

export function SpinWheel({ segments, colors }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 400;
    canvas.height = 400;
    
    drawWheel(ctx, segments, colors, rotation);
  }, [segments, colors, rotation]);

  const spin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    const targetRotation = rotation + 
      (Math.random() * 4 + 8) * Math.PI; // 4-12 full rotations
    
    let start: number | null = null;
    const duration = 5000; // 5 seconds
    
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = (timestamp - start) / duration;
      
      if (progress < 1) {
        // Ease out cubic
        const t = 1 - Math.pow(1 - progress, 3);
        setRotation(rotation + (targetRotation - rotation) * t);
        requestAnimationFrame(animate);
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
      <canvas
        ref={canvasRef}
        className="max-w-full"
      />
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
