'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import {
  AgentControlBar,
  type AgentControlBarProps,
} from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatInput } from '@/components/livekit/chat/chat-input';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/livekit/media-tiles';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

function isAgentAvailable(agentState: AgentState) {
  return agentState === 'listening' || agentState === 'thinking' || agentState === 'speaking';
}

function useIsMobile(width = 740) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < width);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);
  return isMobile;
}

interface SessionViewProps {
  appConfig: AppConfig;
  disabled: boolean;
  sessionStarted: boolean;
}

export const SessionView = ({
  appConfig,
  disabled,
  sessionStarted,
  ref,
}: React.ComponentProps<'div'> & SessionViewProps) => {
  const { state: agentState } = useVoiceAssistant();
  const [chatOpen, setChatOpen] = useState(false);
  const { messages, send } = useChatAndTranscription();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const room = useRoomContext();
  const isMobile = useIsMobile();

  useDebugMode({
    enabled: process.env.NODE_ENV !== 'production',
  });

  async function handleSendMessage(message: string) {
    await send(message);
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (sessionStarted && agentState === 'listening') {
      const timeout = setTimeout(() => {
        toastAlert({ title: 'Agent connection timed out due to inactivity.' });
        room.disconnect();
      }, 60000);
      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  useEffect(() => {
    if (sessionStarted) {
      const timer = setTimeout(() => {
        room.localParticipant.setMicrophoneEnabled(true);
      }, 5000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [sessionStarted, room]);

  const isConnecting = agentState === 'connecting';
  const { supportsChatInput, supportsVideoInput } = appConfig;
  const capabilities: AgentControlBarProps['capabilities'] = {
    supportsChatInput: !isConnecting && supportsChatInput,
    supportsVideoInput: !isConnecting && supportsVideoInput,
    supportsScreenShare: false,
  };

  // --- Tweak these to change spacing ---
  const CHAT_WIDTH = 650; // fixed desktop chat width in px
  const AVATAR_SHIFT = -(CHAT_WIDTH / 2); // avatar moves left by half chat width when chat opens
  const motionTransition = { duration: 0.38, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <section ref={ref} inert={disabled} className="bg-background fixed inset-0 z-20">
      <div
        className={cn(
          'relative flex h-full w-full transition-all',
          isMobile ? 'flex-col' : 'md:flex-row',
          !chatOpen && 'max-h-svh overflow-hidden',
          chatOpen && 'md:gap-4 md:p-4'
        )}
      >
        {/* --- MOBILE CHAT (overlay) --- */}
        {isMobile && chatOpen && (
          <ChatMessageView
            // @ts-expect-error - The 'as' prop is used for polymorphism and is not explicitly typed.
            as={motion.div}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '110%', opacity: 0 }}
            transition={motionTransition}
            className={cn(
              'dark:bg-background/30 fixed right-0 bottom-[6rem] left-0 z-40 mx-4 flex h-[45vh] flex-col rounded-2xl border border-white/30 bg-gray-300 shadow-xl backdrop-blur-xl'
            )}
          >
            <div
              ref={chatContainerRef}
              className="scrollbar-thin scrollbar-thumb-accent scrollbar-track-background flex-1 space-y-3 overflow-y-auto p-4 text-sm whitespace-pre-wrap"
            >
              <AnimatePresence>
                {messages.map((message: ReceivedChatMessage) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                  >
                    <ChatEntry hideName key={message.id} entry={message} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="bg-background/70 border-t border-white/10 p-3 backdrop-blur-lg">
              <ChatInput onSend={handleSendMessage} disabled={!isAgentAvailable(agentState)} />
            </div>
          </ChatMessageView>
        )}

        {/* --- MEDIA (avatar) container --- */}
        <motion.div
          layout
          animate={{
            x: chatOpen && !isMobile ? AVATAR_SHIFT : 0,
            y: chatOpen && isMobile ? 10 : 0, // small gentle lift
            scale: 1, // 👈 keep constant on mobile to avoid snap
          }}
          transition={{
            ...motionTransition,
            damping: 20,
            stiffness: 120,
            mass: 0.8,
          }}
          className={cn('relative flex flex-1 items-center justify-center')}
          style={{ willChange: 'transform', transformOrigin: 'center' }}
        >
          <div className="bg-background fixed top-0 right-0 left-0 h-28 md:h-32">
            <div className="animate-pulse-glow absolute top-0 left-1/2 h-[8rem] w-full max-w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#552483]/20 blur-[100px]" />
          </div>

          {!isConnecting && <MediaTiles chatOpen={chatOpen} />}
        </motion.div>

        {/* --- DESKTOP CHAT PANEL --- */}
        {!isMobile && (
          <motion.div
            initial={false}
            animate={{ x: chatOpen ? 0 : '100%', opacity: chatOpen ? 1 : 0 }}
            transition={motionTransition}
            style={{
              width: CHAT_WIDTH,
              right: 20,
              top: '4rem',
              bottom: 'auto',
            }}
            className={cn(
              'pointer-events-auto',
              'absolute',
              'mt-8',
              'flex',
              'h-[60%]',
              'flex-col',
              'rounded-2xl',
              'border',
              'border-white/30',
              'bg-gray-300',
              'p-4',
              'backdrop-blur-xl',
              'dark:bg-background/30',
              'shadow-lg'
            )}
            aria-hidden={!chatOpen}
          >
            <ChatMessageView className="h-full">
              <div
                ref={chatContainerRef}
                className="scrollbar-thin scrollbar-thumb-accent scrollbar-track-background h-full space-y-3 overflow-y-auto text-sm whitespace-pre-wrap"
              >
                <AnimatePresence>
                  {messages.map((message: ReceivedChatMessage) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.28, ease: 'easeOut' }}
                    >
                      <ChatEntry hideName key={message.id} entry={message} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <ChatInput
                onSend={handleSendMessage}
                disabled={!isAgentAvailable(agentState)}
                className="mt-4"
              />
            </ChatMessageView>
          </motion.div>
        )}

        {/* --- CONTROL BAR --- */}
        <div className="fixed right-0 bottom-0 left-0 z-50">
          <motion.div
            key="control-bar"
            initial={{ opacity: 0, translateY: '100%' }}
            animate={{
              opacity: sessionStarted ? 1 : 0,
              translateY: sessionStarted ? '0%' : '100%',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut',
            }}
          >
            <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-2 px-3 pb-3 md:px-6 md:pb-6">
              <AgentControlBar capabilities={capabilities} onChatOpenChange={setChatOpen} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SessionView;
