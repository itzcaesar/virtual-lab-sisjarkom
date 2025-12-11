"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Monitor, Terminal, ChevronRight } from "lucide-react";
import { OSType } from "@/app/page";
import { useState } from "react";

interface OSModalProps {
  onClose: () => void;
  onComplete: (os: OSType, distro?: string) => void;
  addLog: (message: string) => void;
}

export default function OSModal({ onClose, onComplete, addLog }: OSModalProps) {
  const [step, setStep] = useState<"select" | "linux-distro">("select");
  const [selectedOS, setSelectedOS] = useState<"windows" | "linux" | null>(null);

  const linuxDistros = [
    { id: "ubuntu", name: "Ubuntu", desc: "User-friendly, great for beginners", color: "orange" },
    { id: "debian", name: "Debian", desc: "Stable and reliable", color: "red" },
    { id: "fedora", name: "Fedora", desc: "Cutting-edge features", color: "blue" },
    { id: "arch", name: "Arch Linux", desc: "Minimalist and customizable", color: "cyan" },
    { id: "kali", name: "Kali Linux", desc: "Penetration testing & security", color: "purple" },
    { id: "centos", name: "CentOS", desc: "Enterprise-grade stability", color: "green" },
  ];

  const handleSelectOS = (os: "windows" | "linux") => {
    setSelectedOS(os);
    if (os === "linux") {
      setStep("linux-distro");
      addLog("Memilih distribusi Linux...");
    } else {
      handleComplete(os);
    }
  };

  const handleSelectDistro = (distro: string) => {
    addLog(`Memulai instalasi Linux (${distro})...`);
    setTimeout(() => {
      addLog(`Linux ${distro} berhasil diinstal.`);
      onComplete("linux", distro);
      onClose();
    }, 1500);
  };

  const handleComplete = (os: "windows") => {
    addLog(`Memulai instalasi ${os === "windows" ? "Windows" : "Linux"}...`);
    
    setTimeout(() => {
      addLog(`Sistem operasi ${os === "windows" ? "Windows" : "Linux"} berhasil diinstal.`);
      onComplete(os);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-zinc-900 border-2 border-cyan-500/50 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl shadow-cyan-500/20"
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

        <h2 className="text-3xl font-bold text-cyan-400 mb-2">
          Fase 2: Instalasi Sistem Operasi
        </h2>
        <p className="text-zinc-400 text-sm mb-6 font-mono">
          Operating System // Pilih OS yang diinginkan
        </p>

        <div className="glass rounded-lg p-4 flex items-start gap-3 mb-6">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-zinc-300">
            <p className="font-semibold mb-2">Tentang Sistem Operasi:</p>
            <p className="text-zinc-400">
              OS adalah software yang mengelola hardware dan menyediakan layanan untuk
              program aplikasi. OS mengatur CPU, RAM, dan perangkat lainnya yang telah
              diinstal di fase sebelumnya.
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-2 gap-4"
            >
              {/* Windows Option */}
              <motion.button
                onClick={() => handleSelectOS("windows")}
                className="glass rounded-lg p-6 text-center group hover:border-blue-500/70 hover:bg-blue-950/30 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Monitor className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-blue-400 mb-2">Windows</h3>
                <p className="text-xs text-zinc-400 mb-3">
                  Interface grafis yang user-friendly dengan dukungan aplikasi luas.
                </p>
                <ul className="text-xs text-zinc-500 text-left space-y-1">
                  <li>• GUI Desktop</li>
                  <li>• Compatible Software</li>
                  <li>• Easy to Use</li>
                </ul>
              </motion.button>

              {/* Linux Option */}
              <motion.button
                onClick={() => handleSelectOS("linux")}
                className="glass rounded-lg p-6 text-center group hover:border-green-500/70 hover:bg-green-950/30 transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Terminal className="w-16 h-16 text-green-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-green-400 mb-2">Linux</h3>
                <p className="text-xs text-zinc-400 mb-3">
                  Open-source dengan kontrol penuh melalui terminal dan kernel access.
                </p>
                <ul className="text-xs text-zinc-500 text-left space-y-1">
                  <li>• Command Line Interface</li>
                  <li>• Open Source</li>
                  <li>• Full Control</li>
                </ul>
                <ChevronRight className="w-5 h-5 text-green-400 mx-auto mt-2" />
              </motion.button>
            </motion.div>
          )}

          {step === "linux-distro" && (
            <motion.div
              key="distro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => setStep("select")}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <h3 className="text-lg font-bold text-green-400">
                  Pilih Distribusi Linux
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {linuxDistros.map((distro) => (
                  <motion.button
                    key={distro.id}
                    onClick={() => handleSelectDistro(distro.name)}
                    className="glass rounded-lg p-4 text-left group hover:border-emerald-500/70 transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Terminal className="w-8 h-8 text-emerald-400 mb-2" />
                    <h4 className="text-sm font-bold text-white mb-1">
                      {distro.name}
                    </h4>
                    <p className="text-xs text-zinc-400">{distro.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
