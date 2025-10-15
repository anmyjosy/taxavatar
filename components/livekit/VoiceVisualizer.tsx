import React from 'react';
import { BarVisualizer, type TrackReference } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface VoiceVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  trackRef: TrackReference;
  isActive?: boolean;
}

export function VoiceVisualizer({ trackRef, className, isActive = true }: VoiceVisualizerProps) {
  return (
    <div className={cn('flex h-16 w-2/5 items-center justify-center', className)}>
      <BarVisualizer
        trackRef={trackRef}
        barCount={12}
        className={cn('h-full w-full', isActive ? 'opacity-100' : 'opacity-30')}
        // The color of the bars can be set via CSS custom property: --livekit-audio-visualizer-bar-color
        // Or by passing a `barColor` prop.
        state={isActive ? 'listening' : undefined}
        options={{ minHeight: 0.2 }}
      />
    </div>
  );
}
