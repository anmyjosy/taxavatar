'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  type AgentState,
  type ReceivedChatMessage,
  useRoomContext,
  useVoiceAssistant,
} from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { AgentControlBar } from '@/components/livekit/agent-control-bar/agent-control-bar';
import { ChatEntry } from '@/components/livekit/chat/chat-entry';
import { ChatInput } from '@/components/livekit/chat/chat-input';
import { ChatMessageView } from '@/components/livekit/chat/chat-message-view';
import { MediaTiles } from '@/components/livekit/media-tiles';
import useChatAndTranscription from '@/hooks/useChatAndTranscription';
import { useDebugMode } from '@/hooks/useDebug';
import type { AppConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

function isAgentAvailable(agentState: AgentState) {
  return agentState == 'listening' || agentState == 'thinking' || agentState == 'speaking';
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
    if (sessionStarted) {
      const timeout = setTimeout(() => {
        if (!isAgentAvailable(agentState)) {
          const reason =
            agentState === 'connecting'
              ? 'Agent did not join the room. '
              : 'Agent connected but did not complete initializing. ';

          toastAlert({
            title: 'Session ended',
            description: (
              <p className="w-full">
                {reason}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.livekit.io/agents/start/voice-ai/"
                  className="whitespace-nowrap underline"
                >
                  See quickstart guide
                </a>
                .
              </p>
            ),
          });
          room.disconnect();
        }
      }, 20_000);
      return () => clearTimeout(timeout);
    }
  }, [agentState, sessionStarted, room]);

  const { supportsChatInput, supportsVideoInput } = appConfig;
  const capabilities = {
    supportsChatInput,
    supportsVideoInput,
    supportsScreenShare: false,
  };

  return (
    <section
      ref={ref}
      inert={disabled}
      className={cn(
        'bg-background fixed inset-0 z-20 flex',
        isMobile ? 'flex-col' : 'md:flex-row',
        !chatOpen && 'max-h-svh overflow-hidden',
        chatOpen && 'md:gap-4 md:p-4'
      )}
    >
      {/* --- MOBILE CHAT ABOVE AVATAR --- */}
      {/* --- MOBILE CHAT (REDUCED HEIGHT, FLOATING ABOVE AVATAR) --- */}
{isMobile && chatOpen && (
  <ChatMessageView
    className={cn(
      'transition-all duration-300 ease-out bg-background/40 flex flex-col rounded-2xl border border-white/10 backdrop-blur-xl shadow-xl',
      'fixed bottom-[6rem] left-0 right-0 mx-4 z-40 h-[45vh] translate-y-0 opacity-100 delay-200'
    )}
  >
    <div
      ref={chatContainerRef}
      className="scrollbar-thin scrollbar-thumb-accent scrollbar-track-background flex-1 space-y-3 overflow-y-auto text-sm whitespace-pre-wrap p-4"
    >
      <AnimatePresence>
        {messages.map((message: ReceivedChatMessage) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ChatEntry hideName key={message.id} entry={message} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>

    <div className="border-t border-white/10 bg-background/70 backdrop-blur-lg p-3">
      <ChatInput
        onSend={handleSendMessage}
        disabled={!isAgentAvailable(agentState)}
      />
    </div>
  </ChatMessageView>
)}


      {/* --- MEDIA TILES --- */}
      <div
        className={cn(
          'relative flex-1 transition-all duration-300 ease-out',
          chatOpen && !isMobile ? 'md:w-3/5' : 'w-full'
        )}
      >
        <div className="bg-background fixed top-0 right-0 left-0 h-28 md:h-32">
          <div className="animate-pulse-glow absolute top-0 left-1/2 h-[8rem] w-full max-w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#552483]/20 blur-[100px]" />
        </div>
        <MediaTiles chatOpen={chatOpen} />
      </div>

      {/* --- DESKTOP CHAT (SIDE) --- */}
      {!isMobile && (
        <ChatMessageView
          className={cn(
            'transition-all duration-300 ease-out',
            'bg-background/30 flex flex-col rounded-2xl border border-white/10 backdrop-blur-xl',
            chatOpen
              ? 'relative h-2/3 w-1/3 flex-1 translate-x-0 p-4 opacity-100 delay-200 md:mt-16'
              : 'absolute w-full -translate-x-full opacity-0'
          )}
        >
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
                  transition={{ duration: 0.3, ease: 'easeOut' }}
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
          transition={{ duration: 0.3, delay: sessionStarted ? 0.5 : 0, ease: 'easeOut' }}
        >
          <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center gap-2 px-3 pb-3 md:px-6 md:pb-6">
            <AgentControlBar capabilities={capabilities} onChatOpenChange={setChatOpen} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
