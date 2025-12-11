"use client";

import { motion } from "framer-motion";
import { Monitor as MonitorIcon, Terminal } from "lucide-react";
import { OSType } from "@/app/page";

interface MonitorProps {
  osType: OSType;
  onClick: () => void;
  disabled: boolean;
}

export default function Monitor({ osType, onClick, disabled }: MonitorProps) {
  const isWindows = osType === "windows";
  const isLinux = osType === "linux";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="relative group"
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={!disabled && !osType ? "Klik untuk install OS" : osType ? `Klik untuk buka ${osType.toUpperCase()} VM` : "Selesaikan instalasi hardware dahulu"}
    >
      <motion.div
        className={`w-40 h-32 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all ${
          isWindows
            ? "bg-blue-950/30 border-blue-500/50 shadow-lg shadow-blue-500/20"
            : isLinux
            ? "bg-green-950/30 border-green-500/50 shadow-lg shadow-green-500/20"
            : disabled
            ? "bg-cyan-900/50 border-cyan-700/30 cursor-not-allowed opacity-50"
            : "bg-cyan-900/50 border-cyan-600 hover:border-cyan-500/70 glass-hover cursor-pointer"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: !disabled && !osType ? [
            "0 0 0px rgba(6, 182, 212, 0)",
            "0 0 20px rgba(6, 182, 212, 0.3)",
            "0 0 0px rgba(6, 182, 212, 0)"
          ] : undefined
        }}
        transition={{ 
          duration: 0.5, 
          delay: 0.1,
          boxShadow: { duration: 2, repeat: Infinity, delay: 0.5 }
        }}
      >
        {isLinux ? (
          <Terminal className="w-12 h-12 text-emerald-400" />
        ) : (
          <MonitorIcon
            className={`w-12 h-12 ${
              isWindows ? "text-blue-400" : "text-cyan-500/30"
            }`}
          />
        )}
        
        {osType && (
          <motion.div
            className="text-xs font-mono px-2 py-1 rounded bg-cyan-800/80 border border-cyan-700"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {osType.toUpperCase()}
          </motion.div>
        )}
      </motion.div>
      
      <p className="mt-3 text-sm font-mono text-cyan-400">
        {osType ? `OS: ${osType}` : "Monitor"}
      </p>
      
      {!disabled && !osType && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-xs font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          !
        </motion.div>
      )}

      {osType && (
        <motion.div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-cyan-500/20 border border-cyan-500/50 rounded px-2 py-1 text-xs font-mono text-cyan-400 whitespace-nowrap"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          🖥️ Click to open VM
        </motion.div>
      )}
    </motion.button>
  );
}
