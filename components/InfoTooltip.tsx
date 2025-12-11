"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Info, X } from "lucide-react";
import { useState } from "react";

interface InfoTooltipProps {
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export default function InfoTooltip({ title, content, position = "top" }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionClasses = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full card hover:bg-cyan-500/20 transition-colors"
        type="button"
      >
        <Info className="w-4 h-4 text-cyan-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Tooltip */}
            <motion.div
              className={`absolute z-50 w-64 card rounded-lg p-4 shadow-xl border border-cyan-500/30 ${positionClasses[position]}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-bold text-cyan-400">{title}</h4>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-cyan-400/70 hover:text-cyan-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-cyan-300/90 leading-relaxed">{content}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
