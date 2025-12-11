"use client";

import { motion } from "framer-motion";
import { X, Cpu, MemoryStick, Info, HardDrive, Monitor } from "lucide-react";
import { useState } from "react";
import MotherboardBuilder from "@/components/MotherboardBuilder";

interface HardwareModalProps {
  onClose: () => void;
  onComplete: (specs?: { cpu: string; ram: string; storage: string; gpu: string }) => void;
  addLog: (message: string) => void;
}

export default function HardwareModal({
  onClose,
  onComplete,
  addLog,
}: HardwareModalProps) {
  const [step, setStep] = useState<"intro" | "customize" | "build" | "installing" | "done">("intro");
  
  // Hardware options
  const cpuOptions = [
    { name: "Intel Core i5-12400", cores: "6 Cores", speed: "2.5GHz", price: "$" },
    { name: "Intel Core i7-12700K", cores: "12 Cores", speed: "3.6GHz", price: "$$" },
    { name: "AMD Ryzen 7 5800X", cores: "8 Cores", speed: "3.8GHz", price: "$$" },
    { name: "Intel Core i9-13900K", cores: "24 Cores", speed: "3.0GHz", price: "$$$" },
  ];
  
  const ramOptions = [
    { name: "8GB DDR4", speed: "2666MHz", price: "$" },
    { name: "16GB DDR4", speed: "3200MHz", price: "$$" },
    { name: "32GB DDR4", speed: "3600MHz", price: "$$$" },
    { name: "16GB DDR5", speed: "4800MHz", price: "$$$" },
  ];
  
  const storageOptions = [
    { name: "256GB NVMe SSD", type: "NVMe", speed: "3000MB/s", price: "$" },
    { name: "512GB NVMe SSD", type: "NVMe", speed: "3500MB/s", price: "$$" },
    { name: "1TB NVMe SSD", type: "NVMe", speed: "7000MB/s", price: "$$$" },
    { name: "2TB SATA SSD", type: "SATA", speed: "550MB/s", price: "$$" },
  ];
  
  const gpuOptions = [
    { name: "NVIDIA GTX 1660", vram: "6GB GDDR5", price: "$" },
    { name: "NVIDIA RTX 3060", vram: "12GB GDDR6", price: "$$" },
    { name: "AMD RX 6700 XT", vram: "12GB GDDR6", price: "$$" },
    { name: "NVIDIA RTX 4070", vram: "12GB GDDR6X", price: "$$$" },
  ];
  
  const [selectedCPU, setSelectedCPU] = useState(cpuOptions[1].name);
  const [selectedRAM, setSelectedRAM] = useState(ramOptions[1].name);
  const [selectedStorage, setSelectedStorage] = useState(storageOptions[1].name);
  const [selectedGPU, setSelectedGPU] = useState(gpuOptions[1].name);

  const handleProceedToBuild = () => {
    setStep("build");
    addLog("Membuka workstation perakitan PC...");
    addLog("Siap untuk merakit komponen ke motherboard.");
  };

  const handleComponentInstalled = (type: string, name: string) => {
    addLog(`✓ ${type.toUpperCase()} berhasil dipasang: ${name}`);
  };

  const handleBuildComplete = (success: boolean) => {
    if (success) {
      setStep("installing");
      addLog("Semua komponen terpasang! Melakukan POST (Power-On Self-Test)...");
      
      setTimeout(() => {
        addLog("POST completed. System checking...");
        addLog(`CPU: ${selectedCPU} - OK`);
      }, 1000);

      setTimeout(() => {
        addLog(`RAM: ${selectedRAM} - OK`);
      }, 1800);
      
      setTimeout(() => {
        addLog(`Storage: ${selectedStorage} - OK`);
      }, 2400);

      setTimeout(() => {
        addLog(`GPU: ${selectedGPU} - OK`);
        addLog("All components initialized successfully!");
        setStep("done");
      }, 3200);
    }
  };

  const handleFinish = () => {
    onComplete({
      cpu: selectedCPU,
      ram: selectedRAM,
      storage: selectedStorage,
      gpu: selectedGPU,
    });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`bg-zinc-900 border-2 border-emerald-500/50 rounded-2xl ${
          step === "build" ? "max-w-7xl" : "max-w-2xl"
        } w-full p-8 relative shadow-2xl shadow-emerald-500/20 transition-all`}
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-emerald-400 mb-2">
          Fase 1: Instalasi Hardware
        </h2>
        <p className="text-zinc-400 text-sm mb-6 font-mono">
          Sistem Komputer // {step === "customize" ? "Kustomisasi Spesifikasi" : "Pilih Komponen"}
        </p>

        {step === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="glass rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-zinc-300">
                <p className="font-semibold mb-2">Tentang Komponen Hardware:</p>
                <ul className="space-y-2 text-zinc-400">
                  <li>
                    <strong className="text-emerald-400">CPU:</strong> Otak komputer untuk pemrosesan
                  </li>
                  <li>
                    <strong className="text-emerald-400">RAM:</strong> Memory untuk multitasking
                  </li>
                  <li>
                    <strong className="text-emerald-400">Storage:</strong> Penyimpanan data
                  </li>
                  <li>
                    <strong className="text-emerald-400">GPU:</strong> Prosesor grafis
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-lg p-4 text-center">
                <Cpu className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-zinc-300">Processor</p>
                <p className="text-xs text-zinc-500">4 options</p>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <MemoryStick className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-zinc-300">Memory</p>
                <p className="text-xs text-zinc-500">4 options</p>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <HardDrive className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-zinc-300">Storage</p>
                <p className="text-xs text-zinc-500">4 options</p>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <Monitor className="w-12 h-12 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-zinc-300">Graphics</p>
                <p className="text-xs text-zinc-500">4 options</p>
              </div>
            </div>

            <button
              onClick={() => setStep("customize")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Kustomisasi Spesifikasi →
            </button>
          </motion.div>
        )}

        {step === "customize" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 max-h-[500px] overflow-y-auto pr-2"
          >
            {/* CPU Selection */}
            <div>
              <h3 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Processor (CPU)
              </h3>
              <div className="grid gap-2">
                {cpuOptions.map((cpu) => (
                  <button
                    key={cpu.name}
                    onClick={() => setSelectedCPU(cpu.name)}
                    className={`glass rounded-lg p-3 text-left transition-all ${
                      selectedCPU === cpu.name
                        ? "border-2 border-emerald-500 bg-emerald-950/30"
                        : "border border-zinc-700 hover:border-emerald-500/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-zinc-200 font-mono text-sm">{cpu.name}</p>
                        <p className="text-zinc-500 text-xs">{cpu.cores} @ {cpu.speed}</p>
                      </div>
                      <span className="text-emerald-400 text-sm">{cpu.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RAM Selection */}
            <div>
              <h3 className="text-cyan-400 font-bold mb-2 flex items-center gap-2">
                <MemoryStick className="w-5 h-5" />
                Memory (RAM)
              </h3>
              <div className="grid gap-2">
                {ramOptions.map((ram) => (
                  <button
                    key={ram.name}
                    onClick={() => setSelectedRAM(ram.name)}
                    className={`glass rounded-lg p-3 text-left transition-all ${
                      selectedRAM === ram.name
                        ? "border-2 border-cyan-500 bg-cyan-950/30"
                        : "border border-zinc-700 hover:border-cyan-500/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-zinc-200 font-mono text-sm">{ram.name}</p>
                        <p className="text-zinc-500 text-xs">{ram.speed}</p>
                      </div>
                      <span className="text-cyan-400 text-sm">{ram.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Storage Selection */}
            <div>
              <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                <HardDrive className="w-5 h-5" />
                Storage
              </h3>
              <div className="grid gap-2">
                {storageOptions.map((storage) => (
                  <button
                    key={storage.name}
                    onClick={() => setSelectedStorage(storage.name)}
                    className={`glass rounded-lg p-3 text-left transition-all ${
                      selectedStorage === storage.name
                        ? "border-2 border-blue-500 bg-blue-950/30"
                        : "border border-zinc-700 hover:border-blue-500/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-zinc-200 font-mono text-sm">{storage.name}</p>
                        <p className="text-zinc-500 text-xs">{storage.type} - {storage.speed}</p>
                      </div>
                      <span className="text-blue-400 text-sm">{storage.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* GPU Selection */}
            <div>
              <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Graphics Card (GPU)
              </h3>
              <div className="grid gap-2">
                {gpuOptions.map((gpu) => (
                  <button
                    key={gpu.name}
                    onClick={() => setSelectedGPU(gpu.name)}
                    className={`glass rounded-lg p-3 text-left transition-all ${
                      selectedGPU === gpu.name
                        ? "border-2 border-purple-500 bg-purple-950/30"
                        : "border border-zinc-700 hover:border-purple-500/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-zinc-200 font-mono text-sm">{gpu.name}</p>
                        <p className="text-zinc-500 text-xs">{gpu.vram}</p>
                      </div>
                      <span className="text-purple-400 text-sm">{gpu.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 sticky bottom-0 bg-zinc-900 pt-4 pb-2">
              <button
                onClick={() => setStep("intro")}
                className="flex-1 glass hover:bg-zinc-800 text-zinc-300 font-semibold py-3 rounded-lg transition-colors"
              >
                ← Kembali
              </button>
              <button
                onClick={handleProceedToBuild}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Rakit PC →
              </button>
            </div>
          </motion.div>
        )}

        {step === "build" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <MotherboardBuilder
              selectedCPU={selectedCPU}
              selectedRAM={selectedRAM}
              selectedStorage={selectedStorage}
              selectedGPU={selectedGPU}
              onComplete={handleBuildComplete}
              onComponentInstalled={handleComponentInstalled}
            />
          </motion.div>
        )}

        {step === "installing" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-6 text-zinc-300 font-mono">Menginstal komponen...</p>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-emerald-950/30 border border-emerald-500/50 rounded-lg p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                Instalasi Selesai!
              </h3>
              <p className="text-zinc-400">
                CPU dan RAM berhasil terpasang dan siap digunakan.
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Lanjutkan ke Fase Berikutnya
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
