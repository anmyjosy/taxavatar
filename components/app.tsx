'use client';

import { useEffect, useMemo, useState } from 'react';
import { Participant, Room, RoomEvent, Track, TrackPublication } from 'livekit-client';
import { motion } from 'motion/react';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { toastAlert } from '@/components/alert-toast';
import { SessionView } from '@/components/session-view';
import { Toaster } from '@/components/ui/sonner';
import Welcome from '@/components/welcome';
import useConnectionDetails from '@/hooks/useConnectionDetails';
import type { AppConfig } from '@/lib/types';

const MotionWelcome = motion.create(Welcome);
const MotionSessionView = motion.create(SessionView);

interface AppProps {
  appConfig: AppConfig;
}

const SESSION_DURATION_MS = 10 * 60 * 1000; // 15 minutes

export function App({ appConfig }: AppProps) {
  const room = useMemo(() => new Room(), []);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const { refreshConnectionDetails, existingOrRefreshConnectionDetails } =
    useConnectionDetails(appConfig);

  // ✅ Check for login session on the client after initial render to avoid hydration mismatch.
  useEffect(() => {
    try {
      const sessionData = localStorage.getItem('loginSession');
      if (!sessionData) {
        setIsLoggedIn(false);
        return;
      }
      const { expiresAt } = JSON.parse(sessionData);
      if (Date.now() < expiresAt) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem('loginSession');
        setIsLoggedIn(false);
      }
    } catch (e) {
      console.error('Could not parse login session:', e);
      setIsLoggedIn(false);
    }
  }, []);

  // ✅ Pre-fetch token
  useEffect(() => {
    existingOrRefreshConnectionDetails()
      .then(() => {})
      .catch(() => toastAlert({ title: 'Failed to get connection token' }));
  }, [existingOrRefreshConnectionDetails]);

  const handleLoginSuccess = () => {
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    localStorage.setItem('loginSession', JSON.stringify({ expiresAt }));
    setIsLoggedIn(true);
  };

  // ✅ Handle disconnect and device errors
  useEffect(() => {
    const onDisconnected = () => {
      setSessionStarted(false);
      refreshConnectionDetails();
    };
    const onMediaDevicesError = () => toastAlert({ title: 'Device access error' });

    room.on(RoomEvent.MediaDevicesError, onMediaDevicesError);
    room.on(RoomEvent.Disconnected, onDisconnected);

    return () => {
      room.off(RoomEvent.Disconnected, onDisconnected);
      room.off(RoomEvent.MediaDevicesError, onMediaDevicesError);
    };
  }, [room, refreshConnectionDetails]);

  // ✅ Start call after login with proper connection check
  const handleStartCall = async () => {
    setIsConnecting(true);
    try {
      const connectionDetails = await existingOrRefreshConnectionDetails();

      if (!connectionDetails?.serverUrl || !connectionDetails?.participantToken) {
        throw new Error('Connection details missing');
      }

      await room.connect(connectionDetails.serverUrl, connectionDetails.participantToken);

      // enable mic after successful connection but keep it muted
      await room.localParticipant.setMicrophoneEnabled(true);

      // Wait for the agent's video track to become available, with retries.
      let attempts = 0;
      const maxAttempts = 4;
      while (attempts < maxAttempts) {
        try {
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Agent video timed out'));
            }, 10000); // 10-second timeout per attempt

            const onTrackSubscribed = (
              track: Track,
              publication: TrackPublication,
              participant: Participant
            ) => {
              if (participant.isAgent && track.kind === Track.Kind.Video) {
                clearTimeout(timeout);
                room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
                resolve();
              }
            };

            // Check if agent is already in the room
            for (const p of room.remoteParticipants.values()) {
              if (p.isAgent) {
                const videoPub = p.getTrackPublication(Track.Source.Camera);
                if (videoPub?.isSubscribed) {
                  clearTimeout(timeout);
                  return resolve();
                }
              }
            }

            room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
          });
          // If the promise resolves, we have the video, so break the loop.
          break;
        } catch (error) {
          attempts++;
          console.warn(`Attempt ${attempts} to get agent video failed. Retrying...`);
          if (attempts >= maxAttempts) {
            throw error; // Re-throw the error after the last attempt.
          }
        }
      }

      // ✅ finally move to session view
      setSessionStarted(true);
      return true;
    } catch (err) {
      console.error('Connection failed:', err);
      const errorMessage =
        err instanceof Error && err.message.includes('Agent video timed out')
          ? 'Agent failed to join. Please try again.'
          : 'Failed to connect. Please try again.';
      toastAlert({ title: errorMessage });
      setSessionStarted(false);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <main>
      {/* Welcome screen */}
      <MotionWelcome
        key="welcome"
        isLoggedIn={isLoggedIn}
        onLoginSuccess={handleLoginSuccess}
        onStartCall={handleStartCall}
        isConnecting={isConnecting}
        disabled={sessionStarted}
        initial={{ opacity: 1 }}
        animate={{ opacity: sessionStarted ? 0 : 1 }}
        transition={{ duration: 0.2, ease: 'linear' }}
      />

      {/* Session page */}
      <RoomContext.Provider value={room}>
        <RoomAudioRenderer />
        <StartAudio label="Start Audio" />
        <MotionSessionView
          key="session-view"
          appConfig={appConfig}
          disabled={!sessionStarted}
          sessionStarted={sessionStarted}
          initial={{ opacity: 0 }}
          animate={{ opacity: sessionStarted ? 1 : 0 }}
          transition={{ duration: 0.2, ease: 'linear' }}
        />
      </RoomContext.Provider>

      <Toaster position="top-center" />
    </main>
  );
}
