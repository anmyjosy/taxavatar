import React, { useEffect, useRef } from "react";
import { type TrackReference } from "@livekit/components-react";
import { cn } from "@/lib/utils";

interface VoiceVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  trackRef: TrackReference;
}

export function VoiceVisualizer({ trackRef, className, ...props }: VoiceVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!trackRef.publication?.track) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(
      new MediaStream([trackRef.publication.track.mediaStreamTrack])
    );

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128; // fewer bars for a neat line
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let animationFrame: number;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      // Get color from CSS custom property
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 1.5;
      const minHeight = canvas.height * 0.05; // <-- baseline height (5% of canvas height)
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // keep bars small (max 30% of canvas height)
        let barHeight = ((dataArray[i] / 255) * canvas.height) * 0.3;

        // ensure at least baseline height
        barHeight = Math.max(barHeight, minHeight);

        ctx.fillStyle = getComputedStyle(canvas).getPropertyValue('--visualizer-color').trim() || 'white';
        ctx.beginPath();
        ctx.roundRect(
          x,
          canvas.height / 2 - barHeight / 2, // center vertically
          barWidth,
          barHeight,
          2 // rounded edges
        );
        ctx.fill();

        x += barWidth + 2;
      }

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resizeCanvas);
      audioContext.close();
    };
  }, [trackRef]);

  return (
    <div className={cn("w-full flex justify-center mt-4", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="w-2/5 h-16 rounded-full bg-transparent"
      />
    </div>
  );
}
