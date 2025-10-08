import { Track } from 'livekit-client';
import { BarVisualizer, type TrackReference, VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { useLocalTrackRef } from './media-tiles';

interface UserTileProps {
  videoTrack: TrackReference;
  className?: string;
}

export const UserTile = ({
  videoTrack,
  className,
  ref,
}: React.ComponentProps<'div'> & UserTileProps) => {
  const micTrack = useLocalTrackRef(Track.Source.Microphone);

  return (
    <div ref={ref} className={cn('relative', className)}>
      {/* Avatar */}
      <div className="relative aspect-square w-full overflow-hidden rounded-full">
        <VideoTrack
          trackRef={videoTrack}
          className="absolute top-1/2 left-1/2 h-full w-auto -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      <BarVisualizer
        trackRef={micTrack}
        className="absolute -bottom-4 left-1/2 h-4 w-1/2 -translate-x-1/2"
      >
        <span
          className={cn([
            'bg-muted min-h-4 w-4 rounded-full',
            'origin-center transition-colors duration-250 ease-linear',
            'data-[lk-highlighted=true]:bg-foreground data-[lk-muted=true]:bg-muted',
          ])}
        />
      </BarVisualizer>
    </div>
  );
};
