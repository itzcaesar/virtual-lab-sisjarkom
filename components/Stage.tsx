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
  completeHardware: () => void;
  completeOS: (os: OSType) => void;
  completeNetwork: () => void;
  toggleVM: () => void;
  toggleBrowser: () => void;
  resetLab: () => void;
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
}: StageProps) {
  const [modules, setModules] = useState<CanvasModule[]>([]);
  const [cables, setCables] = useState<CableConnection[]>([]);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [moduleCounter, setModuleCounter] = useState({ pc: 0, monitor: 0, router: 0 });
  const [deleteMode, setDeleteMode] = useState(false);

  // Canvas presets
  const canvasPresets = [
    {
      name: "Simple Network",
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
      name: "Multi-PC Lab",
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
      name: "Server Room",
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

    const newModule: CanvasModule = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 150 + modules.length * 50, y: 200 + modules.length * 30 },
      label: `${type.toUpperCase()}-${newCounter[type]}`,
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
    
    // Open configuration based on module type
    if (module.type === "pc" && !gameState.hardwareInstalled) {
      openPhase("hardware");
      addLog(`Mengkonfigurasi ${module.label}...`);
    } else if (module.type === "monitor" && gameState.hardwareInstalled && !gameState.osInstalled) {
      openPhase("os");
      addLog(`Menginstal OS pada ${module.label}...`);
    } else if (module.type === "router" && gameState.osInstalled && !gameState.networkConnected) {
      openPhase("network");
      addLog(`Mengkonfigurasi ${module.label}...`);
    }
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
      id: `cable-${Date.now()}`,
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
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
    setCables((prev) => prev.filter((c) => c.from !== moduleId && c.to !== moduleId));
    addLog(`Module ${module?.label} dihapus dari canvas`);
  };

  const loadCanvasPreset = (presetIndex: number) => {
    const preset = canvasPresets[presetIndex];
    const newModules = preset.modules.map((m, idx) => ({
      id: `${m.type}-preset-${Date.now()}-${idx}`,
      type: m.type,
      position: m.position,
      label: m.label,
    }));

    setModules(newModules);

    const newCables = preset.cables.map((c, idx) => ({
      id: `cable-preset-${Date.now()}-${idx}`,
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
      <div className="relative w-full h-[600px] glass rounded-2xl p-4 flex flex-col">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400">Progress Instalasi</span>
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-emerald-400 font-bold">{progress}%</span>
              {(modules.length > 0 || progress > 0) && (
                <motion.button
                  onClick={handleReset}
                  className="px-3 py-1 glass rounded text-xs font-mono text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all flex items-center gap-1"
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
              className="flex items-center gap-2 px-3 py-2 glass rounded border border-emerald-500/30 hover:border-emerald-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-emerald-400">PC</span>
              <Plus className="w-3 h-3" />
            </motion.button>

            <motion.button
              onClick={() => addModule("monitor")}
              className="flex items-center gap-2 px-3 py-2 glass rounded border border-cyan-500/30 hover:border-cyan-500 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MonitorIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400">Monitor</span>
              <Plus className="w-3 h-3" />
            </motion.button>

            <motion.button
              onClick={() => addModule("router")}
              className="flex items-center gap-2 px-3 py-2 glass rounded border border-blue-500/30 hover:border-blue-500 transition-all"
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
              className={`flex items-center gap-2 px-3 py-2 glass rounded border transition-all ${
                deleteMode ? "border-red-500 bg-red-950/30" : "border-zinc-700"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-lg">🗑️</span>
              <span className={`text-xs font-mono ${deleteMode ? "text-red-400" : "text-zinc-400"}`}>
                {deleteMode ? "Delete ON" : "Delete"}
              </span>
            </motion.button>

            {gameState.osInstalled && (
              <motion.button
                onClick={toggleVM}
                className="flex items-center gap-2 px-3 py-2 glass rounded border border-purple-500/30 hover:border-purple-500 transition-all ml-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MonitorIcon className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono text-purple-400">Open VM</span>
              </motion.button>
            )}
          </div>

          {/* Canvas Presets */}
          <div className="flex gap-2 items-center">
            <span className="text-xs font-mono text-zinc-500">Presets:</span>
            {canvasPresets.map((preset, idx) => (
              <motion.button
                key={idx}
                onClick={() => loadCanvasPreset(idx)}
                className="px-3 py-1 glass rounded border border-zinc-700 hover:border-cyan-500 transition-all text-xs font-mono text-zinc-400 hover:text-cyan-400"
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
              <div className="glass rounded-full px-6 py-3 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/20">
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
            onComplete={completeHardware}
            addLog={addLog}
          />
        )}

        {gameState.currentPhase === "os" && (
          <OSModal onClose={closeModal} onComplete={completeOS} addLog={addLog} />
        )}

        {gameState.currentPhase === "network" && (
          <NetworkModal
            onClose={closeModal}
            onComplete={completeNetwork}
            addLog={addLog}
          />
        )}
      </AnimatePresence>

      {/* Virtual Machines */}
      <AnimatePresence>
        {gameState.vmMode && gameState.osInstalled === "windows" && (
          <WindowsVM
            onClose={toggleVM}
            networkConnected={gameState.networkConnected}
            onOpenBrowser={toggleBrowser}
            browserOpen={gameState.browserOpen}
            ipAddress={gameState.ipAddress}
          />
        )}

        {gameState.vmMode && gameState.osInstalled === "linux" && (
          <LinuxVM
            onClose={toggleVM}
            networkConnected={gameState.networkConnected}
            onOpenBrowser={toggleBrowser}
            browserOpen={gameState.browserOpen}
            ipAddress={gameState.ipAddress}
            performanceMetrics={gameState.performanceMetrics}
            distro={gameState.linuxDistro || "Ubuntu"}
          />
        )}
      </AnimatePresence>
    </>
  );
}
