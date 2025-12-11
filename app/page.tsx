/**
 * Virtual Lab SISJARKOM - Main Application Page
 * 
 * A comprehensive PC building and networking simulator styled after Cisco Packet Tracer.
 * Allows users to build computers, install operating systems, and configure networks.
 * 
 * @module app/page
 */

"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Monitor, Info, X, Users, GraduationCap, Smartphone, ChevronDown, ChevronUp } from "lucide-react";

// Component imports
import Stage from "@/components/Stage";
import Sidebar from "@/components/Sidebar";
import WikiPanel from "@/components/WikiPanel";
import AnimatedBackground from "@/components/AnimatedBackground";

// Utility imports
import { calculatePerformance, getPerformanceTier, type PerformanceMetrics } from "@/lib/performance";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** Lab progression phases */
export type Phase = "idle" | "hardware" | "os" | "network" | "complete";

/** Operating system types */
export type OSType = "windows" | "linux" | null;

/**
 * Individual PC specifications
 * Contains hardware and software configuration for a single computer
 */
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

/**
 * Main application state
 * Manages the entire lab simulation state including multi-PC support
 */
export interface GameState {
  // Phase management
  currentPhase: Phase;
  hardwareInstalled: boolean;
  osInstalled: OSType;
  
  // Operating system configuration
  linuxDistro?: string;
  windowsEdition?: string;
  
  // Network configuration
  networkConnected: boolean;
  ipAddress?: string;
  subnetMask?: string;
  gateway?: string;
  dns?: string;
  
  // Hardware specifications (legacy - used for single PC mode)
  cpuModel?: string;
  ramSize?: string;
  storage?: string;
  gpu?: string;
  psu?: string;
  
  // UI state
  logs: string[];
  startTime: number;
  vmMode: boolean;
  browserOpen: boolean;
  wikiOpen: boolean;
  infoOpen: boolean;
  
  // Performance metrics
  performanceMetrics?: PerformanceMetrics;
  
