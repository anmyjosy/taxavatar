'use client';

import * as React from 'react';
import { useCallback } from 'react';
import { Track } from 'livekit-client';
import { BarVisualizer, useRemoteParticipants } from '@livekit/components-react';
import { ChatTextIcon, PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
import { ChatInput } from '@/components/livekit/chat/chat-input';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TrackToggle } from '../track-toggle';
import { UseAgentControlBarProps, useAgentControlBar } from './hooks/use-agent-control-bar';

export interface AgentControlBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    UseAgentControlBarProps {
  capabilities: Pick<AppConfig, 'supportsChatInput' | 'supportsVideoInput' | 'supportsScreenShare'>;
  onChatOpenChange?: (open: boolean) => void;
  onDisconnect?: () => void;
  onDeviceError?: (error: { source: Track.Source; error: Error }) => void;
}

/**
 * A control bar specifically designed for voice assistant interfaces
 */
export function AgentControlBar({
  controls,
  saveUserChoices = true,
  capabilities,
  className,
  onChatOpenChange,
  onDisconnect,
  onDeviceError,
  ...props
}: AgentControlBarProps) {
  const participants = useRemoteParticipants();
  const [chatOpen, setChatOpen] = React.useState(false);

  const isAgentAvailable = participants.some((p) => p.isAgent);

  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const {
    micTrackRef,
    visibleControls,
    cameraToggle,
    microphoneToggle,
    screenShareToggle,
    handleAudioDeviceChange,
    handleVideoDeviceChange,
    handleDisconnect,
  } = useAgentControlBar({
    controls,
    saveUserChoices,
  });

  const onLeave = async () => {
    setIsDisconnecting(true);
    await handleDisconnect();
    setIsDisconnecting(false);
    onDisconnect?.();
  };

  React.useEffect(() => {
    onChatOpenChange?.(chatOpen);
  }, [chatOpen, onChatOpenChange]);

  const onMicrophoneDeviceSelectError = useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Microphone, error });
    },
    [onDeviceError]
  );
  const onCameraDeviceSelectError = useCallback(
    (error: Error) => {
      onDeviceError?.({ source: Track.Source.Camera, error });
    },
    [onDeviceError]
  );

  return (
    <div
      aria-label="Voice assistant controls"
      className={cn('flex flex-col', className)}
      {...props}
    >
      <div className="flex w-full items-center justify-center gap-4 rounded-xl p-1">
        {/* Microphone */}
        {visibleControls.microphone && (
          <TrackToggle
            variant="ghost"
            source={Track.Source.Microphone}
            pressed={microphoneToggle.enabled}
            disabled={microphoneToggle.pending}
            onPressedChange={microphoneToggle.toggle}
            className={cn(
              'h-12 w-12 flex items-center justify-center rounded-full transition',
              microphoneToggle.enabled ? 'bg-accent text-accent-foreground' : 'bg-accent/50 text-accent-foreground'
            )}
          />
        )}

        {/* Message / Chat */}
        {visibleControls.chat && (
          <Toggle
            variant="ghost"
            aria-label="Toggle chat"
            pressed={chatOpen}
            onPressedChange={setChatOpen}
            disabled={!isAgentAvailable}
            className={cn(
              'h-12 w-12 flex items-center justify-center rounded-full transition',
              chatOpen ? 'bg-accent text-accent-foreground' : 'bg-accent/50 text-accent-foreground'
            )}
          >
            <ChatTextIcon weight="bold" size={24} />
          </Toggle>
        )}

        {/* End Call */}
        {visibleControls.leave && (
          <Button
            variant="destructive"
            onClick={onLeave}
            disabled={isDisconnecting}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
          >
            <PhoneDisconnectIcon weight="bold" size={24} />
          </Button>
        )}
      </div>
    </div>
  );
}
