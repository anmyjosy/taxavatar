'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/app/components/Navbar';
import { Smile, MessageCircle, Brain, Cpu, Radio, Headphones } from 'lucide-react';

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
      <section className="bg-background min-h-screen flex flex-col items-center py-10 px-8 mt-8 ">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-foreground mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Features
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="p-6 bg-background/20 backdrop-blur-md rounded-2xl border border-foreground/10 hover:border-purple-600 hover:bg-background/40 transition-all duration-500 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
            >
              <feature.icon className="w-10 h-10 mb-4 text-purple-600" strokeWidth={2} />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Features;