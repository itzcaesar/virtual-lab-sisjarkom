"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GameState, Phase, OSType } from "@/app/page";
import DraggableCanvas, { CanvasModule, CableConnection } from "./DraggableCanvas";
import HardwareModal from "./modals/HardwareModal";
import OSModal from "./modals/OSModal";
import NetworkModal from "./modals/NetworkModal";
import WindowsVM from "./WindowsVM";
import LinuxVM from "./LinuxVM";
import { HardDrive, Monitor as MonitorIcon, Wifi, Plus } from "lucide-react";

interface StageProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  addLog: (message: string) => void;
  completeHardware: (specs?: { cpu: string; ram: string; storage: string; gpu: string; psu: string }, pcId?: string) => void;
  completeOS: (os: OSType, distro?: string, pcId?: string) => void;
  completeNetwork: () => void;
  toggleVM: () => void;
  toggleBrowser: () => void;
  resetLab: () => void;
  removePCSpecs: (pcId: string) => void;
}

export default function Stage({
  gameState,
  setGameState,
  addLog,
  completeHardware,
  completeOS,
  completeNetwork,
  toggleVM,
  toggleBrowser,
  resetLab,
  removePCSpecs,
}: StageProps) {
  const [modules, setModules] = useState<CanvasModule[]>([]);
  const [cables, setCables] = useState<CableConnection[]>([]);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleCounter, setModuleCounter] = useState({ pc: 0, monitor: 0, router: 0 });
  const [deleteMode, setDeleteMode] = useState(false);
  
  // Track which specific module is being configured
  const [configuringModuleId, setConfiguringModuleId] = useState<string | null>(null);
  
  // Track individual PC configurations (maps module ID to OS type)
  const [pcConfigurations, setPcConfigurations] = useState<Record<string, { os: OSType; hardware: boolean; network: boolean }>>({});
  
  // VM selector state
  const [showVMSelector, setShowVMSelector] = useState(false);
  const [activeVMModuleId, setActiveVMModuleId] = useState<string | null>(null);

  // Wrapper functions that mark the SPECIFIC module as configured
  const handleCompleteHardware = (specs?: { cpu: string; ram: string; storage: string; gpu: string; psu: string }) => {
    completeHardware(specs, configuringModuleId || undefined);
    // Mark only the specific PC module being configured
    if (configuringModuleId) {
      setModules((prev) =>
        prev.map((m) => (m.id === configuringModuleId ? { ...m, configured: true } : m))
      );
      // Track this PC's hardware config
      setPcConfigurations(prev => ({
        ...prev,
        [configuringModuleId]: { ...prev[configuringModuleId], hardware: true, os: null, network: false }
      }));
    }
  };

  const handleCompleteOS = (os: OSType, distro?: string) => {
    // Find the PC connected to this monitor via cables
    const connectedCable = cables.find(c => c.to === configuringModuleId || c.from === configuringModuleId);
    const connectedPCId = connectedCable ? 
      (modules.find(m => m.id === connectedCable.from && m.type === "pc")?.id ||
       modules.find(m => m.id === connectedCable.to && m.type === "pc")?.id) : null;
    
    // Fallback to any configured PC or first PC
    const pcModule = connectedPCId ? 
      modules.find(m => m.id === connectedPCId) :
      modules.find(m => m.type === "pc" && m.configured) ||
      modules.find(m => m.type === "pc");
    
    const pcIdToUse = pcModule?.id || undefined;
    
    completeOS(os, distro, pcIdToUse);
    
    // Mark only the specific monitor module being configured
    if (configuringModuleId) {
      setModules((prev) =>
        prev.map((m) => (m.id === configuringModuleId ? { ...m, configured: true } : m))
      );
      
      // Store OS config for the associated PC
      if (pcModule) {
        setPcConfigurations(prev => ({
          ...prev,
          [pcModule.id]: { ...prev[pcModule.id], os, hardware: true }
        }));
      }
    }
  };

  const handleCompleteNetwork = () => {
    completeNetwork();
    // Mark only the specific router module being configured
    if (configuringModuleId) {
      setModules((prev) =>
        prev.map((m) => (m.id === configuringModuleId ? { ...m, configured: true } : m))
      );
    }
  };
  
  // Get configured PCs with OS installed
  const getConfiguredPCs = () => {
    return modules.filter(m => m.type === "pc" && pcConfigurations[m.id]?.os);
  };

  // Canvas presets
  const canvasPresets = [
    {
      name: "Jaringan Sederhana",
      modules: [
        { type: "pc" as const, position: { x: 200, y: 300 }, label: "PC-1" },
        { type: "monitor" as const, position: { x: 400, y: 300 }, label: "MONITOR-1" },
        { type: "router" as const, position: { x: 600, y: 300 }, label: "ROUTER-1" },
      ],
      cables: [
        { from: 0, to: 1, type: "power" as const },
        { from: 1, to: 2, type: "ethernet" as const },
      ],
    },
    {
      name: "Lab Multi-PC",
      modules: [
        { type: "pc" as const, position: { x: 150, y: 200 }, label: "PC-1" },
        { type: "monitor" as const, position: { x: 300, y: 200 }, label: "MONITOR-1" },
        { type: "pc" as const, position: { x: 150, y: 400 }, label: "PC-2" },
        { type: "monitor" as const, position: { x: 300, y: 400 }, label: "MONITOR-2" },
        { type: "router" as const, position: { x: 500, y: 300 }, label: "ROUTER-1" },
      ],
      cables: [
        { from: 0, to: 1, type: "power" as const },
        { from: 2, to: 3, type: "power" as const },
        { from: 1, to: 4, type: "ethernet" as const },
        { from: 3, to: 4, type: "ethernet" as const },
      ],
    },
    {
      name: "Ruang Server",
      modules: [
        { type: "pc" as const, position: { x: 150, y: 150 }, label: "SERVER-1" },
        { type: "monitor" as const, position: { x: 300, y: 150 }, label: "MONITOR-1" },
        { type: "pc" as const, position: { x: 150, y: 300 }, label: "SERVER-2" },
        { type: "monitor" as const, position: { x: 300, y: 300 }, label: "MONITOR-2" },
        { type: "pc" as const, position: { x: 150, y: 450 }, label: "WORKSTATION" },
        { type: "monitor" as const, position: { x: 300, y: 450 }, label: "MONITOR-3" },
        { type: "router" as const, position: { x: 550, y: 300 }, label: "ROUTER-1" },
      ],
      cables: [
        { from: 0, to: 1, type: "power" as const },
        { from: 2, to: 3, type: "power" as const },
        { from: 4, to: 5, type: "power" as const },
        { from: 1, to: 6, type: "ethernet" as const },
        { from: 3, to: 6, type: "ethernet" as const },
        { from: 5, to: 6, type: "ethernet" as const },
      ],
    },
  ];

  const openPhase = (phase: Phase) => {
    setGameState((prev) => ({ ...prev, currentPhase: phase }));
  };

  const closeModal = () => {
    setGameState((prev) => ({ ...prev, currentPhase: "idle" }));
  };

  const addModule = (type: "pc" | "monitor" | "router") => {
    const newCounter = { ...moduleCounter, [type]: moduleCounter[type] + 1 };
    setModuleCounter(newCounter);

    const label = `${type.toUpperCase()}-${newCounter[type]}`;
    const newModule: CanvasModule = {
      id: label.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type,
      position: { x: 150 + modules.length * 50, y: 200 + modules.length * 30 },
      label: label,
      configured: 
        (type === "pc" && gameState.hardwareInstalled) ||
        (type === "monitor" && !!gameState.osInstalled) ||
        (type === "router" && gameState.networkConnected),
    };

    setModules([...modules, newModule]);
    addLog(`Module ${newModule.label} ditambahkan ke canvas`);
  };

  const handleModuleMove = (id: string, position: { x: number; y: number }) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, position } : m))
    );
  };

  const handleModuleClick = (module: CanvasModule) => {
    setSelectedModule(module.id);
    setConfiguringModuleId(module.id);
    
    // Open configuration based on module type - allow reconfiguration anytime
    if (module.type === "pc") {
      openPhase("hardware");
      if (module.configured) {
        addLog(`Membuka konfigurasi hardware ${module.label} untuk modifikasi...`);
      } else {
        addLog(`Mengkonfigurasi ${module.label}...`);
      }
    } else if (module.type === "monitor") {
      // Find connected PC to check if hardware is installed
      const connectedCable = cables.find(c => c.to === module.id || c.from === module.id);
      const connectedPCId = connectedCable ? 
        (connectedCable.to === module.id ? connectedCable.from : connectedCable.to) : null;
      const connectedPC = connectedPCId ? modules.find(m => m.id === connectedPCId && m.type === "pc") : null;
      
      if (!connectedPC?.configured && !gameState.hardwareInstalled) {
        addLog(`⚠️ Install hardware terlebih dahulu sebelum mengkonfigurasi OS`);
        return;
      }
      openPhase("os");
      if (module.configured) {
        addLog(`Membuka konfigurasi OS ${module.label} untuk modifikasi...`);
      } else {
        addLog(`Menginstal OS pada ${module.label}...`);
      }
    } else if (module.type === "router") {
      if (!gameState.osInstalled) {
        addLog(`⚠️ Install OS terlebih dahulu sebelum mengkonfigurasi network`);
        return;
      }
      openPhase("network");
      if (module.configured) {
        addLog(`Membuka konfigurasi ${module.label} untuk modifikasi...`);
      } else {
        addLog(`Mengkonfigurasi ${module.label}...`);
      }
    }
  };
  
  // Handle VM selection
  const handleOpenVM = (moduleId?: string) => {
    const configuredPCs = getConfiguredPCs();
    
    if (configuredPCs.length === 0) {
      addLog(`⚠️ Tidak ada PC yang sudah dikonfigurasi dengan OS`);
      return;
    }
    
    if (configuredPCs.length === 1 || moduleId) {
      // Single PC or specific PC selected
      const targetId = moduleId || configuredPCs[0].id;
      setActiveVMModuleId(targetId);
      setShowVMSelector(false);
      toggleVM();
    } else {
      // Multiple PCs - show selector
      setShowVMSelector(true);
    }
  };
  
  const selectVMAndOpen = (moduleId: string) => {
    setActiveVMModuleId(moduleId);
    setShowVMSelector(false);
    toggleVM();
  };
  
  // Get the OS type for the active VM
  const getActiveVMOS = (): OSType | null => {
    if (!activeVMModuleId) return gameState.osInstalled;
    return pcConfigurations[activeVMModuleId]?.os || gameState.osInstalled;
  };

  // Get active PC's full specs
  const getActivePCSpecs = () => {
    if (activeVMModuleId && gameState.pcSpecs[activeVMModuleId]) {
      return gameState.pcSpecs[activeVMModuleId];
    }
    // Fallback to first available PC spec
    const firstPCId = Object.keys(gameState.pcSpecs)[0];
    return firstPCId ? gameState.pcSpecs[firstPCId] : null;
  };

  // Get active PC's OS edition (Windows or Linux distro)
  const getActiveOSEdition = (): string => {
    const specs = getActivePCSpecs();
    if (!specs) return gameState.windowsEdition || gameState.linuxDistro || "Unknown";
    
    if (specs.osInstalled === "windows") {
      return specs.windowsEdition || gameState.windowsEdition || "Windows 11 Pro";
    } else if (specs.osInstalled === "linux") {
      return specs.linuxDistro || gameState.linuxDistro || "Ubuntu";
    }
    return "Unknown";
  };

  // Get active PC's hardware specs
  const getActivePCHardware = () => {
    const specs = getActivePCSpecs();
    if (!specs) {
      return {
        cpu: gameState.cpuModel || "Unknown CPU",
        ram: gameState.ramSize || "Unknown RAM",
        storage: gameState.storage || "Unknown Storage",
        gpu: gameState.gpu || "Unknown GPU"
      };
    }
    return {
      cpu: specs.cpuModel,
      ram: specs.ramSize,
      storage: specs.storage,
      gpu: specs.gpu
    };
  };

  const handleCableStart = (moduleId: string) => {
    setConnectingFrom(moduleId);
    const module = modules.find((m) => m.id === moduleId);
    addLog(`Memulai koneksi dari ${module?.label}...`);
  };

  const handleCableEnd = (moduleId: string) => {
    if (!connectingFrom || connectingFrom === moduleId) {
      setConnectingFrom(null);
      return;
    }

    const fromModule = modules.find((m) => m.id === connectingFrom);
    const toModule = modules.find((m) => m.id === moduleId);

    // Determine cable type based on modules
    let cableType: "power" | "ethernet" = "power";
    if (
      (fromModule?.type === "monitor" && toModule?.type === "router") ||
      (fromModule?.type === "router" && toModule?.type === "monitor")
    ) {
      cableType = "ethernet";
    }

    const newCable: CableConnection = {
      id: `cable-${cables.length + 1}`,
      from: connectingFrom,
      to: moduleId,
      type: cableType,
    };

    setCables([...cables, newCable]);
    addLog(
      `${fromModule?.label} terhubung ke ${toModule?.label} dengan kabel ${cableType}`
    );
    setConnectingFrom(null);
  };

  const handleModuleDelete = (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    
    // If it's a PC being deleted, remove its specs
    if (module?.type === "pc" && gameState.pcSpecs[moduleId]) {
      removePCSpecs(moduleId);
    }
    
    // Remove from pcConfigurations
    setPcConfigurations((prev) => {
      const newConfig = { ...prev };
      delete newConfig[moduleId];
      return newConfig;
    });
    
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    setCables((prev) => prev.filter((c) => c.from !== moduleId && c.to !== moduleId));
    addLog(`${module?.label} dihapus dari canvas`);
  };

  const loadCanvasPreset = (presetIndex: number) => {
    const preset = canvasPresets[presetIndex];
    const newModules = preset.modules.map((m, idx) => ({
      id: m.label.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      type: m.type,
      position: m.position,
      label: m.label,
      configured: 
        (m.type === "pc" && gameState.hardwareInstalled) ||
        (m.type === "monitor" && !!gameState.osInstalled) ||
        (m.type === "router" && gameState.networkConnected),
    }));

    setModules(newModules);

    const newCables = preset.cables.map((c, idx) => ({
      id: `cable-${idx + 1}`,
      from: newModules[c.from].id,
      to: newModules[c.to].id,
      type: c.type,
    }));

    setCables(newCables);
    setModuleCounter({
      pc: newModules.filter((m) => m.type === "pc").length,
      monitor: newModules.filter((m) => m.type === "monitor").length,
      router: newModules.filter((m) => m.type === "router").length,
    });
    addLog(`Preset "${preset.name}" dimuat`);
  };

  const handleReset = () => {
    setModules([]);
    setCables([]);
    setConnectingFrom(null);
    setSelectedModule(null);
    setModuleCounter({ pc: 0, monitor: 0, router: 0 });
    setDeleteMode(false);
    setConfiguringModuleId(null);
    setPcConfigurations({});
    setShowVMSelector(false);
    setActiveVMModuleId(null);
    resetLab();
    addLog("Canvas direset");
  };

  // Calculate progress percentage
  const progress = 
    (gameState.hardwareInstalled ? 33 : 0) + 
    (gameState.osInstalled ? 33 : 0) + 
    (gameState.networkConnected ? 34 : 0);

  return (
    <>
      <div className="relative w-full flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400">Progres Instalasi</span>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-emerald-400 font-bold">{progress}%</span>
              {(modules.length > 0 || progress > 0) && (
                <motion.button
                  onClick={handleReset}
                  className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded text-xs font-mono text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🔄</span> Reset
                </motion.button>
              )}
            </div>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="space-y-2 mb-4">
          {/* Module Palette */}
          <div className="flex gap-2">
            <motion.button
              onClick={() => addModule("pc")}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded hover:border-emerald-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400">PC</span>
              <Plus className="w-3 h-3" />
            </motion.button>

            <motion.button
              onClick={() => addModule("monitor")}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded hover:border-cyan-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MonitorIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">Monitor</span>
              <Plus className="w-3 h-3" />
            </motion.button>

            <motion.button
              onClick={() => addModule("router")}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded hover:border-blue-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Wifi className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono text-blue-400">Router</span>
              <Plus className="w-3 h-3" />
            </motion.button>

            <div className="h-8 w-px bg-zinc-700 mx-2"></div>

            <motion.button
              onClick={() => setDeleteMode(!deleteMode)}
              className={`flex items-center gap-2 px-3 py-2 bg-zinc-800 border rounded transition-all ${
                deleteMode ? "border-red-500 bg-red-950/30" : "border-zinc-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">🗑️</span>
              <span className={`text-xs font-mono ${deleteMode ? "text-red-400" : "text-zinc-400"}`}>
                {deleteMode ? "Hapus AKTIF" : "Hapus"}
              </span>
            </motion.button>

            {gameState.osInstalled && (
              <div className="relative ml-auto">
                <motion.button
                  onClick={() => handleOpenVM()}
                  className="flex items-center gap-2 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded hover:border-purple-500 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MonitorIcon className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-mono text-purple-400">
                    Buka VM {getConfiguredPCs().length > 1 ? `(${getConfiguredPCs().length})` : ""}
                  </span>
                </motion.button>
                
                {/* VM Selector Dropdown */}
                <AnimatePresence>
                  {showVMSelector && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden z-50"
                    >
                      <div className="p-2 border-b border-zinc-700">
                        <p className="text-xs font-mono text-zinc-400">Pilih PC untuk buka VM:</p>
                      </div>
                      {getConfiguredPCs().map((pc) => {
                        const osType = pcConfigurations[pc.id]?.os;
                        return (
                          <motion.button
                            key={pc.id}
                            onClick={() => selectVMAndOpen(pc.id)}
                            className="w-full p-2 flex items-center gap-2 hover:bg-zinc-800 transition-all text-left"
                            whileHover={{ x: 5 }}
                          >
                            <HardDrive className="w-4 h-4 text-emerald-400" />
                            <div className="flex-1">
                              <p className="text-xs font-mono text-zinc-300">{pc.label}</p>
                              <p className={`text-[10px] ${osType === "windows" ? "text-blue-400" : "text-orange-400"}`}>
                                {osType === "windows" ? "🪟 Windows" : `🐧 Linux`}
                              </p>
                            </div>
                          </motion.button>
                        );
                      })}
                      <motion.button
                        onClick={() => setShowVMSelector(false)}
                        className="w-full p-2 text-xs font-mono text-zinc-500 hover:bg-zinc-800 transition-all border-t border-zinc-700"
                      >
                        Batal
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Canvas Presets */}
          <div className="flex gap-2 items-center">
            <span className="text-xs font-mono text-zinc-500">Preset:</span>
            {canvasPresets.map((preset, idx) => (
              <motion.button
                key={idx}
                onClick={() => loadCanvasPreset(idx)}
                className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded hover:border-cyan-500 transition-all text-xs font-mono text-zinc-400 hover:text-cyan-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {preset.name}
              </motion.button>
            ))}
            <div className="ml-auto text-xs font-mono text-zinc-500">
              💡 {deleteMode ? "Klik modul untuk hapus" : "Klik kanan untuk hubungkan"}
            </div>
          </div>
        </div>

        {/* Draggable Canvas */}
        <div className="flex-1 overflow-hidden">
          <DraggableCanvas
            modules={modules}
            cables={cables}
            onModuleMove={handleModuleMove}
            onModuleClick={handleModuleClick}
            onCableStart={handleCableStart}
            onCableEnd={handleCableEnd}
            onModuleDelete={handleModuleDelete}
            connectingFrom={connectingFrom}
            selectedModule={selectedModule}
            deleteMode={deleteMode}
          />
        </div>

        {/* Completion Badge */}
        <AnimatePresence>
          {gameState.currentPhase === "complete" && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="bg-zinc-900 border-2 border-emerald-500/50 rounded-full px-6 py-3 shadow-lg shadow-emerald-500/20">
                <p className="text-emerald-400 font-bold font-mono flex items-center gap-2">
                  <span className="text-2xl">🎉</span>
                  <span>Lab Virtual Selesai Dikonfigurasi!</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {gameState.currentPhase === "hardware" && (
          <HardwareModal
            onClose={closeModal}
            onComplete={handleCompleteHardware}
            addLog={addLog}
          />
        )}

        {gameState.currentPhase === "os" && (
          <OSModal onClose={closeModal} onComplete={handleCompleteOS} addLog={addLog} />
        )}

        {gameState.currentPhase === "network" && (
          <NetworkModal
            onClose={closeModal}
            onComplete={handleCompleteNetwork}
            addLog={addLog}
          />
        )}
      </AnimatePresence>

      {/* Virtual Machines */}
      <AnimatePresence>
        {gameState.vmMode && getActiveVMOS() === "windows" && (
          <WindowsVM
            onClose={toggleVM}
            networkConnected={gameState.networkConnected}
            onOpenBrowser={toggleBrowser}
            browserOpen={gameState.browserOpen}
            ipAddress={gameState.ipAddress}
            edition={getActiveOSEdition()}
            hardware={getActivePCHardware()}
            performanceMetrics={getActivePCSpecs()?.performanceMetrics}
          />
        )}

        {gameState.vmMode && getActiveVMOS() === "linux" && (
          <LinuxVM
            onClose={toggleVM}
            networkConnected={gameState.networkConnected}
            onOpenBrowser={toggleBrowser}
            browserOpen={gameState.browserOpen}
            ipAddress={gameState.ipAddress}
            performanceMetrics={getActivePCSpecs()?.performanceMetrics || gameState.performanceMetrics}
            distro={getActiveOSEdition()}
            hardware={getActivePCHardware()}
          />
        )}
      </AnimatePresence>
    </>
  );
}
