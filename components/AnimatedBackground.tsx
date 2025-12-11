"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a1628]">
      {/* Blueprint Grid - Major Lines */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.3) 2px, transparent 2px),
            linear-gradient(90deg, rgba(59,130,246,0.3) 2px, transparent 2px)
          `,
          backgroundSize: "100px 100px",
        }}
      />
      
      {/* Blueprint Grid - Minor Lines */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Technical Measurement Lines - Corners */}
      <svg className="absolute inset-0 w-full h-full opacity-30">
        {/* Top Left Corner */}
        <line x1="20" y1="20" x2="100" y2="20" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="20" y1="20" x2="20" y2="100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="20" cy="20" r="4" fill="#3b82f6" />
        
        {/* Top Right Corner */}
        <line x1="calc(100% - 20px)" y1="20" x2="calc(100% - 100px)" y2="20" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="calc(100% - 20px)" y1="20" x2="calc(100% - 20px)" y2="100" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="calc(100% - 20px)" cy="20" r="4" fill="#3b82f6" />
        
        {/* Bottom Left Corner */}
        <line x1="20" y1="calc(100% - 20px)" x2="100" y2="calc(100% - 20px)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="20" y1="calc(100% - 20px)" x2="20" y2="calc(100% - 100px)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="20" cy="calc(100% - 20px)" r="4" fill="#3b82f6" />
        
        {/* Bottom Right Corner */}
        <line x1="calc(100% - 20px)" y1="calc(100% - 20px)" x2="calc(100% - 100px)" y2="calc(100% - 20px)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="calc(100% - 20px)" y1="calc(100% - 20px)" x2="calc(100% - 20px)" y2="calc(100% - 100px)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
        <circle cx="calc(100% - 20px)" cy="calc(100% - 20px)" r="4" fill="#3b82f6" />
      </svg>

      {/* Subtle Blue Glow */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0) 70%)",
          filter: "blur(100px)",
          left: "20%",
          top: "20%",
        }}
        animate={{
          x: ["-10%", "10%", "-10%"],
          y: ["-10%", "10%", "-10%"],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Technical Nodes/Connection Points */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${(i % 5) * 25 + 10}%`,
            top: `${Math.floor(i / 5) * 33 + 15}%`,
          }}
        >
          <motion.div
            className="relative"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2 + (i * 0.3),
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Node point */}
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 border-2 border-blue-400 rounded-full"
              animate={{
                scale: [1, 2.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* Blueprint Vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-950/20" />
    </div>
  );
}
