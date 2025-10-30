"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { LogIn, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toastAlert } from "./alert-toast";

interface WelcomeProps {
  disabled: boolean;
  isLoggedIn: boolean;
  isConnecting: boolean;
  onLoginSuccess: () => void;
  onStartCall: () => void;
}

export const Welcome = ({
  disabled,
  isLoggedIn,
  isConnecting,
  onLoginSuccess,
  onStartCall,
}: WelcomeProps) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toastAlert({ title: error.message || "Invalid email or password" });
    } else {
      onLoginSuccess();
      setIsLoginOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] text-white flex flex-col">
      {/* ===== Angled Purple Ribbons Background ===== */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Background gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a0b2d] to-black" />

        {/* Angled ribbons */}
        <div className="absolute inset-0">
          <div className="absolute left-[-100px] top-0 w-[600px] h-full rotate-[20deg] bg-gradient-to-br from-[#552483] via-[#8a46c2] to-transparent opacity-70" />
          <div className="absolute left-[200px] top-0 w-[600px] h-full rotate-[20deg] bg-gradient-to-br from-[#8a46c2] via-[#c59af0] to-transparent opacity-50" />
          <div className="absolute left-[500px] top-0 w-[600px] h-full rotate-[20deg] bg-gradient-to-br from-[#552483] via-[#7a3ce9] to-transparent opacity-30" />
          <div className="absolute left-[800px] top-0 w-[600px] h-full rotate-[20deg] bg-gradient-to-br from-[#2d0d4f] via-[#552483]/70 to-transparent opacity-20" />
        </div>

        {/* Soft gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80" />
      </div>

      {/* ===== Hero Section ===== */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 max-w-6xl px-6 py-16 text-center md:items-start md:px-16 md:text-left">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h1 className="mb-3 text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            TaxVision{" "}
            <span className="block bg-gradient-to-r from-[#d8c5e8] to-[#ffffff] bg-clip-text text-5xl text-transparent">
              AI Advisor
            </span>
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-[#552483] to-transparent mb-6 mx-auto md:mx-0" />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl text-base leading-relaxed text-white/80 md:text-xl mb-10"
        >
          Revolutionize your tax strategy with AI-powered insights. Get real-time
          compliance updates, smart calculations, and personalized financial guidance.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 md:justify-start"
        >
          <Button
            size="lg"
            className="group relative h-12 overflow-hidden bg-[#552483] px-8 text-base font-semibold text-white shadow-md shadow-[#552483]/40 hover:scale-105 hover:shadow-[#552483]/60 transition-transform"
            onClick={isLoggedIn ? onStartCall : () => setIsLoginOpen(true)}
            disabled={isConnecting}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isConnecting ? (
                <svg
                  className="h-5 w-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : isLoggedIn ? (
                <ArrowRight className="h-5 w-5" />
              ) : (
                <LogIn className="h-5 w-5" />
              )}
              {isConnecting
                ? "Connecting..."
                : isLoggedIn
                ? "Start Call"
                : "Login"}
            </span>
          </Button>
        </motion.div>
      </main>

      {/* ===== Login Modal ===== */}
      {isLoginOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setIsLoginOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative w-11/12 max-w-sm rounded-2xl border border-[#552483]/30 bg-[#1a0b2d]/90 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

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
            <Button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-[#552483] to-purple-600 text-white font-semibold py-2 rounded-lg shadow-md hover:brightness-110 transition-all"
            >
              Login
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Welcome;
