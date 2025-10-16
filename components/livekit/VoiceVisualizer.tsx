'use client';

import React from 'react';
import { BarVisualizer, type TrackReference } from '@livekit/components-react';
import { cn } from '@/lib/utils';

interface VoiceVisualizerProps {
  trackRef: TrackReference;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ trackRef, className }) => {
  return (
    <BarVisualizer
      trackRef={trackRef}
      barCount={20}
      className={cn('flex h-8 w-full items-center justify-center gap-1', className)}
      options={{ minHeight: 8, maxHeight: 32 }}
    >
      <span
        className={cn([
          'block w-[6px] rounded-full bg-[var(--visualizer-color,white)]',
          'transition-all duration-200 ease-out',
        ])}
        style={{
          height: '5px',
          width: '3px',
        }}
      />
    </BarVisualizer>
  );
};
