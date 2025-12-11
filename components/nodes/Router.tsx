"use client";

import { motion } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";

interface RouterProps {
  connected: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function Router({ connected, onClick, disabled }: RouterProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="relative group"
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={!disabled && !connected ? "Klik untuk setup network" : connected ? "Network terhubung" : "Selesaikan instalasi OS dahulu"}
    >
      <motion.div
        className={`w-32 h-32 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${
          connected
            ? "bg-blue-950/30 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
            : disabled
            ? "bg-cyan-900/50 border-cyan-700/30 cursor-not-allowed opacity-50"
            : "bg-cyan-900/50 border-cyan-600 hover:border-cyan-500/70 glass-hover cursor-pointer"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: !disabled && !connected ? [
            "0 0 0px rgba(16, 185, 129, 0)",
            "0 0 20px rgba(16, 185, 129, 0.3)",
            "0 0 0px rgba(16, 185, 129, 0)"
          ] : undefined
        }}
        transition={{ 
          duration: 0.5, 
          delay: 0.2,
          boxShadow: { duration: 2, repeat: Infinity, delay: 1 }
        }}
      >
        {connected ? (
          <Wifi className="w-12 h-12 text-cyan-400" />
        ) : (
          <WifiOff className="w-12 h-12 text-cyan-500/30" />
        )}
        
        {connected && (
          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-cyan-500 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
      
      <p className="mt-3 text-sm font-mono text-cyan-400">
        {connected ? "Network OK" : "Router"}
      </p>
      
      {!disabled && !connected && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          !
        </motion.div>
      )}
    </motion.button>
  );
}
