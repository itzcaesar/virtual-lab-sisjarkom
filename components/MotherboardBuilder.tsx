"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Cpu, MemoryStick, HardDrive, Monitor as MonitorIcon, Info, CheckCircle2, Zap, Battery } from "lucide-react";

interface ComponentItem {
  id: string;
  type: "cpu" | "ram" | "storage" | "gpu" | "psu";
  name: string;
  specs: string;
  price: string;
  power?: number;
}

interface Socket {
  id: string;
  type: "cpu" | "ram" | "storage" | "gpu" | "psu";
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
  selectedPSU: string;
  onComplete: (success: boolean) => void;
  onComponentInstalled: (type: string, name: string) => void;
  onBack?: () => void;
}

export default function MotherboardBuilder({
  selectedCPU,
  selectedRAM,
  selectedStorage,
  selectedGPU,
  selectedPSU,
  onComplete,
  onComponentInstalled,
  onBack,
}: MotherboardBuilderProps) {
  // Preset configurations
  const presetConfigs = [
    {
      name: "Build Hemat",
      desc: "Performa level awal",
      price: "$",
      cpu: "Intel Core i5-12400 - 6 Cores @ 2.5GHz - 65W",
      ram: "8GB DDR4 - 2666MHz - 10W",
      storage: "256GB NVMe SSD - 3000MB/s - 5W",
      gpu: "Integrated Graphics - Shared Memory - 0W",
      psu: "450W 80+ Bronze",
      color: "zinc"
    },
    {
      name: "Build Menengah",
      desc: "Performa seimbang",
      price: "$$",
      cpu: "Intel Core i7-12700K - 12 Cores @ 3.6GHz - 125W",
      ram: "16GB DDR4 - 3200MHz - 15W",
      storage: "512GB NVMe SSD - 3500MB/s - 7W",
      gpu: "NVIDIA GTX 1660 Super - 6GB GDDR6 - 125W",
      psu: "550W 80+ Bronze",
      color: "blue"
    },
    {
      name: "Build Tinggi",
      desc: "Performa maksimal",
      price: "$$$",
      cpu: "Intel Core i9-13900K - 24 Cores @ 3.0GHz - 253W",
      ram: "32GB DDR4 - 3600MHz - 20W",
      storage: "1TB NVMe SSD - 7000MB/s - 10W",
      gpu: "NVIDIA RTX 4070 - 12GB GDDR6X - 200W",
      psu: "750W 80+ Gold",
      color: "purple"
    },
  ];

  // All available components by category
  const allCPUOptions = [
    { name: "Intel Core i5-12400", cores: "6 Cores", speed: "2.5GHz", power: 65, price: "$" },
    { name: "Intel Core i7-12700K", cores: "12 Cores", speed: "3.6GHz", power: 125, price: "$$" },
    { name: "AMD Ryzen 7 5800X", cores: "8 Cores", speed: "3.8GHz", power: 105, price: "$$" },
    { name: "Intel Core i9-13900K", cores: "24 Cores", speed: "3.0GHz", power: 253, price: "$$$" },
  ];
  
  const allRAMOptions = [
    { name: "8GB DDR4", speed: "2666MHz", power: 10, price: "$" },
    { name: "16GB DDR4", speed: "3200MHz", power: 15, price: "$$" },
    { name: "32GB DDR4", speed: "3600MHz", power: 20, price: "$$$" },
    { name: "16GB DDR5", speed: "4800MHz", power: 18, price: "$$$" },
  ];
  
  const allStorageOptions = [
    { name: "256GB NVMe SSD", type: "NVMe", speed: "3000MB/s", power: 5, price: "$" },
    { name: "512GB NVMe SSD", type: "NVMe", speed: "3500MB/s", power: 7, price: "$$" },
    { name: "1TB NVMe SSD", type: "NVMe", speed: "7000MB/s", power: 10, price: "$$$" },
    { name: "2TB SATA SSD", type: "SATA", speed: "550MB/s", power: 8, price: "$$" },
  ];
  
  const allGPUOptions = [
    { name: "Integrated Graphics", memory: "Shared", power: 0, price: "$" },
    { name: "NVIDIA GTX 1660 Super", memory: "6GB GDDR6", power: 125, price: "$$" },
    { name: "NVIDIA RTX 3060", memory: "12GB GDDR6", power: 170, price: "$$" },
    { name: "NVIDIA RTX 4070", memory: "12GB GDDR6X", power: 200, price: "$$$" },
  ];
  
  const allPSUOptions = [
    { name: "450W 80+ Bronze", wattage: 450, efficiency: "Bronze", price: "$" },
    { name: "550W 80+ Bronze", wattage: 550, efficiency: "Bronze", price: "$$" },
    { name: "650W 80+ Gold", wattage: 650, efficiency: "Gold", price: "$$" },
    { name: "750W 80+ Gold", wattage: 750, efficiency: "Gold", price: "$$$" },
    { name: "850W 80+ Platinum", wattage: 850, efficiency: "Platinum", price: "$$$" },
  ];

  // Extract power from specs (format: "Name - Specs - XXW")
  const extractPower = (specs: string): number => {
    const match = specs.match(/(\d+)W/);
    return match ? parseInt(match[1]) : 0;
  };

  const components: ComponentItem[] = [
    { id: "cpu", type: "cpu", name: selectedCPU.split(" - ")[0], specs: selectedCPU, price: "$", power: extractPower(selectedCPU) },
    { id: "ram", type: "ram", name: selectedRAM.split(" - ")[0], specs: selectedRAM, price: "$", power: extractPower(selectedRAM) },
    { id: "storage", type: "storage", name: selectedStorage.split(" - ")[0], specs: selectedStorage, price: "$", power: extractPower(selectedStorage) },
    { id: "gpu", type: "gpu", name: selectedGPU.split(" - ")[0], specs: selectedGPU, price: "$", power: extractPower(selectedGPU) },
    { id: "psu", type: "psu", name: selectedPSU, specs: selectedPSU, price: "$" },
  ];

  const loadPreset = (preset: typeof presetConfigs[0]) => {
    // Auto-install all components from preset
    const presetComponents = {
      cpu: { id: "cpu", type: "cpu" as const, name: preset.cpu.split(" - ")[0], specs: preset.cpu, price: "$", power: extractPower(preset.cpu) },
      ram: { id: "ram", type: "ram" as const, name: preset.ram.split(" - ")[0], specs: preset.ram, price: "$", power: extractPower(preset.ram) },
      storage: { id: "storage", type: "storage" as const, name: preset.storage.split(" - ")[0], specs: preset.storage, price: "$", power: extractPower(preset.storage) },
      gpu: { id: "gpu", type: "gpu" as const, name: preset.gpu.split(" - ")[0], specs: preset.gpu, price: "$", power: extractPower(preset.gpu) },
      psu: { id: "psu", type: "psu" as const, name: preset.psu, specs: preset.psu, price: "$" },
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
      "psu-connector": presetComponents.psu,
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
    { id: "cpu-socket", type: "cpu", label: "CPU Socket (LGA 1700)", position: { top: "30%", left: "25%" }, size: { width: 120, height: 120 }, installed: false },
    { id: "ram-slot-1", type: "ram", label: "RAM Slot 1", position: { top: "25%", left: "70%" }, size: { width: 60, height: 100 }, installed: false },
    { id: "ram-slot-2", type: "ram", label: "RAM Slot 2", position: { top: "25%", left: "85%" }, size: { width: 60, height: 100 }, installed: false },
    { id: "pcie-slot", type: "gpu", label: "PCIe x16 Slot", position: { top: "70%", left: "35%" }, size: { width: 180, height: 80 }, installed: false },
    { id: "sata-port", type: "storage", label: "SATA Port", position: { top: "70%", left: "75%" }, size: { width: 80, height: 80 }, installed: false },
    { id: "psu-connector", type: "psu", label: "PSU Connector", position: { top: "50%", left: "5%" }, size: { width: 90, height: 110 }, installed: false },
  ]);

  const [draggedComponent, setDraggedComponent] = useState<ComponentItem | null>(null);
  const [installedComponents, setInstalledComponents] = useState<Set<string>>(new Set());
  
  // Track which component is installed in which socket
  const [socketContents, setSocketContents] = useState<Record<string, ComponentItem | null>>({});

  // Canvas zoom and pan state
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleDragStart = (component: ComponentItem) => {
    setDraggedComponent(component);
  };

  const handleDragOver = (e: React.DragEvent, socket: Socket) => {
    e.preventDefault();
  };

  // Canvas zoom and pan handlers
  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(0.5, canvasZoom + delta), 3);
    setCanvasZoom(newZoom);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0 && !draggedComponent) { // Left click and not dragging component
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleCanvasMouseUp = () => {
    setIsPanning(false);
  };

  const resetCanvasView = () => {
    setCanvasZoom(1);
    setCanvasOffset({ x: 0, y: 0 });
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
      case "psu": return "border-yellow-500 bg-yellow-950/20";
      default: return "border-zinc-700";
    }
  };

  const getComponentIcon = (type: string) => {
    switch (type) {
      case "cpu": return Cpu;
      case "ram": return MemoryStick;
      case "storage": return HardDrive;
      case "gpu": return MonitorIcon;
      case "psu": return Zap;
      default: return Cpu;
    }
  };

  // Calculate total power consumption
  const calculateTotalPower = (): number => {
    let total = 0;
    Object.values(socketContents).forEach((component) => {
      if (component && component.power) {
        total += component.power;
      }
    });
    // Add motherboard base power (around 50-80W)
    total += 60;
    return total;
  };

  // Get recommended PSU wattage with headroom
  const getRecommendedPSU = (): number => {
    const totalPower = calculateTotalPower();
    return Math.ceil(totalPower * 1.3 / 50) * 50; // 30% headroom, rounded to nearest 50W
  };

  // Check if installed PSU is sufficient
  const isPSUSufficient = (): boolean => {
    const installedPSU = socketContents["psu-connector"];
    if (!installedPSU) return false;
    const psuWattage = parseInt(installedPSU.name.match(/(\d+)W/)?.[1] || "0");
    return psuWattage >= getRecommendedPSU();
  };

  return (
    <div className="space-y-2">
      {/* Navigation Buttons */}
      {onBack && (
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-zinc-300 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            ← Kembali
          </button>
        </div>
      )}
      
      {/* Preset Configurations - Compact */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">Preset Cepat</h4>
          <span className="text-xs text-zinc-600 dark:text-zinc-500">Klik untuk auto-install</span>
        </div>
        <div className="flex gap-2">
          {presetConfigs.map((preset, idx) => (
            <motion.button
              key={idx}
              onClick={() => loadPreset(preset)}
              className={`flex-1 border-2 rounded-lg p-2 text-left transition-all ${
                preset.color === 'zinc' 
                  ? 'bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 border-zinc-400 dark:border-zinc-600 hover:border-zinc-500 dark:hover:border-zinc-500' 
                  : preset.color === 'blue'
                  ? 'bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950 border-blue-400 dark:border-blue-600 hover:border-blue-500 dark:hover:border-blue-500'
                  : 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 border-purple-400 dark:border-purple-600 hover:border-purple-500 dark:hover:border-purple-500'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-zinc-900 dark:text-white text-xs">{preset.name}</h5>
                  <span className={`font-bold text-xs ${
                    preset.color === 'zinc' 
                      ? 'text-zinc-700 dark:text-zinc-300' 
                      : preset.color === 'blue'
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-purple-700 dark:text-purple-300'
                  }`}>{preset.price}</span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{preset.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 items-start">
        {/* Component Catalog - Left Panel */}
        <div className="col-span-4 space-y-2 h-[500px] overflow-y-auto pr-2 scrollbar-hide">
          <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-400 sticky top-0 bg-white dark:bg-zinc-900 pb-1 z-10 flex items-center gap-1">
            📦 Drag komponen ke socket →
          </h4>
            
          {/* CPU Category */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">CPU</p>
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
                    price: cpu.price,
                    power: cpu.power
                  })}
                  className="text-xs p-2 rounded bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 cursor-grab active:cursor-grabbing hover:border-emerald-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300 font-mono truncate">{cpu.name}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 ml-1">{cpu.price}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{cpu.power}W TDP</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RAM Category */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <MemoryStick className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">RAM</p>
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
                    price: ram.price,
                    power: ram.power
                  })}
                  className="text-xs p-2 rounded bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 cursor-grab active:cursor-grabbing hover:border-cyan-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300 font-mono truncate">{ram.name}</span>
                    <span className="text-cyan-600 dark:text-cyan-400 ml-1">{ram.price}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{ram.power}W</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Storage Category */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <HardDrive className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Storage</p>
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
                    specs: `${storage.name} - ${storage.speed}`,
                    price: storage.price,
                    power: storage.power
                  })}
                  className="text-xs p-2 rounded bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 cursor-grab active:cursor-grabbing hover:border-blue-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300 font-mono truncate">{storage.name}</span>
                    <span className="text-blue-600 dark:text-blue-400 ml-1">{storage.price}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{storage.power}W</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* GPU Category */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <MonitorIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">GPU</p>
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
                    price: gpu.price,
                    power: gpu.power
                  })}
                  className="text-xs p-2 rounded bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 cursor-grab active:cursor-grabbing hover:border-purple-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300 font-mono truncate">{gpu.name}</span>
                    <span className="text-purple-600 dark:text-purple-400 ml-1">{gpu.price}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{gpu.power}W</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* PSU Category */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Power Supply</p>
            </div>
            <div className="space-y-1.5">
              {allPSUOptions.map((psu, idx) => (
                <motion.div 
                  key={idx} 
                  draggable={true}
                  onDragStart={() => handleDragStart({
                    id: `psu-catalog-${idx}`,
                    type: "psu",
                    name: psu.name,
                    specs: `${psu.name} - ${psu.efficiency}`,
                    price: psu.price
                  })}
                  className="text-xs p-2 rounded bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-300 dark:border-zinc-700 cursor-grab active:cursor-grabbing hover:border-yellow-500/50 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-700 dark:text-zinc-300 font-mono truncate">{psu.name}</span>
                    <span className="text-yellow-600 dark:text-yellow-400 ml-1">{psu.price}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">{psu.efficiency} Certified</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Motherboard */}
        <div className="col-span-8 flex flex-col gap-2 h-[500px]">
          {/* Installed Components Summary */}
          {Object.keys(socketContents).length > 0 && (
            <motion.div 
              className="bg-white dark:bg-zinc-900 rounded-lg p-2 border border-emerald-500/50 dark:border-emerald-500/30 flex-shrink-0"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h5 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Komponen Terpasang
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                {Object.entries(socketContents).map(([socketId, component]) => {
                  if (!component) return null;
                  const Icon = getComponentIcon(component.type);
                  return (
                    <div key={socketId} className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded p-1.5">
                      <Icon className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] text-zinc-700 dark:text-zinc-300 font-mono truncate">{component.name}</p>
                        <p className="text-[9px] text-zinc-500">{socketId.replace("-", " ").replace("slot", "")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          <div 
            className="relative w-full flex-1 bg-gradient-to-br from-emerald-50 to-cyan-50 dark:from-emerald-950/30 dark:to-cyan-950/30 border-2 border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden"
            onWheel={handleCanvasWheel}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
          >
            {/* Canvas transform container */}
            <div 
              style={{
                transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${canvasZoom})`,
                transformOrigin: 'center',
                transition: isPanning ? 'none' : 'transform 0.1s',
                width: '100%',
                height: '100%',
                position: 'relative',
              }}
            >
            {/* PCB Texture Background */}
            <div className="absolute inset-0">
              {/* Base grid pattern */}
              <div className="absolute inset-0 opacity-15 dark:opacity-10" style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, .08) 25%, rgba(0, 0, 0, .08) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .08) 75%, rgba(0, 0, 0, .08) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, .08) 25%, rgba(0, 0, 0, .08) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, .08) 75%, rgba(0, 0, 0, .08) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '50px 50px',
              }}></div>
              
              {/* Subtle noise texture */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}></div>
            </div>

            {/* Decorative PCB Elements */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {/* Mounting holes */}
              <circle cx="5%" cy="5%" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 dark:text-zinc-600 opacity-40" />
              <circle cx="95%" cy="5%" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 dark:text-zinc-600 opacity-40" />
              <circle cx="5%" cy="95%" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 dark:text-zinc-600 opacity-40" />
              <circle cx="95%" cy="95%" r="8" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 dark:text-zinc-600 opacity-40" />
              
              {/* Decorative corner brackets */}
              <path d="M 20 20 L 20 40 M 20 20 L 40 20" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 dark:text-zinc-600 opacity-30" />
              <path d="M 380 20 L 380 40 M 380 20 L 360 20" stroke="currentColor" strokeWidth="1.5" className="text-zinc-400 dark:text-zinc-600 opacity-30" transform="translate(480, 0)" />
            </svg>

            {/* Enhanced Circuit traces - Tidy routing */}
            <svg className="absolute inset-0 w-full h-full opacity-50 dark:opacity-30">
              {/* PSU to main power bus */}
              <line x1="5%" y1="50%" x2="5%" y2="35%" stroke="#eab308" strokeWidth="3" strokeLinecap="round" />
              
              {/* Main power bus from left edge */}
              <line x1="5%" y1="35%" x2="20%" y2="35%" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* CPU power trace */}
              <line x1="20%" y1="35%" x2="25%" y2="35%" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <line x1="25%" y1="35%" x2="25%" y2="30%" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              
              {/* RAM slot 1 trace */}
              <line x1="20%" y1="35%" x2="20%" y2="25%" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              <line x1="20%" y1="25%" x2="70%" y2="25%" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              
              {/* RAM slot 2 trace */}
              <line x1="70%" y1="25%" x2="85%" y2="25%" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" />
              
              {/* GPU power trace */}
              <line x1="20%" y1="35%" x2="20%" y2="72%" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
              <line x1="20%" y1="72%" x2="35%" y2="72%" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" />
              
              {/* Storage trace */}
              <line x1="20%" y1="35%" x2="20%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <line x1="20%" y1="50%" x2="75%" y2="50%" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              <line x1="75%" y1="50%" x2="75%" y2="70%" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              
              {/* Power connection dots at each socket */}
              {/* CPU socket dot */}
              <circle cx="25%" cy="30%" r="4" className="fill-emerald-500 dark:fill-emerald-400" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* RAM slot 1 dot */}
              <circle cx="70%" cy="25%" r="4" className="fill-cyan-500 dark:fill-cyan-400" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="0.2s" repeatCount="indefinite" />
              </circle>
              
              {/* RAM slot 2 dot */}
              <circle cx="85%" cy="25%" r="4" className="fill-cyan-500 dark:fill-cyan-400" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="0.4s" repeatCount="indefinite" />
              </circle>
              
              {/* GPU socket dot */}
              <circle cx="35%" cy="72%" r="4" className="fill-purple-500 dark:fill-purple-400" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="0.6s" repeatCount="indefinite" />
              </circle>
              
              {/* Storage socket dot */}
              <circle cx="75%" cy="70%" r="4" className="fill-blue-500 dark:fill-blue-400" opacity="0.8">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" begin="0.8s" repeatCount="indefinite" />
              </circle>
              
              {/* Main power junction dot */}
              <circle cx="20%" cy="35%" r="5" className="fill-emerald-500 dark:fill-emerald-400" opacity="0.9">
                <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />
              </circle>
              
              {/* PSU connector dot */}
              <circle cx="5%" cy="50%" r="5" className="fill-yellow-500 dark:fill-yellow-400" opacity="0.9">
                <animate attributeName="opacity" values="0.9;1;0.9" dur="1s" repeatCount="indefinite" />
              </circle>
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
                      ? "border-solid border-emerald-500 bg-emerald-100 dark:bg-emerald-950/40" 
                      : draggedComponent && draggedComponent.type === socket.type 
                        ? "border-dashed border-cyan-500 bg-cyan-100 dark:bg-cyan-950/30 animate-pulse" 
                        : "border-dashed border-zinc-400 dark:border-zinc-700 bg-white dark:bg-zinc-900/50"
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
                  <div className="absolute inset-0 flex items-center justify-center p-0.5">
                    {installedComponent ? (
                      <motion.div 
                        className="text-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="relative">
                          <Icon className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                          <motion.div 
                            className="absolute -top-1 -right-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </motion.div>
                        </div>
                        <p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 leading-tight max-w-full mx-auto truncate mt-1.5">
                          {installedComponent.name.split(" ").slice(0, 2).join(" ")}
                        </p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <Icon className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto opacity-50" />
                        <p className="text-xs font-mono text-zinc-600 dark:text-zinc-500 leading-tight mt-1.5">
                          {socket.label.split(" ")[0]}
                        </p>
                        <p className="text-[10px] font-mono text-zinc-500 dark:text-zinc-600">
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

            </div>
            
            {/* Motherboard Label - Float outside canvas */}
            <div className="absolute bottom-2 right-2 text-right pointer-events-none">
              <p className="text-[10px] font-mono text-zinc-600">ATX Motherboard</p>
              <p className="text-[10px] font-mono text-zinc-700">Model: VL-MB-2024</p>
            </div>

            {/* Progress Indicator - Float outside canvas */}
            <div className="absolute top-2 right-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg px-2 py-1 pointer-events-none">
              <p className="text-[10px] text-zinc-700 dark:text-zinc-400 font-mono">
                Progres: {installedComponents.size}/{components.length}
              </p>
            </div>

            {/* Power Requirement Indicator - Float outside canvas */}
            {Object.keys(socketContents).length > 0 && (
              <motion.div 
                className={`absolute top-2 left-2 border-2 rounded-lg px-2 py-1.5 pointer-events-none ${
                  socketContents["psu-connector"] && isPSUSufficient()
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500"
                    : "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-500"
                }`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap className={`w-4 h-4 ${
                    socketContents["psu-connector"] && isPSUSufficient()
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-yellow-600 dark:text-yellow-400"
                  }`} />
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">Daya Sistem</p>
                </div>
                <div className="space-y-0.5 text-[10px] font-mono">
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Total: <span className="font-bold">{calculateTotalPower()}W</span>
                  </p>
                  <p className="text-zinc-700 dark:text-zinc-300">
                    Rekomendasi: <span className="font-bold">{getRecommendedPSU()}W+</span>
                  </p>
                  {socketContents["psu-connector"] ? (
                    <p className={`font-bold ${
                      isPSUSufficient()
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      PSU: {socketContents["psu-connector"].name}
                    </p>
                  ) : (
                    <p className="text-yellow-600 dark:text-yellow-400 font-bold">
                      ⚠ PSU Belum Terpasang
                    </p>
                  )}
                </div>
              </motion.div>
            )}
            
            {/* Canvas Controls */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1.5">
              <button
                onClick={() => setCanvasZoom(Math.min(canvasZoom + 0.2, 3))}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-2 py-0.5 rounded text-[10px] border border-zinc-600"
              >
                🔍+
              </button>
              <button
                onClick={() => setCanvasZoom(Math.max(canvasZoom - 0.2, 0.5))}
                className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-2 py-0.5 rounded text-[10px] border border-zinc-300 dark:border-zinc-600"
              >
                🔍-
              </button>
              <button
                onClick={resetCanvasView}
                className="bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white px-2 py-0.5 rounded text-[10px] border border-zinc-300 dark:border-zinc-600"
              >
                ↺ Reset
              </button>
              <span className="bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400 px-2 py-0.5 rounded text-[10px] border border-zinc-300 dark:border-zinc-600">
                {Math.round(canvasZoom * 100)}%
              </span>
            </div>
          </div>
          
          <p className="text-xs text-center text-zinc-600 dark:text-zinc-500 mt-2 font-mono">
            💡 Tip: Pastikan komponen dipasang di socket yang benar!
          </p>
        </div>
      </div>
    </div>
  );
}
