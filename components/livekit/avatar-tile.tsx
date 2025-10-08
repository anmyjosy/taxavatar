import { forwardRef } from 'react';
import { type AgentState, type TrackReference, VideoTrack } from '@livekit/components-react';
import { cn } from '@/lib/utils';
import styles from './avatar-tile.module.css';

interface AvatarTileProps {
  videoTrack: TrackReference;
  className?: string;
  state?: AgentState;
}

export const AvatarTile = forwardRef<HTMLDivElement, AvatarTileProps>(
  ({ videoTrack, className, state = 'idle' }, ref) => {
    const isSpeaking = state === 'speaking';

    return (
      <div className="relative flex items-center justify-center">
        {/* Glow when speaking */}
        {isSpeaking && (
          <div
            className={cn(
              'absolute rounded-full',
              'h-72 w-72 sm:h-80 sm:w-80', // always square
              styles.glow
            )}
          />
        )}

        {/* Avatar */}
        <div
          ref={ref}
          className={cn(
            'relative aspect-square overflow-hidden rounded-full border-2', // 👈 forces circle
            'h-56 w-56 sm:h-72 sm:w-72', // same ratio across devices
            isSpeaking ? 'border-transparent' : 'border-gray-600',
            className
          )}
        >
          <VideoTrack
            trackRef={videoTrack}
            width={videoTrack?.publication.dimensions?.width ?? 0}
            height={videoTrack?.publication.dimensions?.height ?? 0}
            className="aspect-square h-full w-full rounded-full object-cover" // 👈 locks circle
          />
        </div>
      </div>
    );
  }
);
