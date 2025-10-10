'use client';

import * as React from 'react';
import { Track } from 'livekit-client';
import { useRemoteParticipants } from '@livekit/components-react';
import { ChatTextIcon, PhoneDisconnectIcon } from '@phosphor-icons/react/dist/ssr';
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
  className,
  onChatOpenChange,
  onDisconnect,
  ...props
}: AgentControlBarProps) {
  const participants = useRemoteParticipants();
  const [chatOpen, setChatOpen] = React.useState(false);

  const isAgentAvailable = participants.some((p) => p.isAgent);

  const [isDisconnecting, setIsDisconnecting] = React.useState(false);

  const { visibleControls, microphoneToggle, handleDisconnect } = useAgentControlBar({
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
              'flex h-12 w-12 items-center justify-center rounded-full transition',
              // light mode
              microphoneToggle.enabled
                ? 'dark:bg-accent dark:text-accent-foreground bg-gray-900 text-white'
                : 'dark:bg-accent/50 dark:text-accent-foreground bg-gray-900/70 text-white'
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
              'flex h-12 w-12 items-center justify-center rounded-full transition',
              // light mode
              chatOpen
                ? 'dark:bg-accent dark:text-accent-foreground bg-gray-900 text-white'
                : 'dark:bg-accent/50 dark:text-accent-foreground bg-gray-900/70 text-white'
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
