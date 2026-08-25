import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed z-50 bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            role="status"
            aria-live="polite"
            className="mx-auto sm:mx-0 pointer-events-none max-w-[calc(100%-2rem)] sm:max-w-sm rounded-xl border border-white/10 bg-velora-dark px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.16)] flex items-center gap-3 text-sm font-medium text-white leading-5"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-velora-gold" />
            <span className="break-words">{message}</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
