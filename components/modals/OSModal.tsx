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
  const [step, setStep] = useState<"select" | "linux-distro" | "windows-edition">("select");
  const [selectedOS, setSelectedOS] = useState<"windows" | "linux" | null>(null);

  const linuxDistros = [
    { id: "ubuntu", name: "Ubuntu", desc: "Ramah pengguna, cocok untuk pemula", color: "orange", logo: "🝠" },
    { id: "debian", name: "Debian", desc: "Stabil dan handal", color: "red", logo: "🌀" },
    { id: "fedora", name: "Fedora", desc: "Fitur terbaru dan mutakhir", color: "blue", logo: "🎩" },
    { id: "arch", name: "Arch Linux", desc: "Minimalis dan dapat dikustomisasi", color: "cyan", logo: "🔷" },
    { id: "kali", name: "Kali Linux", desc: "Pengujian keamanan & penetrasi", color: "purple", logo: "🐲" },
    { id: "centos", name: "CentOS", desc: "Stabilitas tingkat enterprise", color: "green", logo: "📊" },
  ];

  const windowsEditions = [
    { id: "home", name: "Windows 11 Home", desc: "Untuk penggunaan pribadi dan keluarga", icon: "🏠" },
    { id: "pro", name: "Windows 11 Pro", desc: "Fitur bisnis dan keamanan lanjutan", icon: "💼" },
    { id: "ltsc", name: "Windows 11 LTSC", desc: "Long-term support untuk enterprise", icon: "🏢" },
    { id: "server", name: "Windows Server 2022", desc: "Sistem operasi server enterprise", icon: "🖥️" },
  ];

  const handleSelectOS = (os: "windows" | "linux") => {
    setSelectedOS(os);
    if (os === "linux") {
      setStep("linux-distro");
      addLog("Memilih distribusi Linux...");
    } else {
      setStep("windows-edition");
      addLog("Memilih edisi Windows...");
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

  const handleSelectWindowsEdition = (edition: string) => {
    addLog(`Memulai instalasi ${edition}...`);
    setTimeout(() => {
      addLog(`${edition} berhasil diinstal.`);
      onComplete("windows", edition);
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0d1b2a]/95 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl shadow-cyan-500/20"
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
          Fase 2: Instalasi Sistem Operasi
        </h2>
        <p className="text-cyan-300/70 text-sm mb-6 font-mono">
          Sistem Operasi // Pilih OS yang diinginkan
        </p>

        <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 flex items-start gap-3 mb-6">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-cyan-300">
            <p className="font-semibold mb-2">Tentang Sistem Operasi:</p>
            <p className="text-cyan-400">
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
            >
              <div className="grid grid-cols-2 gap-4">
              {/* Windows Option */}
              <motion.button
                onClick={() => handleSelectOS("windows")}
                className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-6 text-center group hover:border-blue-400/70 hover:bg-blue-900/30 transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Monitor className="w-16 h-16 text-blue-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-blue-400 mb-2">Windows</h3>
                <p className="text-xs text-cyan-300/70 mb-3">
                  Interface grafis yang ramah pengguna dengan dukungan aplikasi luas.
                </p>
                <ul className="text-xs text-cyan-400/50 text-left space-y-1">
                  <li>• Desktop GUI</li>
                  <li>• Software Kompatibel</li>
                  <li>• Mudah Digunakan</li>
                </ul>
              </motion.button>

              {/* Linux Option */}
              <motion.button
                onClick={() => handleSelectOS("linux")}
                className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-6 text-center group hover:border-cyan-400/70 hover:bg-blue-900/30 transition-all duration-200"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Terminal className="w-16 h-16 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Linux</h3>
                <p className="text-xs text-cyan-300/70 mb-3">
                  Open-source dengan kontrol penuh melalui terminal dan akses kernel.
                </p>
                <ul className="text-xs text-cyan-400/50 text-left space-y-1">
                  <li>• Antarmuka Baris Perintah</li>
                  <li>• Sumber Terbuka</li>
                  <li>• Kontrol Penuh</li>
                </ul>
                <ChevronRight className="w-5 h-5 text-cyan-400 mx-auto mt-2" />
              </motion.button>
              </div>
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
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  ← Kembali
                </button>
                <h3 className="text-lg font-bold text-cyan-400">
                  Pilih Distribusi Linux
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {linuxDistros.map((distro) => (
                  <motion.button
                    key={distro.id}
                    onClick={() => handleSelectDistro(distro.name)}
                    className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-left group hover:border-cyan-400/70 hover:bg-blue-900/30 transition-all duration-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{distro.logo}</span>
                      <Terminal className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h4 className="text-sm font-bold text-cyan-300 mb-1">
                      {distro.name}
                    </h4>
                    <p className="text-xs text-cyan-300/70">{distro.desc}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "windows-edition" && (
            <motion.div
              key="windows-edition"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() => setStep("select")}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  ← Kembali
                </button>
                <h3 className="text-lg font-bold text-blue-400">
                  Pilih Edisi Windows
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {windowsEditions.map((edition) => (
                  <motion.button
                    key={edition.id}
                    onClick={() => handleSelectWindowsEdition(edition.name)}
                    className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-left group hover:border-blue-400/70 hover:bg-blue-900/30 transition-all duration-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{edition.icon}</span>
                      <Monitor className="w-6 h-6 text-blue-400" />
                    </div>
                    <h4 className="text-sm font-bold text-cyan-300 mb-1">
                      {edition.name}
                    </h4>
                    <p className="text-xs text-cyan-300/70">{edition.desc}</p>
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
