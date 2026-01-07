"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Monitor, Terminal, ChevronRight, HardDrive, Check, Loader2, Play, Circle, Disc, User, Lock, Wand2, Cpu } from "lucide-react";
import { OSType } from "@/app/page";
import { useState, useEffect } from "react";

interface OSModalProps {
  onClose: () => void;
  onComplete: (os: OSType, distro?: string) => void;
  addLog: (message: string) => void;
  storageSize: string;
}

type InstallStep = "boot" | "select-os" | "distro-edition" | "partition" | "manual-partition" | "network-config" | "installing" | "user-setup" | "finish";

export default function OSModal({ onClose, onComplete, addLog, storageSize }: OSModalProps) {
  const [step, setStep] = useState<InstallStep>("boot");
  const [selectedOS, setSelectedOS] = useState<"windows" | "linux" | null>(null);
  const [selectedDistro, setSelectedDistro] = useState<string>("");
  const [installProgress, setInstallProgress] = useState(0);
  const [installStatus, setInstallStatus] = useState("Initializing...");
  const [partitionMode, setPartitionMode] = useState<"auto" | "manual">("auto");
  const [partitions, setPartitions] = useState<{ id: string; name: string; size: number; type: string; mount: string }[]>([]);
  const [totalStorage, setTotalStorage] = useState(512); // GB

  // Network Config
  const [netConfigMode, setNetConfigMode] = useState<"dhcp" | "static">("dhcp");
  const [hostname, setHostname] = useState("virtual-pc");
  const [ipv6Enabled, setIpv6Enabled] = useState(false);
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [ipConfig, setIpConfig] = useState({ ip: "192.168.1.10", mask: "255.255.255.0", gateway: "192.168.1.1", dns: "8.8.8.8" });
  const [ipv6Config, setIpv6Config] = useState({ ip: "fe80::1", prefix: "64", gateway: "fe80::2" });
  const [proxyConfig, setProxyConfig] = useState({ address: "", port: "8080" });


  // User config
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");

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

  // Auto Config Function
  const handleAutoConfig = () => {
    addLog("⚡ Auto Config dijalankan: Memilih konfigurasi rekomendasi...");
    // Default to Windows 11 Pro
    setSelectedOS("windows");
    setSelectedDistro("Windows 11 Pro");
    setPartitionMode("auto");
    setUsername("user");
    setPassword("password");

    // Simulate rapid progression
    setStep("installing");
  };

  const handleSelectOS = (os: "windows" | "linux") => {
    setSelectedOS(os);
    setStep("distro-edition");
    addLog(`Memilih tipe OS: ${os === "windows" ? "Microsoft Windows" : "Linux / Unix"}`);
  };

  const handleSelectDistro = (distro: string) => {
    setSelectedDistro(distro);
    setStep("partition");
    addLog(`Versi OS dipilih: ${distro}`);
  };

  const startInstall = () => {
    if (partitionMode === "manual") {
      setStep("manual-partition");
    } else {
      setStep("network-config");
    }
    // addLog("Memulai proses instalasi..."); // Moved to actual install start
  };

  const confirmInstall = () => {
    setStep("installing");
    addLog("Memulai proses instalasi...");
  }

  useEffect(() => {
    if (step === "installing") {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 5;
        if (progress > 100) progress = 100;

        setInstallProgress(Math.floor(progress));

        if (progress < 20) setInstallStatus("Copying files...");
        else if (progress < 50) setInstallStatus("Expanding files...");
        else if (progress < 75) setInstallStatus("Installing features...");
        else if (progress < 90) setInstallStatus("Installing updates...");
        else setInstallStatus("Finishing up...");

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setStep("user-setup");
          }, 500);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleFinish = () => {
    addLog(`✓ ${selectedDistro} berhasil diinstal.`);
    onComplete(selectedOS!, selectedDistro);
    onClose();
  };

  // BIOS Boot Screen (Dark terminal style fits the theme well, just adding cyan tint)
  if (step === "boot") {
    // Auto-advance boot screen
    setTimeout(() => setStep("select-os"), 2000);

    return (
      <div className="fixed inset-0 bg-[#0a1628] z-50 flex flex-col items-center justify-center font-mono text-cyan-500 p-10 cursor-none">
        <div className="w-full max-w-3xl border border-cyan-500/30 p-8 rounded-lg shadow-[0_0_50px_rgba(34,211,238,0.1)]">
          <div className="flex justify-between mb-8 text-sm text-cyan-500/50">
            <span>Virtual Lab BIOS v2.1</span>
            <span>System Date: 01/05/2026</span>
          </div>
          <div className="mb-8 space-y-2">
            <p>CPU: Virtual Core Processor @ 3.00GHz</p>
            <p>Memory: OK</p>
            <p>Storage: Detected ({storageSize})</p>
          </div>
          <div className="mb-4 space-y-1">
            <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Initializing Hardware...</p>
            <p className="flex items-center gap-2"><span className="text-emerald-400">✓</span> Loading Bootloader...</p>
            <p className="animate-pulse text-cyan-300">_</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0d1b2a]/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl max-w-4xl w-full h-[600px] relative shadow-2xl shadow-cyan-500/20 overflow-hidden flex flex-col"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Animated Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />

        {/* Top Bar / Auto Config */}
        <div className="relative z-20 flex justify-between items-center p-6 border-b border-cyan-500/20 bg-gradient-to-r from-blue-950/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center">
              <Monitor className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-cyan-400 tracking-wide font-mono">
                OS INSTALLER
              </h2>
              <p className="text-xs text-cyan-500/50 font-mono">
                STEP: {step.toUpperCase().replace("-", " ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {step !== "installing" && step !== "finish" && (
              <button
                onClick={handleAutoConfig}
                className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 text-purple-300 rounded-lg text-xs font-mono font-bold hover:bg-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all flex items-center gap-2 group"
              >
                <Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                AUTO CONFIG
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-cyan-500/10 text-cyan-500/70 hover:text-cyan-400 transition-colors border border-transparent hover:border-cyan-500/30"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col p-8 relative z-10 overflow-hidden">

          {/* Step: Select OS */}
          {step === "select-os" && (
            <div className="h-full flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-cyan-300 mb-8 font-mono tracking-tight">
                &lt; SELECT OPERATING SYSTEM &gt;
              </h2>
              <div className="flex gap-6">
                <motion.button
                  onClick={() => handleSelectOS("windows")}
                  className="w-56 h-64 bg-blue-950/30 border border-cyan-500/20 hover:border-cyan-400 hover:bg-blue-900/40 rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-all group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Monitor className="w-20 h-20 text-cyan-500 group-hover:text-cyan-300 transition-colors" />
                  <div className="text-center">
                    <span className="font-bold text-lg text-cyan-300 block mb-1">WINDOWS</span>
                    <span className="text-xs text-cyan-500/60 font-mono">GUI Based System</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => handleSelectOS("linux")}
                  className="w-56 h-64 bg-blue-950/30 border border-cyan-500/20 hover:border-cyan-400 hover:bg-blue-900/40 rounded-xl p-6 flex flex-col items-center justify-center gap-4 transition-all group relative overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Terminal className="w-20 h-20 text-emerald-500 group-hover:text-emerald-300 transition-colors" />
                  <div className="text-center">
                    <span className="font-bold text-lg text-emerald-300 block mb-1">LINUX</span>
                    <span className="text-xs text-emerald-500/60 font-mono">CLI Based System</span>
                  </div>
                </motion.button>
              </div>
            </div>
          )}

          {/* Step: Select Distro/Edition */}
          {step === "distro-edition" && (
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold text-cyan-300 mb-6 font-mono flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-cyan-500" />
                SELECT {selectedOS === "windows" ? "EDITION" : "DISTRIBUTION"}
              </h2>
              <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                {selectedOS === "windows" ? (
                  windowsEditions.map(ed => (
                    <motion.button
                      key={ed.id}
                      onClick={() => handleSelectDistro(ed.name)}
                      className="flex items-start gap-4 p-4 border border-cyan-500/20 bg-blue-950/20 rounded-lg hover:bg-blue-900/40 hover:border-cyan-400/50 text-left transition-all group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="p-2 bg-blue-500/10 rounded border border-blue-500/30">
                        <Monitor className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold text-cyan-300 group-hover:text-cyan-200">{ed.name}</div>
                        <div className="text-xs text-cyan-500/60 font-mono mt-1">{ed.desc}</div>
                      </div>
                    </motion.button>
                  ))
                ) : (
                  linuxDistros.map(dist => (
                    <motion.button
                      key={dist.id}
                      onClick={() => handleSelectDistro(dist.name)}
                      className="flex items-start gap-4 p-4 border border-cyan-500/20 bg-blue-950/20 rounded-lg hover:bg-blue-900/40 hover:border-cyan-400/50 text-left transition-all group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/30">
                        <span className="text-xl">{dist.logo}</span>
                      </div>
                      <div>
                        <div className="font-bold text-cyan-300 group-hover:text-cyan-200">{dist.name}</div>
                        <div className="text-xs text-cyan-500/60 font-mono mt-1">{dist.desc}</div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setStep("select-os")}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all"
                >
                  BACK
                </button>
              </div>
            </div>
          )}

          {/* Step: Partitioning */}
          {step === "partition" && (
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold text-cyan-300 mb-6 font-mono flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-cyan-500" />
                DISK CONFIGURATION
              </h2>

              <div className="flex-1 border border-cyan-500/20 bg-blue-950/20 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-cyan-500/10">
                  <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30 animate-pulse">
                    <HardDrive className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-cyan-300/90">DISK 0: Unallocated Space</h3>
                    <p className="text-cyan-500/60 font-mono text-sm">Capacity: {storageSize}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${partitionMode === "auto" ? "bg-cyan-500/10 border-cyan-500/50" : "bg-transparent border-cyan-500/10 hover:border-cyan-500/30"}`}>
                    <input
                      type="radio"
                      name="partition"
                      checked={partitionMode === "auto"}
                      onChange={() => setPartitionMode("auto")}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold text-cyan-300">Clean Install (Recommended)</div>
                      <div className="text-xs text-cyan-500/60 mt-1">
                        Automatically format drive and create required partitions for {selectedDistro}.
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all ${partitionMode === "manual" ? "bg-cyan-500/10 border-cyan-500/50" : "bg-transparent border-cyan-500/10 hover:border-cyan-500/30"}`}>
                    <input
                      type="radio"
                      name="partition"
                      checked={partitionMode === "manual"}
                      onChange={() => setPartitionMode("manual")}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-bold text-cyan-300">Manual Partitioning</div>
                      <div className="text-xs text-cyan-500/60 mt-1">
                        Advanced users only. Create partitions manually.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setStep("distro-edition")}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={startInstall}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-blue-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 transition-all font-mono"
                >
                  START INSTALLATION_
                </button>
              </div>
            </div>
          )}

          {/* Step: Manual Partitioning */}
          {step === "manual-partition" && (
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold text-cyan-300 mb-6 font-mono flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-cyan-500" />
                MANUAL PARTITIONING
              </h2>

              <div className="flex-1 overflow-y-auto">
                {/* Disk Bar Visualization */}
                <div className="mb-8">
                  <div className="flex justify-between text-sm text-cyan-500/60 mb-2 font-mono">
                    <span>DISK 0 ({totalStorage} GB)</span>
                    <span>{Math.max(0, totalStorage - partitions.reduce((acc, p) => acc + p.size, 0))} GB FREE</span>
                  </div>
                  <div className="w-full h-12 bg-blue-950/40 border border-cyan-500/30 rounded flex overflow-hidden">
                    {partitions.map((p) => (
                      <div
                        key={p.id}
                        style={{ width: `${(p.size / totalStorage) * 100}%` }}
                        className="h-full border-r border-black/50 hover:opacity-80 transition-opacity cursor-pointer relative group"
                        title={`${p.name} (${p.size} GB)`}
                      >
                        <div className={`w-full h-full ${p.type === 'swap' ? 'bg-yellow-600/60' : p.mount === '/' ? 'bg-cyan-600/60' : 'bg-blue-600/60'}`} />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white shadow-black drop-shadow-md truncate px-1">
                          {p.name}
                        </span>
                      </div>
                    ))}
                    <div className="flex-1 bg-stripes-cyan opacity-10" />
                  </div>
                </div>

                {/* Partition Table */}
                <div className="border border-cyan-500/20 rounded-lg overflow-hidden mb-4">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-blue-950/40 text-cyan-400 font-mono">
                      <tr>
                        <th className="p-3">Name</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Mount Point</th>
                        <th className="p-3">Size (GB)</th>
                        <th className="p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-cyan-500/10">
                      {partitions.map((p) => (
                        <tr key={p.id} className="hover:bg-cyan-500/5">
                          <td className="p-3 font-bold text-cyan-300">{p.name}</td>
                          <td className="p-3 text-cyan-500/80">{p.type}</td>
                          <td className="p-3 text-cyan-500/80 font-mono">{p.mount}</td>
                          <td className="p-3 text-cyan-500/80">{p.size} GB</td>
                          <td className="p-3">
                            <button
                              onClick={() => setPartitions(partitions.filter(x => x.id !== p.id))}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {partitions.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-cyan-500/40 italic">
                            No partitions created. System cannot find a valid installation target.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Add Partition Controls */}
                <div className="grid grid-cols-4 gap-4 bg-blue-950/20 p-4 rounded-lg border border-cyan-500/10">
                  <input type="text" placeholder="Name (e.g. System)" className="bg-black/20 border border-cyan-500/20 rounded px-3 py-2 text-sm text-cyan-300 focus:border-cyan-500 outline-none" id="new-p-name" />
                  <select className="bg-black/20 border border-cyan-500/20 rounded px-3 py-2 text-sm text-cyan-300 focus:border-cyan-500 outline-none" id="new-p-type">
                    <option value="ext4">EXT4 (Linux)</option>
                    <option value="ntfs">NTFS (Windows)</option>
                    <option value="swap">SWAP</option>
                    <option value="fat32">FAT32 (EFI)</option>
                  </select>
                  <input type="number" placeholder="Size (GB)" className="bg-black/20 border border-cyan-500/20 rounded px-3 py-2 text-sm text-cyan-300 focus:border-cyan-500 outline-none" id="new-p-size" />
                  <button
                    onClick={() => {
                      const nameInput = document.getElementById('new-p-name') as HTMLInputElement;
                      const typeInput = document.getElementById('new-p-type') as HTMLSelectElement;
                      const sizeInput = document.getElementById('new-p-size') as HTMLInputElement;

                      const size = parseInt(sizeInput.value);
                      const currentUsed = partitions.reduce((acc, p) => acc + p.size, 0);

                      if (nameInput.value && size > 0 && (currentUsed + size <= totalStorage)) {
                        setPartitions([...partitions, {
                          id: Math.random().toString(),
                          name: nameInput.value,
                          type: typeInput.value,
                          mount: typeInput.value === 'swap' ? '[SWAP]' : '/', // Simplified logic
                          size: size
                        }]);
                        nameInput.value = '';
                        sizeInput.value = '';
                      }
                    }}
                    className="bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 rounded font-bold text-sm transition-colors border border-cyan-500/30"
                  >
                    ADD PARTITION
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-cyan-500/10">
                <button
                  onClick={() => setStep("partition")}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={() => setStep("network-config")}
                  disabled={partitions.length === 0}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-blue-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  NEXT: NETWORK
                </button>
              </div>
            </div>
          )}

          {/* Step: Network Config */}
          {step === "network-config" && (
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-bold text-cyan-300 mb-6 font-mono flex items-center gap-2">
                <ChevronRight className="w-5 h-5 text-cyan-500" />
                NETWORK CONFIGURATION
              </h2>

              <div className="flex-1 overflow-y-auto pr-2">
                <div className="border border-cyan-500/20 bg-blue-950/20 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                      <div className="flex gap-1">
                        <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }} />
                        <div className="w-1 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-cyan-300/90">Ethernet Adapter (eth0)</h3>
                      <p className="text-cyan-500/60 font-mono text-sm">MAC: 00:0C:29:8A:6C:8D</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-6 p-1 bg-black/40 rounded-lg w-fit">
                    <button
                      onClick={() => setNetConfigMode("dhcp")}
                      className={`px-4 py-2 rounded text-sm font-bold transition-all ${netConfigMode === 'dhcp' ? 'bg-cyan-500 text-blue-950 shadow-lg shadow-cyan-500/20' : 'text-cyan-500/50 hover:text-cyan-400'}`}
                    >
                      DHCP (Automatic)
                    </button>
                    <button
                      onClick={() => setNetConfigMode("static")}
                      className={`px-4 py-2 rounded text-sm font-bold transition-all ${netConfigMode === 'static' ? 'bg-cyan-500 text-blue-950 shadow-lg shadow-cyan-500/20' : 'text-cyan-500/50 hover:text-cyan-400'}`}
                    >
                      Static IP
                    </button>
                  </div>

                  {/* Hostname Config */}
                  <div className="mb-6 space-y-2">
                    <label className="text-xs font-bold text-cyan-500 uppercase">Hostname / Computer Name</label>
                    <input
                      value={hostname}
                      onChange={(e) => setHostname(e.target.value)}
                      className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono"
                      placeholder="virtual-pc"
                    />
                  </div>

                  {netConfigMode === "dhcp" ? (
                    <div className="p-6 border border-dashed border-cyan-500/20 rounded bg-cyan-500/5 text-center mb-6">
                      <p className="text-cyan-300 font-mono mb-2">Obtaining IP address automatically...</p>
                      <p className="text-xs text-cyan-500/50">System will query the DHCP server for configuration.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-500 uppercase">IP Address (IPv4)</label>
                        <input
                          value={ipConfig.ip}
                          onChange={(e) => setIpConfig({ ...ipConfig, ip: e.target.value })}
                          className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-500 uppercase">Subnet Mask</label>
                        <input
                          value={ipConfig.mask}
                          onChange={(e) => setIpConfig({ ...ipConfig, mask: e.target.value })}
                          className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-500 uppercase">Default Gateway</label>
                        <input
                          value={ipConfig.gateway}
                          onChange={(e) => setIpConfig({ ...ipConfig, gateway: e.target.value })}
                          className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-cyan-500 uppercase">DNS Server</label>
                        <input
                          value={ipConfig.dns}
                          onChange={(e) => setIpConfig({ ...ipConfig, dns: e.target.value })}
                          className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* IPv6 Toggle & Config */}
                  <div className="mb-6 border-t border-cyan-500/10 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-cyan-300">IPv6 Configuration</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={ipv6Enabled} onChange={() => setIpv6Enabled(!ipv6Enabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-blue-900/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                    {ipv6Enabled && (
                      <div className="grid grid-cols-2 gap-6 bg-black/10 p-4 rounded-lg">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-cyan-500 uppercase">IPv6 Address</label>
                          <input
                            value={ipv6Config.ip}
                            onChange={(e) => setIpv6Config({ ...ipv6Config, ip: e.target.value })}
                            className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-cyan-500 uppercase">Prefix Length</label>
                          <input
                            value={ipv6Config.prefix}
                            onChange={(e) => setIpv6Config({ ...ipv6Config, prefix: e.target.value })}
                            className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Proxy Config */}
                  <div className="mb-2 border-t border-cyan-500/10 pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-cyan-300">Network Proxy</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={proxyEnabled} onChange={() => setProxyEnabled(!proxyEnabled)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-blue-900/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                      </label>
                    </div>
                    {proxyEnabled && (
                      <div className="grid grid-cols-3 gap-4 bg-black/10 p-4 rounded-lg">
                        <div className="col-span-2 space-y-2">
                          <label className="text-xs font-bold text-cyan-500 uppercase">Proxy Address</label>
                          <input
                            value={proxyConfig.address}
                            onChange={(e) => setProxyConfig({ ...proxyConfig, address: e.target.value })}
                            className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono text-sm"
                            placeholder="http://proxy.example.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-cyan-500 uppercase">Port</label>
                          <input
                            value={proxyConfig.port}
                            onChange={(e) => setProxyConfig({ ...proxyConfig, port: e.target.value })}
                            className="w-full bg-black/20 border border-cyan-500/30 rounded px-3 py-2 text-cyan-300 focus:border-cyan-400 outline-none font-mono text-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-cyan-500/10">
                <button
                  onClick={() => setStep(partitionMode === 'manual' ? "manual-partition" : "partition")}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-cyan-500/70 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all"
                >
                  BACK
                </button>
                <button
                  onClick={confirmInstall}
                  className="px-6 py-2 rounded-lg text-sm font-bold text-blue-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 transition-all font-mono"
                >
                  START INSTALLATION_
                </button>
              </div>
            </div>
          )}

          {step === "installing" && (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="w-24 h-24 relative mb-8">
                <svg className="w-full h-full animate-spin text-cyan-500/20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-cyan-400 font-mono">{installProgress}%</span>
                </div>
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    stroke="#22d3ee"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * installProgress) / 100}
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
              </div>

              <h3 className="text-xl font-bold text-cyan-300 mb-2 animate-pulse">
                INSTALLING {selectedDistro.toUpperCase()}...
              </h3>
              <p className="text-cyan-500/60 font-mono text-sm mb-8">
                {installStatus}
              </p>

              <div className="w-full max-w-md bg-blue-950/30 rounded-lg p-4 border border-cyan-500/20 font-mono text-xs text-cyan-400/80 h-32 overflow-hidden flex flex-col-reverse">
                <p>&gt; {installStatus}</p>
                <p>&gt; Copying system files...</p>
                <p>&gt; Formatting Disk 0 partition 1...</p>
                <p>&gt; Initializing setup agent...</p>
              </div>
            </div>
          )}

          {/* Step: User Setup */}
          {step === "user-setup" && (
            <div className="h-full flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-cyan-300 mb-2 font-mono">
                CREATE USER ACCOUNT
              </h2>
              <p className="text-cyan-500/60 text-sm mb-8">Set up your local administrator account</p>

              <div className="w-full max-w-md p-8 rounded-xl bg-blue-950/30 border border-cyan-500/20 shadow-lg shadow-black/20">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">Username</label>
                    <div className="relative group">
                      <User className="absolute left-3 top-2.5 w-5 h-5 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-blue-900/20 border border-cyan-500/30 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 focus:bg-blue-900/30 transition-all font-mono text-sm"
                        placeholder="Administrator"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cyan-400 mb-2 uppercase tracking-wider">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-2.5 w-5 h-5 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-blue-900/20 border border-cyan-500/30 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 focus:bg-blue-900/30 transition-all font-mono text-sm"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleFinish}
                    className="w-full py-3 rounded-lg font-bold text-blue-950 bg-cyan-400 hover:bg-cyan-300 shadow-lg shadow-cyan-500/20 mt-4 transition-all active:scale-95 font-mono flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    COMPLETE SETUP
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </motion.div >
  );
}
