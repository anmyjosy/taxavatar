import React, { type ElementType, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, LogIn, MessageCircle, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { toastAlert } from './alert-toast';

interface WelcomeProps {
  disabled: boolean;
  isLoggedIn: boolean;
  isConnecting: boolean;
  onLoginSuccess: () => void;
  onStartCall: () => void;
}

function useIsMobile(width = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < width);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);
  return isMobile;
}

function useIsShort(height = 700) {
  const [isShort, setIsShort] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsShort(window.innerHeight < height);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);
  return isShort;
}

export const Welcome = ({
  disabled,
  isLoggedIn,
  isConnecting,
  onLoginSuccess,
  onStartCall,
}: WelcomeProps) => {
  const features = [
    { icon: Smile, text: 'Lifelike Animation' },
    { icon: MessageCircle, text: 'Real-time Conversation' },
    { icon: Brain, text: 'Emotional Expression' },
  ];
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isMobile = useIsMobile();
  const isShort = useIsShort(600);
  const isVeryShort = useIsShort(639);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toastAlert({ title: error.message || 'Invalid email or password' });
    } else {
      onLoginSuccess();
      setIsLoginOpen(false);
    }
  };

  return (
    <section
      className={cn(
        'fixed inset-0 flex flex-col items-center justify-start overflow-hidden',
        'bg-background',
        'dark:bg-background',
        'bg-gradient-to-br from-[#f8f4ff] via-[#f1e6ff] to-[#e4d3f6] dark:bg-none',
        disabled ? 'pointer-events-none z-10 opacity-50' : 'z-20'
      )}
    >
      <WelcomeBackground />

      <motion.div
        className="relative z-10 mx-auto max-w-5xl origin-center px-8"
        animate={{
          scale: isMobile ? (isVeryShort ? 0.75 : 0.85) : 1,
          paddingTop: isMobile ? (isShort ? '2rem' : '4rem') : '4rem',
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <WelcomeLogo />

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={cn('text-center', isMobile && isShort ? 'mb-8' : 'mb-16')}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-foreground/90 mb-2 text-4xl font-light tracking-tight sm:text-5xl md:text-6xl">
              <span>Avatar</span>
              <span className="font-normal text-[#552483]"> AI</span>
            </h1>
            <div className="mx-auto h-[1px] w-24 bg-gradient-to-r from-transparent via-[#552483] to-transparent" />
          </motion.div>

          <p className="text-muted-foreground mx-auto max-w-xl text-sm leading-relaxed font-light md:text-base">
            Experience the future of conversational AI with lifelike avatars, ultra-low latency, and
            natural interactions.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          className={cn(
            'flex flex-wrap justify-center gap-3',
            isMobile && isShort ? 'mb-8' : 'mb-16'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {features.map((feature, index) => (
            <FeaturePill key={index} index={index} icon={feature.icon} text={feature.text} />
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="relative"
        >
          <div className="flex flex-col items-center gap-6">
            {/* Main CTA */}
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#552483] to-purple-600 opacity-25 blur-lg transition-opacity duration-500 group-hover:opacity-40" />
              <Button
                variant="default"
                size="lg"
                onClick={isLoggedIn ? onStartCall : () => setIsLoginOpen(true)}
                disabled={isConnecting}
                className="shadow-elegant group relative flex h-12 w-44 items-center justify-center overflow-hidden border-0 bg-gradient-to-r from-[#552483] to-purple-600 px-8 text-sm text-white hover:brightness-110 md:w-48 md:px-10"
              >
                <span className="relative z-10 flex items-center gap-3 font-medium">
                  {isConnecting ? (
                    <svg
                      className="h-5 w-5 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <LogIn className="h-5 w-5" strokeWidth={2} />
                  )}
                  {isConnecting ? 'Connecting...' : isLoggedIn ? 'Start Call' : 'Login'}
                </span>
                <div className="absolute inset-0 translate-x-[-150%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[150%]" />
              </Button>
            </div>

            {/* Secondary action */}
          </div>
        </motion.div>
      </motion.div>

      {/* Login modal */}
      {isLoginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setIsLoginOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-11/12 max-w-[360px] overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-slate-900/90 via-purple-900/15 to-slate-900/90 p-6 shadow-2xl backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative gradient */}
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full bg-gradient-to-br from-purple-500/5 to-transparent" />

            {/* Close button */}
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-3 right-3 text-gray-400 transition-colors hover:text-white"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Header */}
            <div className="relative mb-5 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20">
                <svg
                  className="h-6 w-6 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="mb-1 text-2xl font-bold text-white">Welcome Back</h2>
              <p className="text-xs text-gray-400">Enter your credentials to continue</p>
            </div>

            {/* Email input */}
            <div className="relative mb-4">
              <label className="mb-1.5 block text-xs font-medium text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full rounded-lg border border-purple-500/20 bg-slate-800/50 px-3 py-2.5 pl-9 text-sm text-white placeholder-gray-500 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
                <svg
                  className="absolute top-2.5 left-3 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
            </div>

            {/* Password input */}
            <div className="relative mb-5">
              <label className="mb-1.5 block text-xs font-medium text-gray-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  className="w-full rounded-lg border border-purple-500/20 bg-slate-800/50 px-3 py-2.5 pl-9 text-sm text-white placeholder-gray-500 transition-all focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
                <svg
                  className="absolute top-2.5 left-3 h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              className="mb-3 flex w-full transform items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 transition-all hover:scale-[1.02] hover:from-purple-500 hover:to-purple-600 active:scale-[0.98]"
            >
              Login
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

const WelcomeBackground = () => (
  <>
    {/* Sophisticated Background */}
    <div className="absolute inset-0">
      {/* Gradient mesh */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#552483]/30 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-[#552483]/20 blur-[120px]" />
      </div>

      {/* Dot grid pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0.5px_0.5px,rgba(255,255,255,0.1)_0.5px,transparent_0.5px)] bg-[size:20px_20px] opacity-[0.2]" />
      </div>
    </div>

    {/* Floating particles */}
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-[#552483]/40"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + i * 10}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  </>
);

const WelcomeLogo = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.2,
    }}
    className="group relative mb-12"
  >
    <motion.div
      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#552483] to-purple-600 opacity-20 blur-3xl"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />

    {/* Hexagon container */}
    <div className="relative mx-auto h-24 w-24 md:h-28 md:w-28">
      <div className="absolute inset-0 rotate-45 rounded-2xl bg-gradient-to-r from-[#552483] to-purple-600 opacity-10" />
      <div className="bg-background/30 absolute inset-0 rotate-45 rounded-2xl border border-[#552483]/20 backdrop-blur-xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Bot className="relative z-10 h-9 w-9 text-[#552483] md:h-10 md:w-10" strokeWidth={1.5} />
      </div>

      {/* Orbiting elements */}
      {[0, 120, 240].map((rotation, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [rotation, rotation + 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="bg-primary/60 absolute h-2 w-2 rounded-full"
            style={{ transform: 'translateX(44px)' }} // This could also be made responsive if needed
          />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

interface FeaturePillProps {
  icon: ElementType;
  text: string;
  index: number;
}

const FeaturePill = ({ icon: Icon, text, index }: FeaturePillProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 + index * 0.1 }}
    className="group border-foreground/10 bg-background/20 hover:bg-background/40 flex items-center gap-2 rounded-full border px-3 py-1.5 backdrop-blur-md transition-all duration-500 hover:border-[#552483]/3"
  >
    <Icon
      className="h-3 w-3 text-[#552483]/70 transition-colors group-hover:text-[#552483] md:h-4 md:w-4"
      strokeWidth={1.5}
    />
    <span className="muted-foreground group-hover:text-foreground text-xs font-light transition-colors">
      {text}
    </span>
  </motion.div>
);

export default Welcome;
