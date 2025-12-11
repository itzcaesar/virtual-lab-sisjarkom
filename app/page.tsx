"use client";

import { useState } from "react";
import Stage from "@/components/Stage";
import Sidebar from "@/components/Sidebar";
import WikiPanel from "@/components/WikiPanel";
import { AnimatePresence, motion } from "framer-motion";
import { calculatePerformance, getPerformanceTier, type PerformanceMetrics } from "@/lib/performance";
import { Sparkles } from "lucide-react";

export type Phase = "idle" | "hardware" | "os" | "network" | "complete";
export type OSType = "windows" | "linux" | null;

export interface GameState {
  currentPhase: Phase;
  hardwareInstalled: boolean;
  osInstalled: OSType;
  linuxDistro?: string;
  networkConnected: boolean;
  logs: string[];
  cpuModel?: string;
  ramSize?: string;
  storage?: string;
  gpu?: string;
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  dns?: string;
  startTime: number;
  vmMode: boolean;
  browserOpen: boolean;
  performanceMetrics?: PerformanceMetrics;
  wikiOpen: boolean;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>({
    currentPhase: "idle",
    hardwareInstalled: false,
    osInstalled: null,
    networkConnected: false,
    logs: ["Sistem Virtual Lab dimulai...", "Klik pada PC Tower untuk memulai instalasi hardware."],
    startTime: Date.now(),
    vmMode: false,
    browserOpen: false,
    wikiOpen: false,
  });

