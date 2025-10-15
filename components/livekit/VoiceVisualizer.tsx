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
      className={cn('flex aspect-video w-40 items-center justify-center gap-1', className)}
    >
      <span
        className={cn([
          'bg-muted h-2 w-2 rounded-full',
          'origin-center transition-colors duration-250 ease-linear',
          'data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted',
        ])}
      />
    </BarVisualizer>
  );
};
