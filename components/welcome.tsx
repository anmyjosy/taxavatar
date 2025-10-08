import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Bot,
  Brain,
  Cpu,
  Headphones,
  LucideIcon,
  MessageCircle,
  Radio,
  Smile,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

export const Welcome = ({ disabled, startButtonText, onStartCall }: WelcomeProps) => {
  const features = [
    { icon: Smile, text: 'Lifelike Animation' },
    { icon: MessageCircle, text: 'Real-time Conversation' },
    { icon: Brain, text: 'Emotional Expression' },
  ];

  return (
    <section
      className={cn(
        'bg-background fixed inset-0 mx-auto flex h-svh flex-col items-center justify-center overflow-hidden',
        disabled ? 'pointer-events-none z-10 opacity-50' : 'z-20'
      )}
    >
      <WelcomeBackground />

      <div className="relative z-10 mx-auto max-w-5xl px-8">
        <WelcomeLogo />

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-foreground/90 mb-2 text-5xl font-light tracking-tight md:text-6xl">
              <span>Avatar</span>
              <span className="font-normal text-[#552483]"> AI</span>
            </h1>
            <div className="mx-auto h-[1px] w-24 bg-gradient-to-r from-transparent via-[#552483] to-transparent" />
          </motion.div>

          <p className="text-muted-foreground mx-auto max-w-xl text-base leading-relaxed font-light">
            Experience the future of conversational AI with lifelike avatars, ultra-low latency, and
            natural interactions.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          className="mb-16 flex flex-wrap justify-center gap-3"
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
                onClick={onStartCall}
                className="shadow-elegant group relative h-12 overflow-hidden border-0 bg-gradient-to-r from-[#552483] to-purple-600 px-10 text-sm text-white hover:brightness-110"
              >
                <span className="relative z-10 flex items-center gap-3 font-medium">
                  <Bot className="h-5 w-5" strokeWidth={2} />
                  {startButtonText}
                </span>
                <div className="absolute inset-0 translate-x-[-150%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-[150%]" />
              </Button>
            </div>

            {/* Secondary action */}
          </div>
        </motion.div>
      </div>
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.15]" />
      </div>

      {/* Animated lines */}
      <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#552483"
              strokeWidth="0.5"
              opacity="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
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
    <div className="relative mx-auto h-28 w-28">
      <div className="absolute inset-0 rotate-45 rounded-2xl bg-gradient-to-r from-[#552483] to-purple-600 opacity-10" />
      <div className="bg-background/30 absolute inset-0 rotate-45 rounded-2xl border border-[#552483]/20 backdrop-blur-xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Bot className="relative z-10 h-10 w-10 text-[#552483]" strokeWidth={1.5} />
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
            style={{ transform: 'translateX(44px)' }}
          />
        </motion.div>
      ))}
    </div>
  </motion.div>
);

interface FeaturePillProps {
  icon: LucideIcon;
  text: string;
  index: number;
}

const FeaturePill = ({ icon: Icon, text, index }: FeaturePillProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 + index * 0.1 }}
    className="group bg-background/20 border-foreground/10 hover:bg-background/40 flex items-center gap-2 rounded-full border px-4 py-2 backdrop-blur-md transition-all duration-500 hover:border-[#552483]/30"
  >
    <Icon
      className="h-4 w-4 text-[#552483]/70 transition-colors group-hover:text-[#552483]"
      strokeWidth={1.5}
    />
    <span className="text-muted-foreground group-hover:text-foreground text-xs font-light transition-colors">
      {text}
    </span>
  </motion.div>
);

export default Welcome;

/*
Original component for reference before refactoring.

export const Welcome_Original = ({
  disabled,
  startButtonText,
  onStartCall,
}: WelcomeProps) => {
  const features = [
    { icon: Brain, text: 'Advanced AI Processing' },
    { icon: Activity, text: 'Real-time Voice Analysis' },
    { icon: Cpu, text: 'Neural Network Integration' },
  ];

  return (
    <section
      className={cn(
        'bg-background dark:bg-background light:bg-[#e4d3f6] fixed inset-0 mx-auto flex h-svh flex-col items-center justify-center overflow-hidden',
        disabled ? 'z-10 pointer-events-none opacity-50' : 'z-20'
      )}
    >
*/