  // Multi-PC support
  pcSpecs: Record<string, PCSpecs>;
  activePCId?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Project development team */
const developers = [
  { name: "Muhammad Caesar Rifqi", nim: "707022500036" },
  { name: "Alessandro Fathi Z", nim: "707022500026" },
  { name: "Melischa Ramadhannia P", nim: "707022500056" },
  { name: "Wulan Noveliza Sriyanto", nim: "707022500063" },
  { name: "Dian Hijratulaini", nim: "707022500118" },
];

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Mobile not supported screen
 * Displays a message when users try to access the app on mobile devices
 * Requires minimum screen width of 1024px
 */
function MobileNotSupported() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#0d1b2a]/95 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-8 max-w-md text-center shadow-2xl shadow-cyan-500/10"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Smartphone className="w-20 h-20 text-cyan-400 mx-auto mb-6" />
        </motion.div>
        <h1 className="text-2xl font-bold text-cyan-400 mb-4">
          Perangkat Tidak Didukung
        </h1>
        <p className="text-cyan-300/70 mb-6">
          Virtual Lab memerlukan layar yang lebih besar untuk pengalaman terbaik. 
          Silakan buka aplikasi ini menggunakan komputer desktop atau laptop.
        </p>
        <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-left">
          <p className="text-sm text-cyan-400 mb-2">Persyaratan minimum:</p>
          <ul className="text-sm text-cyan-300/70 space-y-1">
            <li>• Layar minimal 1024px lebar</li>
            <li>• Browser modern (Chrome, Firefox, Edge)</li>
            <li>• Keyboard dan mouse untuk interaksi</li>
          </ul>
        </div>
        <div className="mt-6 pt-6 border-t border-cyan-500/20">
          <p className="text-xs text-cyan-400/50 font-mono">
            Virtual Lab SISJARKOM - Telkom University
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Collapsible PC specifications display
 * Shows hardware and software specs for a single PC with expand/collapse functionality
 * 
 * @param pcId - Unique identifier for the PC
 * @param spec - PC specifications object
 * @param ipAddress - Optional IP address if network is configured
 */
function CollapsiblePCSpec({ pcId, spec, ipAddress }: { pcId: string; spec: PCSpecs; ipAddress?: string }) {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="bg-cyan-800/50 dark:bg-cyan-800/50 border border-cyan-300 dark:border-cyan-700 rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 hover:bg-cyan-200 dark:hover:bg-cyan-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📟</span>
          <span className="text-sm font-bold text-cyan-800 dark:text-cyan-300 font-mono">{pcId.toUpperCase()}</span>
          {spec.osInstalled && (
            <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-full font-semibold">
              {spec.osInstalled.toUpperCase()}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-cyan-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-cyan-400" />
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
              <div className="bg-[#0a1628]/50 border border-cyan-500/20 rounded p-3">
                <span className="text-cyan-400/80 block mb-1.5 font-semibold">CPU</span>
                <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{spec.cpuModel || "N/A"}</span>
              </div>
              <div className="bg-[#0a1628]/50 border border-cyan-500/20 rounded p-3">
                <span className="text-cyan-400/80 block mb-1.5 font-semibold">RAM</span>
                <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{spec.ramSize || "N/A"}</span>
              </div>
              <div className="bg-[#0a1628]/50 border border-cyan-500/20 rounded p-3">
                <span className="text-cyan-400/80 block mb-1.5 font-semibold">Penyimpanan</span>
                <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{spec.storage || "N/A"}</span>
              </div>
              <div className="bg-[#0a1628]/50 border border-cyan-500/20 rounded p-3">
                <span className="text-cyan-400/80 block mb-1.5 font-semibold">GPU</span>
                <span className="text-emerald-600 dark:text-emerald-400 block leading-relaxed">{spec.gpu || "N/A"}</span>
              </div>
              {spec.linuxDistro && (
                <div className="bg-[#0a1628]/50 border border-cyan-500/20 rounded p-3">
                  <span className="text-cyan-400/80 block mb-1.5 font-semibold">Distro</span>
                  <span className="text-cyan-600 dark:text-cyan-400 block leading-relaxed">{spec.linuxDistro}</span>
                </div>
              )}
              {ipAddress && (
                <div className="bg-[#0a1628]/50 border border-cyan-500/20 rounded p-3">
                  <span className="text-cyan-400/80 block mb-1.5 font-semibold">Alamat IP</span>
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

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * Home - Main application component
 * Manages the entire virtual lab state and renders all sub-components
 * Handles mobile detection and responsive layout
 */
export default function Home() {
  // Mobile detection state
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
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Mobile device detection
   * Checks if viewport width is below 1024px and shows mobile warning
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Add timestamped log entry
   * @param message - Log message to add
   */
  const addLog = (message: string) => {
    setGameState((prev) => ({
      ...prev,
      logs: [...prev.logs, `[${new Date().toLocaleTimeString("id-ID")}] ${message}`],
    }));
  };

  /**
   * Complete hardware installation phase
   * Randomly selects components if not provided, calculates performance metrics
   * 
   * @param specs - Optional hardware specifications
   * @param pcId - Optional PC identifier for multi-PC support
   */
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

  /**
   * Complete operating system installation phase
   * Updates PC specs with OS information
   * 
   * @param os - Operating system type (windows/linux)
   * @param distro - OS distribution/edition name
   * @param pcId - Optional PC identifier for multi-PC support
   */
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

  /**
   * Complete network configuration phase
   * Generates or uses provided network settings, recalculates performance with network impact
   * 
   * @param config - Optional network configuration (IP, subnet, gateway, DNS)
   */
  const completeNetwork = (config?: { ip: string; subnet: string; gateway: string; dns: string }) => {
    // Generate random IP if not provided
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

  /**
   * Reset entire lab to initial state
   * Clears all configurations and returns to start
   */
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
      pcSpecs: {},
    }));
  };

  /**
   * Toggle wiki panel visibility
   */
  const toggleWiki = () => {
    setGameState((prev) => ({ ...prev, wikiOpen: !prev.wikiOpen }));
  };

  /**
   * Toggle info modal visibility
   */
  const toggleInfo = () => {
    setGameState((prev) => ({ ...prev, infoOpen: !prev.infoOpen }));
  };

  /**
   * Toggle virtual machine mode
   * Opens/closes VM window and logs the action
   */
  const toggleVM = () => {
    setGameState((prev) => ({ ...prev, vmMode: !prev.vmMode }));
    if (!gameState.vmMode) {
      addLog(`Membuka virtual machine ${gameState.osInstalled?.toUpperCase()}...`);
    } else {
      addLog("Keluar dari virtual machine...");
    }
  };

  /**
   * Toggle browser window in VM
   * Opens/closes browser and logs the action
   */
  const toggleBrowser = () => {
    setGameState((prev) => ({ ...prev, browserOpen: !prev.browserOpen }));
    if (!gameState.browserOpen) {
      addLog("Membuka web browser...");
    }
  };

  /**
   * Remove PC specifications from multi-PC setup
   * Deletes PC and updates global hardware/OS state accordingly
   * 
   * @param pcId - Unique identifier of the PC to remove
   */
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
    <main id="main-container" className="min-h-screen bg-[#0a1628] text-cyan-100 flex relative">
      {/* Animated Background Effect */}
      <AnimatedBackground />
      
      {/* Left Sidebar - System Specs */}
      {gameState.hardwareInstalled && (
        <aside className="w-80 bg-[#0d1b2a]/90 backdrop-blur-md border-r border-cyan-500/30 p-6 flex flex-col gap-6 h-screen overflow-y-auto scrollbar-hide relative z-10 transition-all duration-300">
          <h3 className="text-sm font-bold text-cyan-400 mb-2 font-mono flex items-center gap-2">
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
              <div className="bg-cyan-800 border border-cyan-700 rounded-lg p-4">
                <div className="space-y-3 text-xs font-mono">
                  <div className="flex flex-col">
                    <span className="text-cyan-500">CPU</span>
                    <span className="text-emerald-400">{gameState.cpuModel || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-cyan-500">RAM</span>
                    <span className="text-emerald-400">{gameState.ramSize || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-cyan-500">Penyimpanan</span>
                    <span className="text-emerald-400">{gameState.storage || "N/A"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-cyan-500">GPU</span>
                    <span className="text-emerald-400">{gameState.gpu || "N/A"}</span>
                  </div>
                  {gameState.osInstalled && (
                    <div className="flex flex-col">
                      <span className="text-cyan-500">Sistem Operasi</span>
                      <span className="text-cyan-400">{gameState.osInstalled.toUpperCase()}{gameState.linuxDistro ? ` (${gameState.linuxDistro})` : ""}</span>
                    </div>
                  )}
                  {gameState.ipAddress && (
                    <div className="flex flex-col">
                      <span className="text-cyan-500">Alamat IP</span>
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
      <div className="flex-1 py-8 flex flex-col relative z-10">
        <header className="mb-8 px-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent flex items-center gap-3">
              <Monitor 
                className="w-9 h-9 text-cyan-400"
              />
              Virtual Lab
            </h1>
            <p className="text-cyan-300 mt-2 font-mono text-sm tracking-wider">
              [BLUEPRINT v2.1] // Hardware → OS → Network
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={toggleInfo}
              className="px-4 py-2 bg-blue-900/50 border border-cyan-500/50 rounded text-sm font-mono text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-blue-800/50 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <Info className="w-4 h-4" /> Tentang
            </button>
            
            <button
              onClick={toggleWiki}
              className="px-4 py-2 bg-blue-900/50 border border-cyan-500/50 rounded text-sm font-mono text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-blue-800/50 transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              📚 Wiki & Panduan
            </button>
            
            {gameState.currentPhase === "complete" && (
              <button
                onClick={resetLab}
                className="px-4 py-2 bg-blue-900/50 border border-cyan-500/50 rounded text-sm font-mono text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-blue-800/50 transition-all backdrop-blur-sm"
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
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleInfo}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </div>

            <motion.div
              className="relative bg-[#0d1b2a]/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl shadow-cyan-500/10"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
              
              {/* Header with gradient */}
              <div className="relative border-b border-cyan-500/20 p-6 bg-gradient-to-r from-blue-950/50 via-blue-900/30 to-blue-950/50">
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/30"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Info className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-mono">
                        Tentang Proyek
                      </h2>
                      <p className="text-xs text-cyan-500/70 mt-0.5">Virtual Lab SISJARKOM</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={toggleInfo}
                    className="p-2.5 hover:bg-cyan-500/10 rounded-lg transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-cyan-400" />
                  </motion.button>
                </motion.div>
              </div>

              {/* Content */}
              <div className="relative p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Tugas Akhir Card */}
                <motion.div
                  className="relative bg-blue-950/30 border border-cyan-500/20 rounded-lg p-5 overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  whileHover={{ borderColor: "rgba(34, 211, 238, 0.4)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="relative flex items-start gap-3">
                    <motion.div
                      className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <GraduationCap className="w-6 h-6 text-cyan-400" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                        Tugas Akhir
                        <span className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded-full">2025</span>
                      </h3>
                      <p className="text-cyan-300 text-sm leading-relaxed">
                        Proyek ini merupakan <span className="text-emerald-400 font-semibold">Tugas Akhir</span> untuk mata kuliah{" "}
                        <span className="text-cyan-400 font-semibold">Sistem Jaringan Komputer (SISJARKOM)</span>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* University Info Card */}
                <motion.div
                  className="relative bg-blue-950/30 border border-cyan-500/20 rounded-lg p-5 overflow-hidden group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                  whileHover={{ borderColor: "rgba(34, 211, 238, 0.4)" }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <p className="text-cyan-300 text-sm">
                        <span className="text-cyan-500">Institusi:</span>{" "}
                        <span className="text-emerald-400 font-bold">Telkom University</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <p className="text-cyan-300 text-sm">
                        <span className="text-cyan-500">Program Studi:</span>{" "}
                        <span className="text-cyan-400 font-bold">D4 Teknologi Rekayasa Multimedia</span>
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Tim Pengembang Card */}
                <motion.div
                  className="relative bg-blue-950/30 border border-cyan-500/20 rounded-lg p-5 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-4">
                      <motion.div
                        className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Users className="w-5 h-5 text-purple-400" />
                      </motion.div>
                      <h3 className="font-bold text-purple-400">Tim Pengembang</h3>
                      <div className="ml-auto px-3 py-1 bg-purple-500/10 rounded-full border border-purple-500/20">
                        <span className="text-xs text-purple-300 font-semibold">{developers.length} Anggota</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {developers.map((dev, idx) => (
                        <motion.div
                          key={idx}
                          className="flex justify-between items-center p-3 rounded-lg bg-cyan-900/30 border border-cyan-700/30 hover:bg-cyan-900/50 hover:border-purple-500/30 transition-all group"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center text-xs font-bold text-purple-300">
                              {idx + 1}
                            </div>
                            <span className="text-cyan-300 group-hover:text-white transition-colors">{dev.name}</span>
                          </div>
                          <span className="text-cyan-500 font-mono text-xs bg-cyan-800/50 px-2 py-1 rounded border border-cyan-700/50">
                            {dev.nim}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Footer with gradient */}
              <motion.div
                className="relative border-t border-cyan-500/20 p-4 bg-gradient-to-r from-blue-950/50 via-blue-900/30 to-blue-950/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
                  </motion.div>
                  <p className="text-cyan-500/70 text-xs font-mono">
                    © 2025 Virtual Lab SISJARKOM - Telkom University
                  </p>
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400" />
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
