"use client";

import { motion } from "framer-motion";
import { Cpu, HardDrive } from "lucide-react";

interface PCTowerProps {
  installed: boolean;
  onClick: () => void;
  disabled: boolean;
}

export default function PCTower({ installed, onClick, disabled }: PCTowerProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="relative group"
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={!disabled && !installed ? "Klik untuk install CPU & RAM" : installed ? "Hardware sudah terinstall" : ""}
    >
      <motion.div
        className={`w-32 h-48 rounded-lg border-2 flex flex-col items-center justify-center gap-3 transition-all ${
          installed
            ? "bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-500/20"
            : disabled
            ? "bg-zinc-900/50 border-zinc-700/30 cursor-not-allowed opacity-50"
            : "bg-zinc-900/50 border-zinc-600 hover:border-emerald-500/70 glass-hover cursor-pointer"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          boxShadow: !disabled && !installed ? [
            "0 0 0px rgba(16, 185, 129, 0)",
            "0 0 20px rgba(16, 185, 129, 0.3)",
            "0 0 0px rgba(16, 185, 129, 0)"
          ] : undefined
        }}
        transition={{ 
          duration: 0.5,
          boxShadow: { duration: 2, repeat: Infinity }
        }}
      >
        <HardDrive
          className={`w-12 h-12 ${
            installed ? "text-emerald-400" : "text-zinc-500"
          }`}
        />
        {installed && (
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Cpu className="w-5 h-5 text-emerald-400" />
            <div className="w-5 h-5 bg-emerald-500/30 rounded border border-emerald-500/50" />
          </motion.div>
        )}
      </motion.div>
      
      <p className="mt-3 text-sm font-mono text-zinc-400">
        {installed ? "Hardware OK" : "PC Tower"}
      </p>
      
      {!disabled && !installed && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-xs font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          !
        </motion.div>
      )}
    </motion.button>
  );
}
