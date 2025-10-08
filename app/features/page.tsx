'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Headphones, MessageCircle, Radio, Smile } from 'lucide-react';
import { Navbar } from '@/app/components/Navbar';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export const Features = () => {
  const features: Feature[] = [
    {
      icon: Smile,
      title: 'Lifelike Animation',
      description: 'Our avatars move and express emotions like real humans.',
    },
    {
      icon: MessageCircle,
      title: 'Real-time Conversation',
      description: 'Interact with AI avatars in real-time with natural dialogue.',
    },
    {
      icon: Brain,
      title: 'Emotional Intelligence',
      description: 'Avatars understand tone and respond appropriately.',
    },
    {
      icon: Cpu,
      title: 'Advanced AI Processing',
      description: 'Powered by state-of-the-art neural networks for fast responses.',
    },
    {
      icon: Radio,
      title: 'Voice Recognition',
      description: 'Supports multiple languages with accurate speech-to-text.',
    },
    {
      icon: Headphones,
      title: 'Immersive Sound',
      description: 'Crystal clear text-to-speech and voice feedback.',
    },
  ];

  return (
    <>
      <Navbar />
      <section className="bg-background mt-8 flex min-h-screen flex-col items-center px-8 py-10">
        <motion.h2
          className="text-foreground mb-12 text-center text-4xl font-bold md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Features
        </motion.h2>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="bg-background/20 border-foreground/10 hover:bg-background/40 flex flex-col items-center rounded-2xl border p-6 text-center backdrop-blur-md transition-all duration-500 hover:border-purple-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <feature.icon className="mb-4 h-10 w-10 text-purple-600" strokeWidth={2} />
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Features;
