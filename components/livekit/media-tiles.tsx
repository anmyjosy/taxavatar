import React, { useMemo } from 'react';
import { Track } from 'livekit-client';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type TrackReference,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from '@livekit/components-react';
import { AgentTile } from './agent-tile';
import { AvatarTile } from './avatar-tile';
import { VoiceVisualizer } from '../livekit/VoiceVisualizer';
import { cn } from '@/lib/utils';
import { UserTile } from '../livekit/user-tile';
import { ChatInput } from '@/components/livekit/chat/chat-input';

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
    () =>
      publication
        ? { source, participant: localParticipant, publication }
        : undefined,
    [source, publication, localParticipant],
  );
  return trackRef;
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

  const micTrack = useLocalTrackRef(Track.Source.Microphone);
  const [screenShareTrack] = useTracks([Track.Source.ScreenShare]);
  const cameraTrack: TrackReference | undefined = useLocalTrackRef(
    Track.Source.Camera,
  );

  const isCameraEnabled = cameraTrack && !cameraTrack.publication.isMuted;
  const isScreenShareEnabled =
    screenShareTrack && !screenShareTrack.publication.isMuted;

  const transition = {
    ...animationProps.transition,
    delay: chatOpen ? 0 : 0.15,
  };

  const agentAnimate = {
    ...animationProps.animate,
    scale: chatOpen ? 1 : 3,
    transition,
  };

  const avatarAnimate = { ...animationProps.animate, transition };
  const isAvatar = agentVideoTrack !== undefined;

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      <div className="relative mx-auto h-full max-w-full px-4 md:px-0">
        {/* Switch layout depending on chat state */}
        <div
  className={cn(
    chatOpen
      ? 'grid grid-cols-[1fr_auto_1fr] h-full items-center' // 3 columns
      : 'flex justify-center items-center h-full'
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
            className={cn(chatOpen ? 'h-[80px]' : 'h-auto w-full')}
          />
          {micTrack && (
            <div className="mt-4 w-full flex justify-center">
              <VoiceVisualizer trackRef={micTrack} />
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  </div>

  {/* Right Side: User camera / screen share */}
  {chatOpen && (
    <div className="flex flex-col items-center justify-end h-full p-4 space-y-4">
      <AnimatePresence>
        {cameraTrack && isCameraEnabled && (
          <MotionUserTile
            key="user-camera"
            layout="position"
            layoutId="camera"
            {...animationProps}
            videoTrack={cameraTrack}
            transition={transition}
            className="w-24 h-24"
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
            className="w-40 h-auto"
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
 