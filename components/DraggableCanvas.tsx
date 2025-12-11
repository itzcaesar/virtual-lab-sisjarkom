"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Monitor, HardDrive, Wifi, Cable, Zap, CheckCircle2, Settings } from "lucide-react";

export interface CanvasModule {
  id: string;
  type: "pc" | "monitor" | "router";
  position: { x: number; y: number };
  label: string;
  configured?: boolean;
}

export interface CableConnection {
  id: string;
  from: string;
  to: string;
  type: "power" | "ethernet";
}

interface DraggableCanvasProps {
  modules: CanvasModule[];
  cables: CableConnection[];
  onModuleMove: (id: string, position: { x: number; y: number }) => void;
  onModuleClick: (module: CanvasModule) => void;
  onCableStart: (moduleId: string) => void;
  onCableEnd: (moduleId: string) => void;
  onModuleDelete?: (moduleId: string) => void;
  connectingFrom: string | null;
  selectedModule: string | null;
  deleteMode?: boolean;
}

export default function DraggableCanvas({
  modules,
  cables,
  onModuleMove,
  onModuleClick,
  onCableStart,
  onCableEnd,
  onModuleDelete,
  connectingFrom,
  selectedModule,
  deleteMode = false,
}: DraggableCanvasProps) {
  const [draggingModule, setDraggingModule] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleModuleMouseDown = (e: React.MouseEvent, module: CanvasModule) => {
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - module.position.x - panOffset.x,
      y: e.clientY - rect.top - module.position.y - panOffset.y,
    });
    setDraggingModule(module.id);
  };

  // Track if space is held for pan mode
  const [spaceHeld, setSpaceHeld] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !spaceHeld) {
        e.preventDefault();
        setSpaceHeld(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        setSpaceHeld(false);
        setIsPanning(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [spaceHeld]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Middle mouse button always pans
    if (e.button === 1) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }
    
    // Space + Left click for panning
    if (spaceHeld && e.button === 0) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (!draggingModule) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x - panOffset.x;
    const y = e.clientY - rect.top - dragOffset.y - panOffset.y;

    onModuleMove(draggingModule, { x, y });
  };

  const handleMouseUp = () => {
    setDraggingModule(null);
    setIsPanning(false);
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "pc":
        return HardDrive;
      case "monitor":
        return Monitor;
      case "router":
        return Wifi;
      default:
        return HardDrive;
    }
  };

  const getModuleColor = (type: string) => {
    switch (type) {
      case "pc":
        return "border-emerald-500 bg-emerald-950/50";
      case "monitor":
        return "border-cyan-500 bg-cyan-950/50";
      case "router":
        return "border-blue-500 bg-blue-950/50";
      default:
        return "border-cyan-500/30 bg-blue-950/30";
    }
  };

  const getModuleGlow = (type: string) => {
    switch (type) {
      case "pc":
        return "shadow-emerald-500/30";
      case "monitor":
        return "shadow-cyan-500/30";
      case "router":
        return "shadow-blue-500/30";
      default:
        return "";
    }
  };

  const getCableColor = (type: string) => {
    return type === "power" ? "#3b82f6" : "#10b981";
  };

  const resetPan = () => {
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      ref={canvasRef}
      className={`relative w-full h-full bg-[#0a1628]/30 rounded-lg overflow-hidden ${
        isPanning ? "cursor-grabbing" : spaceHeld ? "cursor-grab" : "cursor-default"
      }`}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      tabIndex={0}
    >
      {/* Animated Grid Background */}
      <div
        className="absolute inset-0 opacity-30 canvas-bg pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(34, 211, 238, 0.3) 1px, transparent 0)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: `${panOffset.x % 40}px ${panOffset.y % 40}px`,
          transition: isPanning ? "none" : "background-position 0.1s",
        }}
      />

      {/* Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a1628]/80 pointer-events-none" />

      {/* Pan Instructions */}
      <div className="absolute top-2 right-2 card rounded px-2 py-1 text-[10px] font-mono text-cyan-500 z-10 pointer-events-none">
        {spaceHeld ? "🖱️ Seret untuk geser" : "Tahan SPASI + seret untuk geser"}
      </div>

      {/* Pan Reset Button */}
      {(panOffset.x !== 0 || panOffset.y !== 0) && (
        <button
          onClick={resetPan}
          className="absolute top-2 left-2 px-2 py-1 card rounded text-xs font-mono text-cyan-400 hover:text-white z-10"
        >
          Reset Tampilan
        </button>
      )}

      {/* Canvas Content Container */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
      >
        {/* Cable Connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: "visible" }}>
          {/* Animated Cable Glow Filter */}
          <defs>
            <filter id="glow-power" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-ethernet" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {cables.map((cable) => {
            const fromModule = modules.find((m) => m.id === cable.from);
            const toModule = modules.find((m) => m.id === cable.to);
            if (!fromModule || !toModule) return null;

            const midX = (fromModule.position.x + toModule.position.x) / 2;
            const midY = (fromModule.position.y + toModule.position.y) / 2;

            return (
              <g key={cable.id}>
                {/* Cable shadow */}
                <motion.line
                  x1={fromModule.position.x}
                  y1={fromModule.position.y}
                  x2={toModule.position.x}
                  y2={toModule.position.y}
                  stroke={getCableColor(cable.type)}
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity="0.3"
                  filter={`url(#glow-${cable.type})`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Main cable */}
                <motion.line
                  x1={fromModule.position.x}
                  y1={fromModule.position.y}
                  x2={toModule.position.x}
                  y2={toModule.position.y}
                  stroke={getCableColor(cable.type)}
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />

                {/* Data packet animation for ethernet */}
                {cable.type === "ethernet" && (
                  <motion.circle
                    r="4"
                    fill="#10b981"
                    initial={{
                      cx: fromModule.position.x,
                      cy: fromModule.position.y,
                    }}
                    animate={{
                      cx: [fromModule.position.x, toModule.position.x],
                      cy: [fromModule.position.y, toModule.position.y],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    opacity={0.8}
                  />
                )}

                {/* Connection point highlight */}
                <circle
                  cx={fromModule.position.x}
                  cy={fromModule.position.y}
                  r="6"
                  fill={getCableColor(cable.type)}
                  opacity="0.5"
                />
                <circle
                  cx={toModule.position.x}
                  cy={toModule.position.y}
                  r="6"
                  fill={getCableColor(cable.type)}
                  opacity="0.5"
                />
              </g>
            );
          })}

          {/* Temporary cable while connecting */}
          {connectingFrom && (
            <motion.line
              x1={modules.find((m) => m.id === connectingFrom)?.position.x}
              y1={modules.find((m) => m.id === connectingFrom)?.position.y}
              x2={modules.find((m) => m.id === connectingFrom)?.position.x}
              y2={modules.find((m) => m.id === connectingFrom)?.position.y}
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="4 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </svg>

        {/* Modules */}
        <AnimatePresence>
          {modules.map((module) => {
            const Icon = getModuleIcon(module.type);
            const isSelected = selectedModule === module.id;
            const isConnecting = connectingFrom === module.id;

            return (
              <motion.div
                key={module.id}
                className={`absolute ${deleteMode ? "cursor-pointer" : "cursor-move"} select-none z-10 group`}
                style={{
                  left: module.position.x,
                  top: module.position.y,
                  transform: "translate(-50%, -50%)",
                  boxShadow: getModuleGlow(module.type),
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isSelected || isConnecting ? 1.1 : 1,
                  opacity: 1,
                }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div
                  className={`card rounded-lg p-4 border-2 transition-all ${
                    deleteMode ? "border-red-500 hover:bg-red-950/50" : getModuleColor(module.type)
                  } ${
                    isSelected
                      ? "ring-4 ring-yellow-400/50"
                      : isConnecting
                      ? "ring-4 ring-orange-400/50 animate-pulse"
                      : ""
                  }`}
                  onMouseDown={(e) => !deleteMode && handleModuleMouseDown(e, module)}
                  onClick={() => {
                    if (deleteMode && onModuleDelete) {
                      onModuleDelete(module.id);
                    } else {
                      onModuleClick(module);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (connectingFrom) {
                      onCableEnd(module.id);
                    } else {
                      onCableStart(module.id);
                    }
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-xs font-mono text-white whitespace-nowrap">
                      {module.label}
                    </p>
                  </div>

                  {/* Configured Checkmark - shows when module is configured */}
                  {module.configured && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-0.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  {/* Settings icon on hover when configured - indicates reconfigurable */}
                  {module.configured && (
                    <motion.div
                      className="absolute -bottom-1 -right-1 bg-cyan-700 rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Settings className="w-3 h-3 text-cyan-300" />
                    </motion.div>
                  )}

                  {/* Status indicator dot */}
                  {!module.configured && (
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Connection Points */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <motion.button
                    className="w-3 h-3 bg-yellow-400 rounded-full border-2 border-[#0a1628]"
                    whileHover={{ scale: 1.5 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (connectingFrom) {
                        onCableEnd(module.id);
                      } else {
                        onCableStart(module.id);
                      }
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      {modules.length === 0 && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center text-cyan-500 font-mono text-sm">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Cable className="w-12 h-12 mx-auto mb-4 opacity-50" />
            </motion.div>
            <p>Drag modules dari topbar untuk memulai</p>
            <p className="text-xs mt-2 text-cyan-600">Klik pada dot untuk menghubungkan kabel</p>
            <p className="text-xs mt-1 text-cyan-600">Drag canvas kosong dan tahan SPACE untuk pan</p>
          </div>
        </motion.div>
      )}

      {connectingFrom && (
        <motion.div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 card rounded-lg px-4 py-2 border border-yellow-500/50"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-yellow-400 text-xs font-mono animate-pulse">
            🔌 Klik modul tujuan untuk menghubungkan kabel
          </p>
        </motion.div>
      )}

      {/* Canvas Info */}
      <div className="absolute bottom-2 right-2 text-xs font-mono text-cyan-300/70 card px-2 py-1 rounded">
        {modules.length} modul • {cables.length} kabel
      </div>
    </div>
  );
}
