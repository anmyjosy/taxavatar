import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Track } from 'livekit-client';
import {
  type TrackReference,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from '@livekit/components-react';
import { cn } from '@/lib/utils';
import { VoiceVisualizer } from '../livekit/VoiceVisualizer';
import { UserTile } from '../livekit/user-tile';
import { AgentTile } from './agent-tile';
import { AvatarTile } from './avatar-tile';

const MotionAgentTile = motion.create(AgentTile);
const MotionAvatarTile = motion.create(AvatarTile);
const MotionUserTile = motion.create(UserTile);

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
  const micTrack = useLocalTrackRef(Track.Source.Microphone);
  const [screenShareTrack] = useTracks([Track.Source.ScreenShare]);
  const cameraTrack: TrackReference | undefined = useLocalTrackRef(Track.Source.Camera);

  const isCameraEnabled = cameraTrack && !cameraTrack.publication.isMuted;
  const isScreenShareEnabled = screenShareTrack && !screenShareTrack.publication.isMuted;

  const transition = { ...animationProps.transition, delay: 0 };

  const agentAnimate = {
    ...animationProps.animate,
    scale: chatOpen ? 1 : 3,
    transition,
  };

  const avatarAnimate = { ...animationProps.animate, transition };
  const isAvatar = agentVideoTrack !== undefined;

  if (isMobile && chatOpen) {
    return (
      <div className="pointer-events-none absolute inset-0 z-50">
        <div className="relative mx-auto h-full max-w-full px-4 pt-26 md:px-0">
          <div className="grid h-full grid-cols-1 items-start justify-center gap-4">
            {/* Agent/Avatar */}
            <div className="flex flex-col items-center justify-start">
              <AnimatePresence mode="popLayout">
                {!isAvatar && (
                  <MotionAgentTile
                    key="agent"
                    layoutId="agent"
                    {...animationProps}
                    animate={agentAnimate}
                    transition={transition}
                    state={agentState}
                    audioTrack={agentAudioTrack}
                    className="h-[80px]"
                  />
                )}
                {isAvatar && (
                  <MotionAvatarTile
                    key="avatar"
                    layoutId="avatar"
                    {...animationProps}
                    animate={avatarAnimate}
                    transition={transition}
                    videoTrack={agentVideoTrack}
                    state={agentState}
                    className="h-40 w-40"
                  />
                )}
              </AnimatePresence>
            </div>
            {/* User */}
            <div className="flex flex-col items-center justify-start">
              {cameraTrack && isCameraEnabled && (
                <MotionUserTile
                  key="user-camera"
                  layout="position"
                  layoutId="camera"
                  {...animationProps}
                  videoTrack={cameraTrack}
                  transition={transition}
                  className="h-40 w-40"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      <div className="relative mx-auto h-full max-w-full px-4 md:px-0">
        {/* Switch layout depending on chat state */}
        <div
          className={cn(
            chatOpen
              ? 'grid h-full grid-cols-[1fr_auto_1fr] items-center' // 3 columns
              : 'flex h-full items-center justify-center'
          )}
        >
          {/* Left Spacer */}
          {chatOpen && <div className="w-full" />}

          {/* Center: Avatar / Agent */}
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
                    className={cn(chatOpen ? 'h-40 w-40' : 'h-auto w-full')}
                  />
                  {micTrack && (
                    <div className="flex w-full justify-center">
                      <VoiceVisualizer
                        trackRef={micTrack}
                        className="[--visualizer-color:black] dark:[--visualizer-color:white]"
                      />
                    </div>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: User camera / screen share */}
          {chatOpen && (
            <div className="flex h-full flex-col items-center justify-end space-y-4 p-4">
              <AnimatePresence>
                {cameraTrack && isCameraEnabled && (
                  <MotionUserTile
                    key="user-camera"
                    layout="position"
                    layoutId="camera"
                    {...animationProps}
                    videoTrack={cameraTrack}
                    transition={transition}
                    className="h-24 w-24"
                  />
                )}
                {isScreenShareEnabled && (
                  <MotionUserTile
                    key="user-screen"
                    layout="position"
                    layoutId="screen"
                    {...animationProps}
                    videoTrack={screenShareTrack}
                    transition={transition}
                    className="h-auto w-40"
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
