"use client";

import { motion } from "framer-motion";
import { X, Cpu, MemoryStick, Info, HardDrive, Monitor, Zap } from "lucide-react";
import { useState } from "react";
import MotherboardBuilder from "@/components/MotherboardBuilder";

interface HardwareModalProps {
  onClose: () => void;
  onComplete: (specs?: { cpu: string; ram: string; storage: string; gpu: string; psu: string }) => void;
  addLog: (message: string) => void;
}

export default function HardwareModal({
  onClose,
  onComplete,
  addLog,
}: HardwareModalProps) {
  const [step, setStep] = useState<"intro" | "build" | "installing" | "done">("intro");
  
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
  
  const psuOptions = [
    { name: "450W 80+ Bronze", wattage: 450, efficiency: "Bronze", price: "$" },
    { name: "550W 80+ Bronze", wattage: 550, efficiency: "Bronze", price: "$$" },
    { name: "650W 80+ Gold", wattage: 650, efficiency: "Gold", price: "$$" },
    { name: "750W 80+ Gold", wattage: 750, efficiency: "Gold", price: "$$$" },
    { name: "850W 80+ Platinum", wattage: 850, efficiency: "Platinum", price: "$$$" },
  ];
  
  const [selectedCPU, setSelectedCPU] = useState("");
  const [selectedRAM, setSelectedRAM] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedGPU, setSelectedGPU] = useState("");
  const [selectedPSU, setSelectedPSU] = useState("");

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
        addLog("POST selesai. Memeriksa sistem...");
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
      }, 3200);

      setTimeout(() => {
        addLog(`PSU: ${selectedPSU} - OK`);
        addLog("Semua komponen berhasil diinisialisasi!");
        setStep("done");
      }, 4000);
    }
  };

  const handleFinish = () => {
    onComplete({
      cpu: selectedCPU,
      ram: selectedRAM,
      storage: selectedStorage,
      gpu: selectedGPU,
      psu: selectedPSU,
    });
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`bg-[#0d1b2a]/95 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl ${
          step === "build" ? "max-w-6xl max-h-[90vh] overflow-y-auto" : "max-w-2xl"
        } w-full p-6 relative shadow-2xl shadow-cyan-500/20 transition-all`}
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-cyan-400 mb-2">
          Fase 1: Instalasi Hardware
        </h2>
        <p className="text-cyan-300/70 text-sm mb-6 font-mono">
          Sistem Komputer // {step === "build" ? "Rakit Komponen" : "Pilih Komponen"}
        </p>

        {step === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-cyan-300">
                <p className="font-semibold mb-2">Tentang Komponen Hardware:</p>
                <ul className="space-y-2 text-cyan-300/70">
                  <li>
                    <strong className="text-cyan-400">CPU:</strong> Otak komputer untuk pemrosesan
                  </li>
                  <li>
                    <strong className="text-cyan-400">RAM:</strong> Memori untuk multitasking
                  </li>
                  <li>
                    <strong className="text-cyan-400">Penyimpanan:</strong> Tempat menyimpan data
                  </li>
                  <li>
                    <strong className="text-cyan-400">GPU:</strong> Prosesor grafis
                  </li>
                  <li>
                    <strong className="text-cyan-400">PSU:</strong> Sumber daya listrik
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-center">
                <Cpu className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-cyan-300">Prosesor</p>
                <p className="text-xs text-cyan-400/50">4 pilihan</p>
              </div>
              <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-center">
                <MemoryStick className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-cyan-300">Memori</p>
                <p className="text-xs text-cyan-400/50">4 pilihan</p>
              </div>
              <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-center">
                <HardDrive className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-cyan-300">Penyimpanan</p>
                <p className="text-xs text-cyan-400/50">4 pilihan</p>
              </div>
              <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-center">
                <Monitor className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-cyan-300">Grafis</p>
                <p className="text-xs text-cyan-400/50">4 pilihan</p>
              </div>
              <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-center">
                <Zap className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-sm font-mono text-cyan-300">Power Supply</p>
                <p className="text-xs text-cyan-400/50">5 pilihan</p>
              </div>
            </div>

            <button
              onClick={() => {
                setStep("build");
                addLog("Membuka workstation perakitan PC...");
                addLog("Siap untuk merakit komponen ke motherboard.");
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Mulai Rakit PC →
            </button>
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
              selectedPSU={selectedPSU}
              onComplete={handleBuildComplete}
              onComponentInstalled={handleComponentInstalled}
              onBack={() => setStep("intro")}
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
              className="w-24 h-24 border-6 border-cyan-500 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="mt-8 text-cyan-300 font-mono text-xl">Menginstal komponen...</p>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-blue-950/30 border border-cyan-500/30 rounded-lg p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">✓</span>
                </div>
              </motion.div>
              <h3 className="text-4xl font-bold text-cyan-400 mb-3">
                Instalasi Selesai!
              </h3>
              <p className="text-cyan-300/70 text-lg">
                CPU dan RAM berhasil terpasang dan siap digunakan.
              </p>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-4 text-lg rounded-lg transition-all duration-200"
            >
              Lanjutkan ke Fase Berikutnya
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
