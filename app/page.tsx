"use client";

import { useState, useEffect } from "react";
import Stage from "@/components/Stage";
import Sidebar from "@/components/Sidebar";
import WikiPanel from "@/components/WikiPanel";
import { AnimatePresence, motion } from "framer-motion";
import { calculatePerformance, getPerformanceTier, type PerformanceMetrics } from "@/lib/performance";
import { Monitor, Info, X, Users, GraduationCap, Smartphone, ChevronDown, ChevronUp } from "lucide-react";

export type Phase = "idle" | "hardware" | "os" | "network" | "complete";
export type OSType = "windows" | "linux" | null;

export interface PCSpecs {
  cpuModel: string;
  ramSize: string;
  storage: string;
  gpu: string;
  psu?: string;
  osInstalled: OSType;
  linuxDistro?: string;
  windowsEdition?: string;
  performanceMetrics?: PerformanceMetrics;
}

export interface GameState {
  currentPhase: Phase;
  hardwareInstalled: boolean;
  osInstalled: OSType;
  linuxDistro?: string;
  windowsEdition?: string;
  networkConnected: boolean;
  logs: string[];
  cpuModel?: string;
  ramSize?: string;
  storage?: string;
  gpu?: string;
  psu?: string;
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  dns?: string;
  startTime: number;
  vmMode: boolean;
  browserOpen: boolean;
  performanceMetrics?: PerformanceMetrics;
  wikiOpen: boolean;
  infoOpen: boolean;

  // Multi-PC support
  pcSpecs: Record<string, PCSpecs>;
  activePCId?: string;
}

// Developer info
const developers = [
  { name: "Alessandro Fathi Z", nim: "707022500026" },
  { name: "Muhammad Caesar Rifqi", nim: "707022500036" },
  { name: "Melischa Ramadhannia P", nim: "707022500056" },
  { name: "Wulan Noveliza Sriyanto", nim: "707022500063" },
  { name: "Dian Hijratulaini", nim: "707022500118" },
];

