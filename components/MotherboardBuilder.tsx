"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Cpu, MemoryStick, HardDrive, Monitor as MonitorIcon, Info, CheckCircle2 } from "lucide-react";

interface ComponentItem {
  id: string;
  type: "cpu" | "ram" | "storage" | "gpu";
  name: string;
  specs: string;
  price: string;
}

interface Socket {
  id: string;
  type: "cpu" | "ram" | "storage" | "gpu";
  label: string;
  position: { top: string; left: string };
  size: { width: number; height: number };
  installed: boolean;
}

interface MotherboardBuilderProps {
  selectedCPU: string;
  selectedRAM: string;
  selectedStorage: string;
  selectedGPU: string;
  onComplete: (success: boolean) => void;
  onComponentInstalled: (type: string, name: string) => void;
}

export default function MotherboardBuilder({
  selectedCPU,
  selectedRAM,
  selectedStorage,
  selectedGPU,
  onComplete,
  onComponentInstalled,
}: MotherboardBuilderProps) {
  // Preset configurations
  const presetConfigs = [
    {
      name: "Budget Build",
      desc: "Entry-level performance",
      price: "$",
      cpu: "Intel Core i5-12400 - 6 Cores @ 2.5GHz",
      ram: "8GB DDR4 - 2666MHz",
      storage: "256GB NVMe SSD - 3000MB/s",
      gpu: "Integrated Graphics - Shared Memory",
      color: "zinc"
    },
    {
      name: "Mid-Range Build",
      desc: "Balanced performance",
      price: "$$",
      cpu: "Intel Core i7-12700K - 12 Cores @ 3.6GHz",
      ram: "16GB DDR4 - 3200MHz",
      storage: "512GB NVMe SSD - 3500MB/s",
      gpu: "NVIDIA GTX 1660 Super - 6GB GDDR6",
      color: "blue"
    },
    {
      name: "High-End Build",
      desc: "Maximum performance",
      price: "$$$",
      cpu: "Intel Core i9-13900K - 24 Cores @ 3.0GHz",
      ram: "32GB DDR4 - 3600MHz",
      storage: "1TB NVMe SSD - 7000MB/s",
      gpu: "NVIDIA RTX 4070 - 12GB GDDR6X",
      color: "purple"
    },
  ];

  // All available components by category
  const allCPUOptions = [
    { name: "Intel Core i5-12400", cores: "6 Cores", speed: "2.5GHz", price: "$" },
    { name: "Intel Core i7-12700K", cores: "12 Cores", speed: "3.6GHz", price: "$$" },
    { name: "AMD Ryzen 7 5800X", cores: "8 Cores", speed: "3.8GHz", price: "$$" },
    { name: "Intel Core i9-13900K", cores: "24 Cores", speed: "3.0GHz", price: "$$$" },
  ];
  
  const allRAMOptions = [
    { name: "8GB DDR4", speed: "2666MHz", price: "$" },
    { name: "16GB DDR4", speed: "3200MHz", price: "$$" },
    { name: "32GB DDR4", speed: "3600MHz", price: "$$$" },
    { name: "16GB DDR5", speed: "4800MHz", price: "$$$" },
  ];
  
  const allStorageOptions = [
    { name: "256GB NVMe SSD", type: "NVMe", speed: "3000MB/s", price: "$" },
    { name: "512GB NVMe SSD", type: "NVMe", speed: "3500MB/s", price: "$$" },
    { name: "1TB NVMe SSD", type: "NVMe", speed: "7000MB/s", price: "$$$" },
    { name: "2TB SATA SSD", type: "SATA", speed: "550MB/s", price: "$$" },
  ];
  
  const allGPUOptions = [
    { name: "Integrated Graphics", memory: "Shared", price: "$" },
    { name: "NVIDIA GTX 1660 Super", memory: "6GB GDDR6", price: "$$" },
    { name: "NVIDIA RTX 3060", memory: "12GB GDDR6", price: "$$" },
    { name: "NVIDIA RTX 4070", memory: "12GB GDDR6X", price: "$$$" },
  ];

  const components: ComponentItem[] = [
    { id: "cpu", type: "cpu", name: selectedCPU.split(" - ")[0], specs: selectedCPU, price: "$" },
    { id: "ram", type: "ram", name: selectedRAM.split(" - ")[0], specs: selectedRAM, price: "$" },
    { id: "storage", type: "storage", name: selectedStorage.split(" - ")[0], specs: selectedStorage, price: "$" },
    { id: "gpu", type: "gpu", name: selectedGPU.split(" - ")[0], specs: selectedGPU, price: "$" },
  ];

  const loadPreset = (preset: typeof presetConfigs[0]) => {
    // Auto-install all components from preset
    const presetComponents = {
      cpu: { id: "cpu", type: "cpu" as const, name: preset.cpu.split(" - ")[0], specs: preset.cpu, price: "$" },
      ram: { id: "ram", type: "ram" as const, name: preset.ram.split(" - ")[0], specs: preset.ram, price: "$" },
      storage: { id: "storage", type: "storage" as const, name: preset.storage.split(" - ")[0], specs: preset.storage, price: "$" },
      gpu: { id: "gpu", type: "gpu" as const, name: preset.gpu.split(" - ")[0], specs: preset.gpu, price: "$" },
    };

    const updatedSockets = sockets.map((socket) => ({ ...socket, installed: true }));
    setSockets(updatedSockets);

    // Map components to sockets
    const newSocketContents: Record<string, ComponentItem> = {
      "cpu-socket": presetComponents.cpu,
      "ram-slot-1": presetComponents.ram,
      "ram-slot-2": presetComponents.ram,
      "pcie-slot": presetComponents.gpu,
      "sata-port": presetComponents.storage,
    };
    setSocketContents(newSocketContents);

    Object.values(presetComponents).forEach((comp) => {
      const uniqueId = `${comp.type}-preset-${Date.now()}`;
      setInstalledComponents((prev) => new Set(prev).add(uniqueId));
      onComponentInstalled(comp.type, comp.name);
    });

    setTimeout(() => onComplete(true), 500);
  };

  const [sockets, setSockets] = useState<Socket[]>([
    { id: "cpu-socket", type: "cpu", label: "CPU Socket (LGA 1700)", position: { top: "25%", left: "35%" }, size: { width: 100, height: 100 }, installed: false },
    { id: "ram-slot-1", type: "ram", label: "RAM Slot 1", position: { top: "20%", left: "65%" }, size: { width: 80, height: 120 }, installed: false },
    { id: "ram-slot-2", type: "ram", label: "RAM Slot 2", position: { top: "20%", left: "72%" }, size: { width: 80, height: 120 }, installed: false },
    { id: "pcie-slot", type: "gpu", label: "PCIe x16 Slot", position: { top: "60%", left: "40%" }, size: { width: 200, height: 80 }, installed: false },
    { id: "sata-port", type: "storage", label: "SATA Port", position: { top: "70%", left: "70%" }, size: { width: 60, height: 60 }, installed: false },
  ]);

  const [draggedComponent, setDraggedComponent] = useState<ComponentItem | null>(null);
  const [installedComponents, setInstalledComponents] = useState<Set<string>>(new Set());
  
  // Track which component is installed in which socket
  const [socketContents, setSocketContents] = useState<Record<string, ComponentItem | null>>({});

  const handleDragStart = (component: ComponentItem) => {
    setDraggedComponent(component);
  };

  const handleDragOver = (e: React.DragEvent, socket: Socket) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, socket: Socket) => {
    e.preventDefault();
    
    if (!draggedComponent) return;
    
    // Check if component type matches socket type
    if (draggedComponent.type !== socket.type) {
      return; // Invalid placement
    }

    // Check if socket is already occupied
    if (socket.installed) {
      return;
    }

    // Install component (create new unique ID for unlimited components)
    const uniqueId = `${draggedComponent.id}-${Date.now()}`;
    
    setSockets(sockets.map(s => 
      s.id === socket.id ? { ...s, installed: true } : s
    ));
    
    // Store which component is in which socket
    setSocketContents(prev => ({
      ...prev,
      [socket.id]: draggedComponent
    }));
    
    setInstalledComponents(prev => new Set(prev).add(uniqueId));
    onComponentInstalled(draggedComponent.type, draggedComponent.name);
    setDraggedComponent(null);

    // Check if all required sockets are filled
    const allSocketsFilled = sockets.every(s => s.id === socket.id || s.installed);
    if (allSocketsFilled) {
      setTimeout(() => {
        onComplete(true);
      }, 500);
    }
  };

  const getSocketColor = (socket: Socket) => {
    if (socket.installed) return "border-emerald-500 bg-emerald-950/30";
    if (draggedComponent && draggedComponent.type === socket.type) return "border-cyan-400 bg-cyan-950/30 animate-pulse";
    return "border-zinc-700 bg-zinc-900/50";
  };

  const getComponentColor = (type: string) => {
    switch (type) {
      case "cpu": return "border-emerald-500 bg-emerald-950/20";
      case "ram": return "border-cyan-500 bg-cyan-950/20";
      case "storage": return "border-blue-500 bg-blue-950/20";
      case "gpu": return "border-purple-500 bg-purple-950/20";
      default: return "border-zinc-700";
    }
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case "cpu": return Cpu;
      case "ram": return MemoryStick;
      case "storage": return HardDrive;
      case "gpu": return MonitorIcon;
      default: return Cpu;
    }
  };

  return (
    <div className="space-y-4">
      {/* Preset Configurations */}
      <div className="glass rounded-lg p-3">
        <h4 className="text-xs font-semibold text-cyan-400 mb-2">Quick Presets</h4>
        <div className="grid grid-cols-3 gap-2">
          {presetConfigs.map((preset, idx) => (
            <motion.button
              key={idx}
              onClick={() => loadPreset(preset)}
              className={`glass rounded-lg p-2 text-left border border-${preset.color}-500/30 hover:border-${preset.color}-500 transition-all`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-1">
                <h5 className="font-bold text-white text-xs">{preset.name}</h5>
                <span className={`text-${preset.color}-400 text-[10px]`}>{preset.price}</span>
              </div>
              <p className="text-[10px] text-zinc-400">{preset.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Info Panel */}
      <div className="glass rounded-lg p-3 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300">
          <p className="font-semibold mb-1">Cara Merakit:</p>
          <p className="text-zinc-400">Pilih preset ATAU drag komponen ke socket yang sesuai</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Component Inventory */}
        <div className="col-span-4 space-y-3 max-h-[350px] overflow-y-auto pr-2">
          <h4 className="text-xs font-semibold text-zinc-300 flex items-center gap-2 sticky top-0 bg-zinc-900 pb-2 z-10">
            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
            Komponen yang Dipilih
          </h4>
          
          {/* Selected Components to Install - Unlimited Usage */}
          <div className="space-y-3">
            {components.map((component) => {
              const Icon = getComponentIcon(component.type);
              
              return (
                <motion.div
                  key={component.id}
                  draggable={true}
                  onDragStart={() => handleDragStart(component)}
                  className={`glass rounded-lg p-3 border-2 transition-all cursor-grab active:cursor-grabbing hover:scale-105 ${getComponentColor(component.type)}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-zinc-300">
                        {component.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">
                        {component.specs.split(" - ")[1] || component.specs}
                      </p>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      ∞
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* All Available Components by Category */}
          <div className="border-t border-zinc-700 pt-4 mt-4">
            <h5 className="text-xs font-semibold text-zinc-400 mb-3 flex items-center gap-2">
              <span>📦</span> Katalog Komponen
              <span className="text-[10px] text-zinc-600">(drag ke socket)</span>
            </h5>
            
            {/* CPU Category */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-semibold text-emerald-400">Processor (CPU)</p>
              </div>
              <div className="space-y-1.5">
                {allCPUOptions.map((cpu, idx) => (
                  <motion.div 
                    key={idx} 
                    draggable={true}
                    onDragStart={() => handleDragStart({
                      id: `cpu-catalog-${idx}`,
                      type: "cpu",
                      name: cpu.name,
                      specs: `${cpu.name} - ${cpu.cores} @ ${cpu.speed}`,
                      price: cpu.price
                    })}
                    className={`text-xs p-2 rounded bg-zinc-800/50 border border-zinc-700 cursor-grab active:cursor-grabbing hover:border-emerald-500/50 transition-all ${
                      selectedCPU.includes(cpu.name) ? "border-emerald-500/50 bg-emerald-950/20" : ""
                    }`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-zinc-300 font-mono">{cpu.name}</p>
                        <p className="text-zinc-500 text-[10px]">{cpu.cores} @ {cpu.speed}</p>
                      </div>
                      <span className="text-emerald-400">{cpu.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* RAM Category */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MemoryStick className="w-4 h-4 text-cyan-400" />
                <p className="text-xs font-semibold text-cyan-400">Memory (RAM)</p>
              </div>
              <div className="space-y-1.5">
                {allRAMOptions.map((ram, idx) => (
                  <motion.div 
                    key={idx} 
                    draggable={true}
                    onDragStart={() => handleDragStart({
                      id: `ram-catalog-${idx}`,
                      type: "ram",
                      name: ram.name,
                      specs: `${ram.name} - ${ram.speed}`,
                      price: ram.price
                    })}
                    className={`text-xs p-2 rounded bg-zinc-800/50 border border-zinc-700 cursor-grab active:cursor-grabbing hover:border-cyan-500/50 transition-all ${
                      selectedRAM.includes(ram.name) ? "border-cyan-500/50 bg-cyan-950/20" : ""
                    }`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-zinc-300 font-mono">{ram.name}</p>
                        <p className="text-zinc-500 text-[10px]">{ram.speed}</p>
                      </div>
                      <span className="text-cyan-400">{ram.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Storage Category */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <HardDrive className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-semibold text-blue-400">Storage</p>
              </div>
              <div className="space-y-1.5">
                {allStorageOptions.map((storage, idx) => (
                  <motion.div 
                    key={idx} 
                    draggable={true}
                    onDragStart={() => handleDragStart({
                      id: `storage-catalog-${idx}`,
                      type: "storage",
                      name: storage.name,
                      specs: `${storage.name} - ${storage.type} ${storage.speed}`,
                      price: storage.price
                    })}
                    className={`text-xs p-2 rounded bg-zinc-800/50 border border-zinc-700 cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all ${
                      selectedStorage.includes(storage.name) ? "border-blue-500/50 bg-blue-950/20" : ""
                    }`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-zinc-300 font-mono">{storage.name}</p>
                        <p className="text-zinc-500 text-[10px]">{storage.type} - {storage.speed}</p>
                      </div>
                      <span className="text-blue-400">{storage.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* GPU Category */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MonitorIcon className="w-4 h-4 text-purple-400" />
                <p className="text-xs font-semibold text-purple-400">Graphics Card (GPU)</p>
              </div>
              <div className="space-y-1.5">
                {allGPUOptions.map((gpu, idx) => (
                  <motion.div 
                    key={idx} 
                    draggable={true}
                    onDragStart={() => handleDragStart({
                      id: `gpu-catalog-${idx}`,
                      type: "gpu",
                      name: gpu.name,
                      specs: `${gpu.name} - ${gpu.memory}`,
                      price: gpu.price
                    })}
                    className={`text-xs p-2 rounded bg-zinc-800/50 border border-zinc-700 cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-all ${
                      selectedGPU.includes(gpu.name) ? "border-purple-500/50 bg-purple-950/20" : ""
                    }`}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-zinc-300 font-mono">{gpu.name}</p>
                        <p className="text-zinc-500 text-[10px]">{gpu.memory}</p>
                      </div>
                      <span className="text-purple-400">{gpu.price}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Motherboard */}
        <div className="col-span-8 space-y-4">
          {/* Installed Components Summary */}
          {Object.keys(socketContents).length > 0 && (
            <motion.div 
              className="glass rounded-lg p-3 border border-emerald-500/30"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h5 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Komponen Terpasang
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Object.entries(socketContents).map(([socketId, component]) => {
                  if (!component) return null;
                  const Icon = getComponentIcon(component.type);
                  return (
                    <div key={socketId} className="flex items-center gap-2 bg-zinc-800/50 rounded p-2">
                      <Icon className="w-4 h-4 text-zinc-400" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-zinc-300 font-mono truncate">{component.name}</p>
                        <p className="text-[8px] text-zinc-500">{socketId.replace("-", " ").replace("slot", "")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <div className="relative w-full h-[320px] bg-gradient-to-br from-emerald-950/30 to-cyan-950/30 border-2 border-zinc-700 rounded-lg overflow-hidden">
            {/* Motherboard Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '50px 50px',
              }}></div>
            </div>

            {/* Circuit traces */}
            <svg className="absolute inset-0 w-full h-full opacity-30" style={{ filter: 'blur(1px)' }}>
              <line x1="35%" y1="30%" x2="65%" y2="25%" stroke="#10b981" strokeWidth="2" />
              <line x1="40%" y1="35%" x2="40%" y2="65%" stroke="#06b6d4" strokeWidth="2" />
              <line x1="45%" y1="35%" x2="70%" y2="35%" stroke="#3b82f6" strokeWidth="2" />
              <line x1="45%" y1="65%" x2="70%" y2="73%" stroke="#a855f7" strokeWidth="2" />
            </svg>

            {/* Sockets */}
            {sockets.map((socket) => {
              // Get installed component from socketContents
              const installedComponent = socketContents[socket.id] || null;
              const Icon = getComponentIcon(socket.type);
              
              return (
                <motion.div
                  key={socket.id}
                  onDragOver={(e) => handleDragOver(e, socket)}
                  onDrop={(e) => handleDrop(e, socket)}
                  className={`absolute border-2 rounded-lg transition-all ${
                    socket.installed 
                      ? "border-solid border-emerald-500 bg-emerald-950/40" 
                      : draggedComponent && draggedComponent.type === socket.type 
                        ? "border-dashed border-cyan-400 bg-cyan-950/30 animate-pulse" 
                        : "border-dashed border-zinc-700 bg-zinc-900/50"
                  }`}
                  style={{
                    top: socket.position.top,
                    left: socket.position.left,
                    width: `${socket.size.width}px`,
                    height: `${socket.size.height}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    boxShadow: socket.installed 
                      ? "0 0 20px rgba(16, 185, 129, 0.3)" 
                      : "none"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-1">
                    {installedComponent ? (
                      <motion.div 
                        className="text-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="relative">
                          <Icon className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
                          <motion.div 
                            className="absolute -top-1 -right-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          </motion.div>
                        </div>
                        <p className="text-[8px] font-mono text-emerald-400 leading-tight max-w-[90%] mx-auto truncate">
                          {installedComponent.name.split(" ").slice(0, 3).join(" ")}
                        </p>
                        <p className="text-[7px] font-mono text-zinc-500 mt-0.5">
                          {installedComponent.specs.split(" - ")[1]?.split(" ")[0] || ""}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="text-center p-1">
                        <Icon className="w-5 h-5 text-zinc-600 mx-auto mb-1 opacity-50" />
                        <p className="text-[9px] font-mono text-zinc-500 leading-tight">
                          {socket.label.split(" ")[0]}
                        </p>
                        <p className="text-[8px] font-mono text-zinc-600 mt-0.5">
                          Drop {socket.type.toUpperCase()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover glow effect */}
                  {!socket.installed && draggedComponent?.type === socket.type && (
                    <motion.div 
                      className="absolute inset-0 rounded-lg"
                      animate={{ 
                        boxShadow: ["0 0 10px rgba(6, 182, 212, 0.3)", "0 0 20px rgba(6, 182, 212, 0.5)", "0 0 10px rgba(6, 182, 212, 0.3)"]
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>
              );
            })}

            {/* Motherboard Label */}
            <div className="absolute bottom-4 right-4 text-right">
              <p className="text-xs font-mono text-zinc-600">ATX Motherboard</p>
              <p className="text-xs font-mono text-zinc-700">Model: VL-MB-2024</p>
            </div>

            {/* Progress Indicator */}
            <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2">
              <p className="text-xs text-zinc-400 font-mono">
                Progress: {installedComponents.size}/{components.length}
              </p>
            </div>
          </div>
          
          <p className="text-xs text-center text-zinc-500 mt-3 font-mono">
            💡 Tip: Pastikan komponen dipasang di socket yang benar!
          </p>
        </div>
      </div>
    </div>
  );
}
