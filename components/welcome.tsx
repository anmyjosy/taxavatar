import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Headphones, Activity, Brain, Cpu, Radio, LucideIcon, Bot, Smile, MessageCircle } from 'lucide-react';

interface WelcomeProps {
  disabled: boolean;
  startButtonText: string;
  onStartCall: () => void;
}

export const Welcome = ({
  disabled,
  startButtonText,
  onStartCall,
}: WelcomeProps) => {
  const features = [
    { icon: Smile, text: 'Lifelike Animation' },
    { icon: MessageCircle, text: 'Real-time Conversation' },
    { icon: Brain, text: 'Emotional Expression' },
  ];

  return (
    <section
      className={cn(
        'bg-background fixed inset-0 mx-auto flex h-svh flex-col items-center justify-center overflow-hidden',
        disabled ? 'z-10 pointer-events-none opacity-50' : 'z-20'
      )}
    >
      <WelcomeBackground />

      <div className="relative z-10 max-w-5xl mx-auto px-8">
        <WelcomeLogo />

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-6xl font-light tracking-tight mb-2 text-foreground/90">
              <span>Avatar</span>
              <span className="text-[#552483] font-normal"> AI</span>
            </h1>
            <div className="h-[1px] w-24 mx-auto bg-gradient-to-r from-transparent via-[#552483] to-transparent" />
          </motion.div>

          <p className="text-base text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
            Experience the future of conversational AI with lifelike avatars, ultra-low latency, and natural interactions.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-16"
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
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#552483] to-purple-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
              <Button
                variant="default"                
                size="lg"
                onClick={onStartCall}
                className="relative px-10 h-12 text-sm bg-gradient-to-r from-[#552483] to-purple-600 text-white hover:brightness-110 border-0 shadow-elegant group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3 font-medium">
                  <Bot className="w-5 h-5" strokeWidth={2} />
                  {startButtonText}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700" />
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
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#552483]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#552483]/20 rounded-full blur-[120px]" />
      </div>

      {/* Dot grid pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.15]" />
      </div>

      {/* Animated lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
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
          className="absolute w-1 h-1 bg-[#552483]/40 rounded-full"
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
    className="mb-12 relative group"
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-[#552483] to-purple-600 rounded-full blur-3xl opacity-20"
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
    <div className="relative mx-auto w-28 h-28">
      <div className="absolute inset-0 bg-gradient-to-r from-[#552483] to-purple-600 rounded-2xl rotate-45 opacity-10" />
      <div className="absolute inset-0 bg-background/30 backdrop-blur-xl rounded-2xl rotate-45 border border-[#552483]/20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Bot className="w-10 h-10 text-[#552483] relative z-10" strokeWidth={1.5} />
      </div>

      {/* Orbiting elements */}
      {[0, 120, 240].map((rotation, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2"
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
            className="absolute w-2 h-2 bg-primary/60 rounded-full"
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
    className="group flex items-center gap-2 px-4 py-2 bg-background/20 backdrop-blur-md rounded-full border border-foreground/10 hover:border-[#552483]/30 hover:bg-background/40 transition-all duration-500"
  >
    <Icon className="w-4 h-4 text-[#552483]/70 group-hover:text-[#552483] transition-colors" strokeWidth={1.5} />
    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors font-light">
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