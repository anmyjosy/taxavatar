import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Track } from 'livekit-client';
import {
  type TrackReference,
  useLocalParticipant,
  useVoiceAssistant,
} from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { VoiceVisualizer } from '../livekit/VoiceVisualizer';
import { AgentTile } from './agent-tile';
import { AvatarTile } from './avatar-tile';

const MotionAgentTile = motion.create(AgentTile);
const MotionAvatarTile = motion.create(AvatarTile);

const animationProps = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
  transition: {
    type: 'spring',
    stiffness: 675,
    damping: 75,
    mass: 1,
  } as const,
};

export function useLocalTrackRef(source: Track.Source) {
  const { localParticipant } = useLocalParticipant();
  const publication = localParticipant.getTrackPublication(source);
  const trackRef = useMemo<TrackReference | undefined>(
    () => (publication ? { source, participant: localParticipant, publication } : undefined),
    [source, publication, localParticipant]
  );
  return trackRef;
}

function useIsMobile(width = 740) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < width);
    }

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width]);

  return isMobile;
}

function useIsShort(height = 570) {
  const [isShort, setIsShort] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsShort(window.innerHeight < height);
    }

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  return isShort;
}

interface MediaTilesProps {
  chatOpen: boolean;
}

export function MediaTiles({ chatOpen }: MediaTilesProps) {
  const {
    state: agentState,
    audioTrack: agentAudioTrack,
    videoTrack: agentVideoTrack,
  } = useVoiceAssistant();

  const isMobile = useIsMobile();
  const isShort = useIsShort(570);
  const micTrack = useLocalTrackRef(Track.Source.Microphone);

  const transition = { ...animationProps.transition, delay: 0 };

  const agentAnimate = {
    ...animationProps.animate,
    scale: chatOpen || isMobile ? 1 : 3,
    transition,
  };

  const avatarAnimate = { ...animationProps.animate, transition };
  const isAvatar = agentVideoTrack !== undefined;

  return (
    <div className="flex flex-col items-center justify-center">
      <AnimatePresence mode="popLayout">
        {!isAvatar && (
          <MotionAgentTile
            key="agent"
            layoutId="agent"
            {...animationProps}
            animate={agentAnimate}
            transition={transition}
            state={agentState}
            audioTrack={agentAudioTrack} // smaller height
            className={cn(chatOpen ? 'h-[80px]' : 'h-auto w-full')}
          />
        )}
        {isAvatar && (
          <div className="flex flex-col items-center justify-center">
            <MotionAvatarTile
              key="avatar"
              layoutId="avatar"
              {...animationProps}
              animate={avatarAnimate}
              transition={transition}
              videoTrack={agentVideoTrack}
              state={agentState}
              className={cn(
                chatOpen
                  ? isShort
                    ? 'h-28 w-28'
                    : 'h-40 w-40'
                  : isMobile // When mobile, we want to remove the border
                    ? 'h-80 w-80'
                    : 'h-auto w-full',
                // When mobile, we want to remove the border
                isMobile && 'border-0 ring-0 outline-none'
              )}
            />
            {micTrack && (!chatOpen || !isMobile) && (
              <div className="flex w-full justify-center">
                <VoiceVisualizer
                  trackRef={micTrack}
                  className="mt-4 [--visualizer-color:black] dark:[--visualizer-color:white]"
                />
              </div>
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
