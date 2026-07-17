/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div 
      id="not-found-page" 
      className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground px-6 py-12 relative overflow-hidden selection:bg-cinema-amber-500/30 selection:text-cinema-amber-950 dark:selection:text-cinema-amber-200"
    >
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cinema-amber-500/10 dark:bg-cinema-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-blue-500/10 dark:bg-[#3b82f6]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center max-w-md w-full relative z-10 flex flex-col items-center space-y-6">
        {/* Animated Icon Wrapper */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted border border-border text-cinema-amber-600 dark:text-cinema-amber-400 shadow-md"
        >
          <AlertCircle className="w-8 h-8" />
        </motion.div>

        {/* 404 Big Display Number */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
          className="font-display text-8xl font-black tracking-tighter text-foreground drop-shadow-md select-none"
        >
          404
        </motion.h1>

        {/* Core Message */}
        <motion.div 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          className="space-y-2"
        >
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Page not found
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Go Home Action Button */}
        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
          className="pt-2 w-full flex justify-center"
        >
          <Button 
            id="not-found-home-btn"
            variant="primary" 
            size="md" 
            onClick={() => navigate('/')}
            className="w-40 rounded-xl font-semibold shadow-lg active:scale-95 transition-all duration-200"
          >
            Go home
          </Button>
        </motion.div>
      </div>

      {/* Humble branding footer */}
      <div className="absolute bottom-6 text-[11px] text-muted-foreground/60 tracking-wider font-mono select-none uppercase">
        Idea Codex Labs • ReelLegacy
      </div>
    </div>
  );
}
