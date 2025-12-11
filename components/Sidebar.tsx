/**
 * Sidebar Component
 * 
 * Displays lab progress, performance metrics, and activity logs
 * Shows aggregated specs for multi-PC setups
 * 
 * @module components/Sidebar
 */

"use client";

import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, BookOpen, CheckCircle, Circle, ArrowRight } from "lucide-react";

// Type imports
import { GameState, PCSpecs } from "@/app/page";

// Utility imports
import { getPerformanceTier, parseCPUSpecs, parseRAMSpecs, parseStorageSpecs, parseGPUSpecs } from "@/lib/performance";

interface SidebarProps {
  gameState: GameState;
}

/**
 * Right sidebar component showing progress, performance, and logs
 * Displays real-time system status and aggregated metrics for all PCs
 */
export default function Sidebar({ gameState }: SidebarProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // PROGRESS CALCULATION
  // ============================================================================
  const progressSteps = [
    { id: "hardware", label: "Hardware", completed: gameState.hardwareInstalled },
    { id: "os", label: "Sistem Operasi", completed: !!gameState.osInstalled },
    { id: "network", label: "Jaringan", completed: gameState.networkConnected },
  ];

  const completedSteps = progressSteps.filter(s => s.completed).length;
  const progressPercent = (completedSteps / progressSteps.length) * 100;

  // ============================================================================
  // AGGREGATED SPECS CALCULATION
  // ============================================================================
  
  /**
   * Calculate aggregated specs from all PCs
   * Sums up CPU cores, RAM, storage, and GPU specs across all machines
   * Falls back to single PC mode if no multi-PC specs exist
   */
  const aggregatedSpecs = useMemo(() => {
    const pcSpecs = Object.values(gameState.pcSpecs || {});
    if (pcSpecs.length === 0) {
      // Fallback to single PC specs from gameState
      if (gameState.cpuModel) {
        const cpuInfo = parseCPUSpecs(gameState.cpuModel);
        const ramInfo = parseRAMSpecs(gameState.ramSize || "8GB DDR4");
        const storageInfo = parseStorageSpecs(gameState.storage || "256GB SSD");
        const gpuInfo = parseGPUSpecs(gameState.gpu || "GTX 1650");
        return {
          totalCores: cpuInfo.cores,
          totalThreads: cpuInfo.threads,
          totalRAM: ramInfo.gb,
          ramType: ramInfo.type,
          totalStorage: storageInfo.gb,
          storageType: storageInfo.type,
          totalGPUCores: gpuInfo.cores,
          totalVRAM: gpuInfo.vram,
          pcCount: 1,
        };
      }
      return null;
    }

    let totalCores = 0;
    let totalThreads = 0;
    let totalRAM = 0;
    let totalStorage = 0;
    let totalGPUCores = 0;
    let totalVRAM = 0;
    let ramType = "DDR4";
    let storageType = "SSD";

    pcSpecs.forEach((spec) => {
      const cpuInfo = parseCPUSpecs(spec.cpuModel);
      const ramInfo = parseRAMSpecs(spec.ramSize);
      const storageInfo = parseStorageSpecs(spec.storage);
      const gpuInfo = parseGPUSpecs(spec.gpu);

      totalCores += cpuInfo.cores;
      totalThreads += cpuInfo.threads;
      totalRAM += ramInfo.gb;
      totalStorage += storageInfo.gb;
      totalGPUCores += gpuInfo.cores;
      totalVRAM += gpuInfo.vram;
      
      // Keep the best type
      if (ramInfo.type === "DDR5") ramType = "DDR5";
      if (storageInfo.type === "NVMe SSD") storageType = "NVMe SSD";
    });

    return {
      totalCores,
      totalThreads,
      totalRAM,
      ramType,
      totalStorage,
      storageType,
      totalGPUCores,
      totalVRAM,
      pcCount: pcSpecs.length,
    };
  }, [gameState.pcSpecs, gameState.cpuModel, gameState.ramSize, gameState.storage, gameState.gpu]);

  return (
    <aside className="w-80 bg-[#0d1b2a]/95 backdrop-blur-md border-l border-cyan-500/20 p-6 flex flex-col gap-6 h-screen overflow-hidden">
      {/* Progres Setup */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-950/30 border border-cyan-500/30 rounded-lg p-4"
      >
        <h3 className="text-sm font-bold text-cyan-400 mb-3 font-mono flex items-center gap-2">
          <BookOpen className="w-4 h-4" />
          PROGRES SETUP
        </h3>
        
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-cyan-300/70">{completedSteps}/3 Langkah</span>
            <span className="text-xs text-cyan-400">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-[#0a1628] rounded-full h-2 overflow-hidden border border-cyan-500/20">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {progressSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2 text-xs">
              {step.completed ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-cyan-500/30" />
              )}
              <span className={step.completed ? "text-cyan-400" : "text-cyan-400/50"}>
                {step.label}
              </span>
              {index < progressSteps.length - 1 && !step.completed && progressSteps[index - 1]?.completed !== false && (
                <ArrowRight className="w-3 h-3 text-cyan-500/50 ml-auto" />
              )}
            </div>
          ))}
        </div>

        {/* Status Message */}
        <div className="mt-3 pt-3 border-t border-cyan-500/20">
          <p className="text-xs text-cyan-400/70">
            {completedSteps === 0 && "Klik PC Tower untuk memulai instalasi hardware"}
            {completedSteps === 1 && "Klik Monitor untuk menginstal sistem operasi"}
            {completedSteps === 2 && "Klik Router untuk mengatur koneksi jaringan"}
            {completedSteps === 3 && "✨ Lab virtual siap digunakan!"}
          </p>
        </div>
      </motion.div>

      {/* Metrik Performa */}
      {gameState.performanceMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4"
        >
          <h3 className="text-sm font-bold text-cyan-400 mb-3 font-mono flex items-center gap-2">
            <Zap className="w-4 h-4" />
            PERFORMA
          </h3>
          
          <div className="space-y-3">
            {/* Skor Keseluruhan */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-cyan-400/60">Keseluruhan</span>
                <span className={`text-sm font-bold ${getPerformanceTier(gameState.performanceMetrics.overall).color}`}>
                  {gameState.performanceMetrics.overall}/100
                </span>
              </div>
              <div className="w-full bg-[#0a1628] rounded-full h-2 overflow-hidden border border-cyan-500/20">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${gameState.performanceMetrics.overall}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <p className={`text-xs mt-1 ${getPerformanceTier(gameState.performanceMetrics.overall).color}`}>
                {getPerformanceTier(gameState.performanceMetrics.overall).tier}
              </p>
            </div>

            {/* Skor Komponen dengan Detail Hardware - Agregat dari semua PC */}
            <div className="space-y-2 text-xs">
              {aggregatedSpecs && (
                <>
                  {aggregatedSpecs.pcCount > 1 && (
                    <div className="text-xs text-cyan-400/70 mb-2 pb-2 border-b border-cyan-500/20">
                      Total dari {aggregatedSpecs.pcCount} PC
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">CPU:</span>
                    <span className="text-cyan-400 font-mono">
                      {aggregatedSpecs.totalCores} Cores / {aggregatedSpecs.totalThreads} Threads
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">RAM:</span>
                    <span className="text-cyan-400 font-mono">
                      {aggregatedSpecs.totalRAM}GB {aggregatedSpecs.ramType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">Penyimpanan:</span>
                    <span className="text-cyan-400 font-mono">
                      {aggregatedSpecs.totalStorage >= 1024 
                        ? `${(aggregatedSpecs.totalStorage / 1024).toFixed(1)}TB` 
                        : `${aggregatedSpecs.totalStorage}GB`} {aggregatedSpecs.storageType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-400">GPU:</span>
                    <span className="text-cyan-400 font-mono">
                      {aggregatedSpecs.totalGPUCores} cores / {aggregatedSpecs.totalVRAM}GB VRAM
                    </span>
                  </div>
                  {gameState.psu && (
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-400">PSU:</span>
                      <span className="text-cyan-400 font-mono">{gameState.psu}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Dampak Performa */}
            {gameState.networkConnected && (
              <div className="border-t border-cyan-500/20 pt-2 space-y-1 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-cyan-400/60">Boot VM:</span>
                  <span className="text-emerald-400">{gameState.performanceMetrics.vmBootTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400/60">Browser:</span>
                  <span className="text-purple-400">{gameState.performanceMetrics.browserLoadTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-400/60">Aplikasi:</span>
                  <span className="text-yellow-400">{gameState.performanceMetrics.appResponseTime}ms</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Log Informasi */}
      <div className="flex flex-col flex-1 min-h-0">
        <h2 className="text-xl font-bold text-cyan-400 mb-4 font-mono flex-shrink-0">
          [ LOG INFO ]
        </h2>
        <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 font-mono text-xs space-y-1 flex-1 overflow-y-auto scrollbar-hide">
          {gameState.logs.slice(-50).map((log, index) => (
            <motion.div
              key={index}
              className="text-cyan-300/80"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