  const addLog = (message: string) => {
    setGameState((prev) => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString("id-ID")}] ${message}`],
    }));
  };

  const completeHardware = (specs?: { cpu: string; ram: string; storage: string; gpu: string }) => {
    const cpuModels = ["Intel Core i7-12700K", "AMD Ryzen 7 5800X", "Intel Core i9-13900K"];
    const ramSizes = ["16GB DDR4", "32GB DDR4", "16GB DDR5"];
    const storages = ["512GB NVMe SSD", "1TB NVMe SSD", "2TB SATA SSD"];
    const gpus = ["NVIDIA RTX 3060", "AMD RX 6700 XT", "NVIDIA RTX 4070"];
    
    const selectedCPU = specs?.cpu || cpuModels[Math.floor(Math.random() * cpuModels.length)];
    const selectedRAM = specs?.ram || ramSizes[Math.floor(Math.random() * ramSizes.length)];
    const selectedStorage = specs?.storage || storages[Math.floor(Math.random() * storages.length)];
    const selectedGPU = specs?.gpu || gpus[Math.floor(Math.random() * gpus.length)];
    
    // Calculate initial performance (without network)
    const performance = calculatePerformance({
      cpu: selectedCPU,
      ram: selectedRAM,
      storage: selectedStorage,
      gpu: selectedGPU,
    });
    
    const performanceTier = getPerformanceTier(performance.overall);
    
    setGameState((prev) => ({
      ...prev,
      hardwareInstalled: true,
      currentPhase: "idle",
      cpuModel: selectedCPU,
      ramSize: selectedRAM,
      storage: selectedStorage,
      gpu: selectedGPU,
      performanceMetrics: performance,
    }));
    addLog("✓ Hardware berhasil diinstal!");
    addLog(`CPU: ${selectedCPU}`);
    addLog(`RAM: ${selectedRAM}`);
    addLog(`Storage: ${selectedStorage}`);
    addLog(`GPU: ${selectedGPU}`);
    addLog(`⚡ Performa Score: ${performance.overall}/100 (${performanceTier.tier})`);
    addLog("Klik pada Monitor untuk menginstal sistem operasi.");
  };

  const completeOS = (os: OSType, distro?: string) => {
    setGameState((prev) => ({
      ...prev,
      osInstalled: os,
      linuxDistro: distro,
      currentPhase: "idle",
    }));
    if (os === "windows") {
      addLog("✓ Windows OS berhasil diinstal!");
      addLog("GUI dimuat. Interface user-friendly aktif.");
    } else {
      addLog(`✓ Linux OS berhasil diinstal! (${distro})`);
      addLog("Kernel dimuat. Akses root tersedia.");
    }
    addLog("Klik pada Router untuk mengatur koneksi jaringan.");
  };

  const completeNetwork = (config?: { ip: string; subnet: string; gateway: string; dns: string }) => {
    const generateIP = () => `192.168.1.${Math.floor(Math.random() * 200) + 10}`;
    const ipAddress = config?.ip || generateIP();
    const subnetMask = config?.subnet || "255.255.255.0";
    const gateway = config?.gateway || "192.168.1.1";
    const dns = config?.dns || "8.8.8.8";
    const elapsedTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    
    // Recalculate performance with network
    const performance = calculatePerformance(
      {
        cpu: gameState.cpuModel || "Intel Core i5-12400",
        ram: gameState.ramSize || "16GB DDR4",
        storage: gameState.storage || "512GB NVMe SSD",
        gpu: gameState.gpu || "NVIDIA RTX 3060",
      },
      { ip: ipAddress, subnet: subnetMask, gateway, dns }
    );
    
    const performanceTier = getPerformanceTier(performance.overall);
    
    setGameState((prev) => ({
      ...prev,
      networkConnected: true,
      currentPhase: "complete",
      ipAddress: ipAddress,
      subnetMask: subnetMask,
      gateway: gateway,
      dns: dns,
      performanceMetrics: performance,
    }));
    addLog("✓ Jaringan berhasil terhubung!");
    addLog(`IP Address: ${ipAddress}`);
    addLog(`Subnet Mask: ${subnetMask}`);
    addLog(`Gateway: ${gateway}`);
    addLog(`DNS: ${dns}`);
    addLog(`⚡ Final Performance: ${performance.overall}/100 (${performanceTier.tier})`);
    addLog(`VM Boot Time: ${performance.vmBootTime}ms`);
    addLog(`Browser Load: ${performance.browserLoadTime}ms`);
    addLog(`⏱️ Waktu setup: ${minutes}m ${seconds}s`);
    addLog("🎉 Semua fase selesai! Lab virtual siap digunakan.");
  };

  const resetLab = () => {
    setGameState({
      currentPhase: "idle",
      hardwareInstalled: false,
      osInstalled: null,
      networkConnected: false,
      logs: ["Sistem Virtual Lab dimulai ulang...", "Klik pada PC Tower untuk memulai instalasi hardware."],
      startTime: Date.now(),
      vmMode: false,
      browserOpen: false,
      wikiOpen: false,
    });
  };

  const toggleWiki = () => {
    setGameState((prev) => ({ ...prev, wikiOpen: !prev.wikiOpen }));
  };

  const toggleVM = () => {
    setGameState((prev) => ({ ...prev, vmMode: !prev.vmMode }));
    if (!gameState.vmMode) {
      addLog(`Membuka virtual machine ${gameState.osInstalled?.toUpperCase()}...`);
    } else {
      addLog("Keluar dari virtual machine...");
    }
  };

  const toggleBrowser = () => {
    setGameState((prev) => ({ ...prev, browserOpen: !prev.browserOpen }));
    if (!gameState.browserOpen) {
      addLog("Membuka web browser...");
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      <div className="flex-1 p-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles 
                  className="w-9 h-9 rainbow-icon" 
                  style={{ 
                    filter: "drop-shadow(0 0 10px currentColor)",
                  }}
                />
              </motion.div>
              Virtual Lab: The Digital Trinity
            </h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm">
              Simulasi Teknisi Lab // Hardware → OS → Network
            </p>
            {gameState.cpuModel && (
              <div className="mt-3 flex gap-4 text-xs font-mono">
                <span className="text-emerald-400">CPU: {gameState.cpuModel}</span>
                <span className="text-cyan-400">RAM: {gameState.ramSize}</span>
                {gameState.osInstalled && (
                  <span className="text-blue-400">OS: {gameState.osInstalled.toUpperCase()}</span>
                )}
                {gameState.ipAddress && (
                  <span className="text-emerald-400">IP: {gameState.ipAddress}</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={toggleWiki}
              className="px-4 py-2 glass rounded-lg text-sm font-mono text-zinc-300 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-2"
            >
              📚 Wiki & Panduan
            </button>
            
            {gameState.currentPhase === "complete" && (
              <button
                onClick={resetLab}
                className="px-4 py-2 glass rounded-lg text-sm font-mono text-zinc-300 hover:text-white hover:border-emerald-500/50 transition-all"
              >
                🔄 Reset Lab
              </button>
            )}
          </div>
        </header>
        
        <Stage 
          gameState={gameState}
          setGameState={setGameState}
          addLog={addLog}
          completeHardware={completeHardware}
          completeOS={completeOS}
          completeNetwork={completeNetwork}
          toggleVM={toggleVM}
          resetLab={resetLab}
          toggleBrowser={toggleBrowser}
        />
      </div>

      <Sidebar gameState={gameState} />
      
      <AnimatePresence>
        {gameState.wikiOpen && (
          <WikiPanel
            currentPhase={
              gameState.currentPhase === "idle" ? "overview" :
              gameState.currentPhase === "hardware" ? "hardware" :
              gameState.currentPhase === "os" ? "os" :
              gameState.currentPhase === "network" ? "network" : "overview"
            }
            onClose={toggleWiki}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
