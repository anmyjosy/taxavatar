import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: '10xDS',
  pageTitle: 'AvatarAI',
  pageDescription: 'A voice agent built with LiveKit',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: '',
  accent: '#002cf2',
  logoDark: '',
  accentDark: '#1fd5f9',
  startButtonText: 'Start call',

  agentName: undefined,
};