// Mobile not supported component
function MobileNotSupported() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md text-center"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Smartphone className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-4">
          Perangkat Tidak Didukung
        </h1>
        <p className="text-zinc-400 mb-6">
          Virtual Lab memerlukan layar yang lebih besar untuk pengalaman terbaik. 
          Silakan buka aplikasi ini menggunakan komputer desktop atau laptop.
        </p>
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 text-left">
          <p className="text-sm text-zinc-500 mb-2">Persyaratan minimum:</p>
          <ul className="text-sm text-zinc-400 space-y-1">
            <li>• Layar minimal 1024px lebar</li>
            <li>• Browser modern (Chrome, Firefox, Edge)</li>
            <li>• Keyboard dan mouse untuk interaksi</li>
          </ul>
        </div>
        <div className="mt-6 pt-6 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 font-mono">
            Virtual Lab SISJARKOM - Telkom University
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Collapsible PC Spec component
function CollapsiblePCSpec({ pcId, spec, ipAddress }: { pcId: string; spec: PCSpecs; ipAddress?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="bg-zinc-800/50 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-zinc-200 dark:hover:bg-zinc-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📟</span>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-300 font-mono">{pcId.toUpperCase()}</span>
          {spec.osInstalled && (
            <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full font-semibold">
              {spec.osInstalled.toUpperCase()}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 pt-0 text-xs font-mono">
              <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded p-3">
                <span className="text-zinc-600 dark:text-zinc-500 block mb-1.5 font-semibold">CPU</span>
                <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{spec.cpuModel || "N/A"}</span>
              </div>
              <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded p-3">
                <span className="text-zinc-600 dark:text-zinc-500 block mb-1.5 font-semibold">RAM</span>
                <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{spec.ramSize || "N/A"}</span>
              </div>
              <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded p-3">
                <span className="text-zinc-600 dark:text-zinc-500 block mb-1.5 font-semibold">Penyimpanan</span>
                <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{spec.storage || "N/A"}</span>
              </div>
              <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded p-3">
                <span className="text-zinc-600 dark:text-zinc-500 block mb-1.5 font-semibold">GPU</span>
                <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{spec.gpu || "N/A"}</span>
              </div>
              {spec.linuxDistro && (
                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded p-3">
                  <span className="text-zinc-600 dark:text-zinc-500 block mb-1.5 font-semibold">Distro</span>
                  <span className="text-cyan-600 dark:text-cyan-400 block leading-relaxed">{spec.linuxDistro}</span>
                </div>
              )}
              {ipAddress && (
                <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded p-3">
                  <span className="text-zinc-600 dark:text-zinc-500 block mb-1.5 font-semibold">Alamat IP</span>
                  <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{ipAddress}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  
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
    infoOpen: false,

    pcSpecs: {},
  });
  
  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);



  const addLog = (message: string) => {
    setGameState((prev) => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString("id-ID")}] ${message}`],
    }));
  };

  const completeHardware = (specs?: { cpu: string; ram: string; storage: string; gpu: string; psu: string }, pcId?: string) => {
    const cpuModels = [
      "Intel Core i7-12700K [12 Cores / 20 Threads @ 3.6GHz]",
      "AMD Ryzen 7 5800X [8 Cores / 16 Threads @ 3.8GHz]",
      "Intel Core i9-13900K [24 Cores / 32 Threads @ 3.0GHz]",
      "Intel Core i5-12400 [6 Cores / 12 Threads @ 2.5GHz]"
    ];
    const ramSizes = [
      "16GB DDR4 [3200MHz, Dual Channel]",
      "32GB DDR4 [3600MHz, Dual Channel]",
      "16GB DDR5 [4800MHz, Dual Channel]",
      "8GB DDR4 [2666MHz, Single Channel]"
    ];
    const storages = [
      "512GB NVMe SSD [3500MB/s Read, PCIe 3.0]",
      "1TB NVMe SSD [7000MB/s Read, PCIe 4.0]",
      "2TB SATA SSD [550MB/s Read, SATA III]",
      "256GB NVMe SSD [3000MB/s Read, PCIe 3.0]"
    ];
    const gpus = [
      "NVIDIA RTX 3060 [3584 Cores, 12GB GDDR6]",
      "AMD RX 6700 XT [2560 Cores, 12GB GDDR6]",
      "NVIDIA RTX 4070 [5888 Cores, 12GB GDDR6X]",
      "NVIDIA GTX 1660 Super [1408 Cores, 6GB GDDR6]"
    ];
    
    const psus = [
      "450W 80+ Bronze",
      "550W 80+ Bronze",
      "650W 80+ Gold",
      "750W 80+ Gold",
      "850W 80+ Platinum"
    ];
    
    const selectedCPU = specs?.cpu || cpuModels[Math.floor(Math.random() * cpuModels.length)];
    const selectedRAM = specs?.ram || ramSizes[Math.floor(Math.random() * ramSizes.length)];
    const selectedStorage = specs?.storage || storages[Math.floor(Math.random() * storages.length)];
    const selectedGPU = specs?.gpu || gpus[Math.floor(Math.random() * gpus.length)];
    const selectedPSU = specs?.psu || psus[Math.floor(Math.random() * psus.length)];
    
    // Calculate initial performance (without network)
    const performance = calculatePerformance({
      cpu: selectedCPU,
      ram: selectedRAM,
      storage: selectedStorage,
      gpu: selectedGPU,
    });
    
    const performanceTier = getPerformanceTier(performance.overall);
    
    // Create PC spec entry
    const newPCSpec: PCSpecs = {
      cpuModel: selectedCPU,
      ramSize: selectedRAM,
      storage: selectedStorage,
      gpu: selectedGPU,
      psu: selectedPSU,
      osInstalled: null,
      performanceMetrics: performance,
    };
    
    setGameState((prev) => ({
      ...prev,
      hardwareInstalled: true,
      currentPhase: "idle",
      cpuModel: selectedCPU,
      ramSize: selectedRAM,
      storage: selectedStorage,
      gpu: selectedGPU,
      psu: selectedPSU,
      performanceMetrics: performance,
      activePCId: pcId,
      pcSpecs: pcId ? { ...prev.pcSpecs, [pcId]: newPCSpec } : prev.pcSpecs,
    }));
    addLog("✓ Hardware berhasil diinstal!");
    addLog(`CPU: ${selectedCPU}`);
    addLog(`RAM: ${selectedRAM}`);
    addLog(`Storage: ${selectedStorage}`);
    addLog(`GPU: ${selectedGPU}`);
    addLog(`PSU: ${selectedPSU}`);
    addLog(`⚡ Performa Score: ${performance.overall}/100 (${performanceTier.tier})`);
    addLog("Klik pada Monitor untuk menginstal sistem operasi.");
  };

  const completeOS = (os: OSType, distro?: string, pcId?: string) => {
    setGameState((prev) => {
      // Update pcSpecs if pcId is provided
      const updatedPcSpecs = pcId && prev.pcSpecs[pcId] 
        ? { 
            ...prev.pcSpecs, 
            [pcId]: { 
              ...prev.pcSpecs[pcId], 
              osInstalled: os, 
              linuxDistro: os === "linux" ? distro : undefined,
              windowsEdition: os === "windows" ? distro : undefined
            } 
          }
        : prev.pcSpecs;
      
      return {
        ...prev,
        osInstalled: os,
        linuxDistro: os === "linux" ? distro : prev.linuxDistro,
        windowsEdition: os === "windows" ? distro : prev.windowsEdition,
        currentPhase: "idle",
        pcSpecs: updatedPcSpecs,
      };
    });
    if (os === "windows") {
      addLog(`✓ Windows OS berhasil diinstal! (${distro})`);
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
    setGameState((prev) => ({
      currentPhase: "idle",
      hardwareInstalled: false,
      osInstalled: null,
      networkConnected: false,
      logs: ["Sistem Virtual Lab dimulai ulang...", "Klik pada PC Tower untuk memulai instalasi hardware."],
      startTime: Date.now(),
      vmMode: false,
      browserOpen: false,
      wikiOpen: false,
      infoOpen: false,

      pcSpecs: {}, // Reset PC specs
    }));
  };

  const toggleWiki = () => {
    setGameState((prev) => ({ ...prev, wikiOpen: !prev.wikiOpen }));
  };

  const toggleInfo = () => {
    setGameState((prev) => ({ ...prev, infoOpen: !prev.infoOpen }));
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

  const removePCSpecs = (pcId: string) => {
    setGameState((prev) => {
      const newPcSpecs = { ...prev.pcSpecs };
      const removedSpec = newPcSpecs[pcId];
      delete newPcSpecs[pcId];
      
      // Check if there are any remaining PCs with hardware installed
      const hasAnyHardware = Object.keys(newPcSpecs).length > 0;
      const hasAnyOS = Object.values(newPcSpecs).some(spec => spec.osInstalled);
      
      return {
        ...prev,
        pcSpecs: newPcSpecs,
        hardwareInstalled: hasAnyHardware,
        osInstalled: hasAnyOS ? prev.osInstalled : null,
        activePCId: hasAnyHardware ? Object.keys(newPcSpecs)[0] : undefined,
      };
    });
    
    addLog(`PC dihapus dari konfigurasi. Metrik performa diperbarui.`);
  };

  // Show mobile not supported page
  if (isMobile) {
    return <MobileNotSupported />;
  }

  return (
    <main id="main-container" className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Left Sidebar - System Specs */}
      {gameState.hardwareInstalled && (
        <aside className="w-80 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col gap-6 h-screen overflow-y-auto scrollbar-hide">
          <h3 className="text-sm font-bold text-emerald-400 mb-2 font-mono flex items-center gap-2">
            <span>💻</span> SPESIFIKASI SISTEM
          </h3>
          <div className="space-y-3">
            {Object.keys(gameState.pcSpecs || {}).length > 0 ? (
              Object.entries(gameState.pcSpecs || {}).map(([pcId, spec]) => (
                <CollapsiblePCSpec 
                  key={pcId} 
                  pcId={pcId} 
                  spec={spec} 
                  ipAddress={gameState.ipAddress}
                />
              ))
            ) : (
              <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-zinc-500">CPU</span>
                    <span className="text-emerald-400">{gameState.cpuModel || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500">RAM</span>
                    <span className="text-emerald-400">{gameState.ramSize || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500">Penyimpanan</span>
                    <span className="text-emerald-400">{gameState.storage || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-500">GPU</span>
                    <span className="text-emerald-400">{gameState.gpu || "N/A"}</span>
                  </div>
                  {gameState.osInstalled && (
                    <div className="flex flex-col">
                      <span className="text-zinc-500">Sistem Operasi</span>
                      <span className="text-cyan-400">{gameState.osInstalled.toUpperCase()}{gameState.linuxDistro ? ` (${gameState.linuxDistro})` : ""}</span>
                    </div>
                  )}
                  {gameState.ipAddress && (
                    <div className="flex flex-col">
                      <span className="text-zinc-500">Alamat IP</span>
                      <span className="text-emerald-400">{gameState.ipAddress}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 py-8 flex flex-col">
        <header className="mb-8 px-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-3">
              <Monitor 
                className="w-9 h-9 rainbow-icon" 
                style={{ 
                  filter: "drop-shadow(0 0 10px currentColor)",
                }}
              />
              Virtual Lab: Trinitas Digital
            </h1>
            <p className="text-zinc-400 mt-2 font-mono text-sm">
              Simulasi Teknisi Lab // Hardware → OS → Jaringan
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={toggleInfo}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-300 hover:text-white hover:border-emerald-500/50 transition-all flex items-center gap-2"
            >
              <Info className="w-4 h-4" /> Tentang
            </button>
            
            <button
              onClick={toggleWiki}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-300 hover:text-white hover:border-cyan-500/50 transition-all flex items-center gap-2"
            >
              📚 Wiki & Panduan
            </button>
            
            {gameState.currentPhase === "complete" && (
              <button
                onClick={resetLab}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-mono text-zinc-300 hover:text-white hover:border-emerald-500/50 transition-all"
              >
                🔄 Reset Lab
              </button>
            )}
          </div>
        </header>
        
        <div className="px-8 flex-1 flex flex-col">
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
          removePCSpecs={removePCSpecs}
          />
        </div>
      </div>

      {/* Right Sidebar - Logs */}
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

      {/* Modal Informasi Proyek */}
      <AnimatePresence>
        {gameState.infoOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleInfo}
          >
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-lg w-full p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Tentang Proyek
                </h2>
                <button
                  onClick={toggleInfo}
                  className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-400" />
                </button>
              </div>

              {/* Informasi Proyek */}
              <div className="space-y-4">
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-cyan-400">Tugas Akhir</h3>
                  </div>
                  <p className="text-zinc-300 text-sm">
                    Proyek ini merupakan <span className="text-emerald-400 font-semibold">Tugas Akhir</span> untuk mata kuliah{" "}
                    <span className="text-cyan-400 font-semibold">Sistem Jaringan Komputer (SISJARKOM)</span>
                  </p>
                </div>

                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <p className="text-zinc-300 text-sm">
                    <span className="text-zinc-500">Institusi:</span>{" "}
                    <span className="text-emerald-400 font-semibold">Telkom University</span>
                  </p>
                  <p className="text-zinc-300 text-sm mt-1">
                    <span className="text-zinc-500">Program Studi:</span>{" "}
                    <span className="text-cyan-400 font-semibold">D4 Teknologi Rekayasa Multimedia</span>
                  </p>
                </div>

                {/* Tim Pengembang */}
                <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-purple-400" />
                    <h3 className="font-bold text-purple-400">Tim Pengembang</h3>
                  </div>
                  <div className="space-y-2">
                    {developers.map((dev, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-zinc-300">{dev.name}</span>
                        <span className="text-zinc-500 font-mono text-xs">{dev.nim}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
                <p className="text-zinc-500 text-xs font-mono">
                  © 2025 Virtual Lab SISJARKOM - Telkom University
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
