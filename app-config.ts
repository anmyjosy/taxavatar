import type { AppConfig } from './lib/types';

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: '10xDS',
  pageTitle: 'TaxVision',
  pageDescription: 'A voice agent built with LiveKit',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: '/10xDS-logo.svg',
  accent: '#002cf2',
  logoDark: '/10xDS-logo.svg',
  accentDark: '#1fd5f9',
  startButtonText: 'Start call',

  agentName: undefined,
};
