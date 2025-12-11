"use client";

import { motion } from "framer-motion";
import { GameState } from "@/app/page";
import { CheckCircle2, Circle, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { getPerformanceTier } from "@/lib/performance";

interface SidebarProps {
  gameState: GameState;
}

export default function Sidebar({ gameState }: SidebarProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameState.logs]);

  const tasks = [
    {
      title: "Instalasi Hardware",
      completed: gameState.hardwareInstalled,
      description: "CPU & RAM",
    },
    {
      title: "Instalasi Sistem Operasi",
      completed: gameState.osInstalled !== null,
      description: gameState.osInstalled ? gameState.osInstalled.toUpperCase() : "Belum dipilih",
    },
    {
      title: "Konfigurasi Jaringan",
      completed: gameState.networkConnected,
      description: "Ethernet",
    },
  ];

  return (
    <aside className="w-96 bg-zinc-900 border-l border-zinc-800 p-6 flex flex-col gap-6">
      {/* System Specs (when hardware installed) */}
      {gameState.hardwareInstalled && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-4"
        >
          <h3 className="text-sm font-bold text-emerald-400 mb-3 font-mono flex items-center gap-2">
            <span>💻</span> SYSTEM SPECS
          </h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">CPU:</span>
              <span className="text-emerald-400 text-right max-w-[200px] truncate">{gameState.cpuModel || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">RAM:</span>
              <span className="text-emerald-400">{gameState.ramSize || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Storage:</span>
              <span className="text-emerald-400 text-right max-w-[200px] truncate">{gameState.storage || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">GPU:</span>
              <span className="text-emerald-400 text-right max-w-[200px] truncate">{gameState.gpu || "N/A"}</span>
            </div>
            {gameState.osInstalled && (
              <div className="flex justify-between">
                <span className="text-zinc-500">OS:</span>
                <span className="text-cyan-400">{gameState.osInstalled.toUpperCase()}</span>
              </div>
            )}
            {gameState.ipAddress && (
              <div className="flex justify-between">
                <span className="text-zinc-500">IP:</span>
                <span className="text-emerald-400">{gameState.ipAddress}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Performance Metrics */}
      {gameState.performanceMetrics && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-lg p-4 border border-cyan-500/30"
        >
          <h3 className="text-sm font-bold text-cyan-400 mb-3 font-mono flex items-center gap-2">
            <Zap className="w-4 h-4" />
            PERFORMANCE
          </h3>
          
          <div className="space-y-3">
            {/* Overall Score */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-zinc-500">Overall</span>
                <span className={`text-sm font-bold ${getPerformanceTier(gameState.performanceMetrics.overall).color}`}>
                  {gameState.performanceMetrics.overall}/100
                </span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${gameState.performanceMetrics.overall}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <p className={`text-xs mt-1 ${getPerformanceTier(gameState.performanceMetrics.overall).color}`}>
                {getPerformanceTier(gameState.performanceMetrics.overall).tier}
              </p>
            </div>

            {/* Component Scores */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">CPU:</span>
                <span className="text-emerald-400">{gameState.performanceMetrics.cpuScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">RAM:</span>
                <span className="text-cyan-400">{gameState.performanceMetrics.ramScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Storage:</span>
                <span className="text-blue-400">{gameState.performanceMetrics.storageScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">GPU:</span>
                <span className="text-purple-400">{gameState.performanceMetrics.gpuScore}</span>
              </div>
            </div>

            {/* Performance Impacts */}
            {gameState.networkConnected && (
              <div className="border-t border-zinc-700 pt-2 space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-500">VM Boot:</span>
                  <span className="text-emerald-400">{gameState.performanceMetrics.vmBootTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Browser:</span>
                  <span className="text-cyan-400">{gameState.performanceMetrics.browserLoadTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Apps:</span>
                  <span className="text-blue-400">{gameState.performanceMetrics.appResponseTime}ms</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Task Checklist */}
      <div>
        <h2 className="text-xl font-bold text-emerald-400 mb-4 font-mono">
          [ TASK CHECKLIST ]
        </h2>
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <motion.div
              key={index}
              className={`glass rounded-lg p-3 flex items-start gap-3 transition-all ${
                task.completed ? "border-emerald-500/30" : ""
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {task.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${task.completed ? "text-zinc-300 line-through" : "text-zinc-500"}`}>
                  {task.title}
                </p>
                <p className={`text-xs font-mono ${task.completed ? "text-emerald-500" : "text-zinc-600"}`}>
                  {task.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Log */}
      <div className="flex-1 flex flex-col min-h-0">
        <h2 className="text-xl font-bold text-cyan-400 mb-4 font-mono">
          [ INFO LOG ]
        </h2>
        <div className="glass rounded-lg p-4 overflow-y-auto font-mono text-xs space-y-1 max-h-[400px]">
          {gameState.logs.map((log, index) => (
            <motion.div
              key={index}
              className="text-zinc-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {log}
            </motion.div>
          ))}
          <div ref={logEndRef} />
        </div>
      </div>
    </aside>
  );
}
