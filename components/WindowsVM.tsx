"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minimize2, Maximize2, Chrome, Loader2, Folder, Settings as SettingsIcon, Monitor, Wifi, Share2, Server, CheckCircle2, HardDrive } from "lucide-react";
import { useState } from "react";

interface WindowsVMProps {
  onClose: () => void;
  networkConnected: boolean;
  onOpenBrowser: () => void;
  browserOpen: boolean;
  ipAddress?: string;
  edition?: string;
  hardware?: {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
  };
  performanceMetrics?: {
    overall: number;
    cpuScore: number;
    ramScore: number;
    storageScore: number;
    gpuScore: number;
    hardwareDetails?: any;
  };
  sharedFiles?: { name: string; size: string; source: string }[];
  onShareFile?: (file: { name: string; size: string; source: string }) => void;
  computerName?: string;
}

export default function WindowsVM({
  onClose,
  networkConnected,
  onOpenBrowser,
  browserOpen,
  ipAddress,
  edition = "Windows 11 Pro",
  hardware,
  performanceMetrics,
  sharedFiles = [],
  onShareFile,
  computerName = "Windows-VM"
}: WindowsVMProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [browserUrl, setBrowserUrl] = useState("https://www.google.com");
  const [isLoading, setIsLoading] = useState(false);
  const [activeApp, setActiveApp] = useState<"desktop" | "settings" | "task-manager">("desktop");
  const [cpuUsage] = useState(Math.floor(Math.random() * 30) + 10);
  const [ramUsage] = useState(Math.floor(Math.random() * 40) + 30);
  const [browserContent, setBrowserContent] = useState("google");
  const [searchQuery, setSearchQuery] = useState("");

  // File Sharing & Settings
  const [fileSharingEnabled, setFileSharingEnabled] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [explorerPath, setExplorerPath] = useState("This PC");
  const [activeWindow, setActiveWindow] = useState<"browser" | "settings" | "explorer" | null>(null);

  const handleOpenApp = (app: "browser" | "settings" | "explorer") => {
    if (app === "browser") { onOpenBrowser(); setActiveWindow("browser"); }
    if (app === "settings") { setSettingsOpen(true); setActiveWindow("settings"); }
    if (app === "explorer") { setExplorerOpen(true); setActiveWindow("explorer"); }
  };

  const handleBrowserNavigate = (url?: string) => {
    const targetUrl = url || browserUrl;
    setIsLoading(true);

    // Determine content based on URL
    if (targetUrl.includes("google") || targetUrl === "https://www.google.com") {
      setBrowserContent("google");
    } else if (targetUrl.includes("youtube")) {
      setBrowserContent("youtube");
    } else if (targetUrl.includes("github")) {
      setBrowserContent("github");
    } else if (targetUrl.includes("localhost") || targetUrl.includes(ipAddress || "")) {
      setBrowserContent("localhost");
    } else {
      setBrowserContent("external");
    }

    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setBrowserUrl(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`);
      setBrowserContent("search-results");
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`bg-gradient-to-br from-[#0d1b2a] to-[#0a1628] border-2 border-cyan-500/30 rounded-lg shadow-2xl shadow-cyan-500/10 overflow-hidden ${isMaximized ? "w-full h-full" : "w-[90%] h-[90%] max-w-6xl"
          }`}
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        layout
      >
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-10 flex items-center justify-between px-4 select-none">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/30 rounded" />
            <span className="text-white text-sm font-semibold">{edition} - Mesin Virtual</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-8 h-8 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
            >
              {isMaximized ? (
                <Minimize2 className="w-4 h-4 text-white" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Desktop */}
        <div
          className="h-[calc(100%-6.5rem)] bg-cover bg-center p-8 relative"
          style={{ backgroundImage: "url('/w11wallpaper.png')" }}
        >
          {/* Desktop Icons */}
          <div className="flex flex-col gap-4">
            <motion.button
              onClick={() => handleOpenApp("explorer")}
              className="w-20 flex flex-col items-center gap-1 hover:bg-white/10 p-2 rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📁</span>
              </div>
              <span className="text-white text-xs text-center">This PC</span>
            </motion.button>

            {networkConnected && (
              <motion.button
                onClick={onOpenBrowser}
                className="w-20 flex flex-col items-center gap-1 hover:bg-white/10 p-2 rounded"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                  <Chrome className="w-7 h-7 text-white" />
                </div>
                <span className="text-white text-xs text-center">Browser</span>
              </motion.button>
            )}

            <motion.button
              onClick={() => handleOpenApp("settings")}
              className="w-20 flex flex-col items-center gap-1 hover:bg-white/10 p-2 rounded"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-12 h-12 bg-slate-500 rounded-lg flex items-center justify-center">
                <SettingsIcon className="w-7 h-7 text-white" />
              </div>
              <span className="text-white text-xs text-center">Settings</span>
            </motion.button>
          </div>

          {/* System Info Widget */}
          <div className="absolute bottom-4 right-4 card rounded-lg p-4 w-72">
            <h3 className="text-white font-bold mb-2 text-sm">Info Sistem</h3>
            <div className="text-xs text-white/80 space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-white/60">OS:</span>
                <span className="text-blue-400">{edition}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Status:</span>
                <span className="text-emerald-400">Berjalan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">CPU:</span>
                <span className="text-yellow-400">{cpuUsage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">RAM:</span>
                <span className="text-cyan-400">{ramUsage}%</span>
              </div>
              {networkConnected && ipAddress && (
                <div className="flex justify-between pt-1 border-t border-white/10">
                  <span className="text-white/60">Jaringan:</span>
                  <span className="text-emerald-400">Terhubung ({ipAddress})</span>
                </div>
              )}
            </div>
          </div>

          {/* Settings Window */}
          <AnimatePresence>
            {settingsOpen && (
              <motion.div
                className="absolute inset-20 bg-[#1e293b] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-600 z-20"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                drag
                dragMomentum={false}
                onClick={() => setActiveWindow("settings")}
              >
                <div className="bg-[#0f172a] p-4 flex justify-between items-center select-none cursor-move">
                  <span className="text-white font-semibold flex items-center gap-2"><SettingsIcon className="w-4 h-4" /> Settings</span>
                  <button onClick={() => setSettingsOpen(false)} className="hover:bg-red-500/20 p-1 rounded text-slate-400 hover:text-red-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex-1 flex">
                  <div className="w-48 bg-[#0f172a]/50 p-4 space-y-2 border-r border-slate-700">
                    <div className="bg-blue-600/20 text-blue-400 p-2 rounded text-sm font-semibold flex items-center gap-2">
                      <Wifi className="w-4 h-4" /> Network
                    </div>
                    <div className="text-slate-400 p-2 rounded text-sm hover:bg-slate-800 cursor-pointer flex items-center gap-2">
                      <Monitor className="w-4 h-4" /> System
                    </div>
                  </div>
                  <div className="flex-1 p-8 text-slate-200">
                    <h2 className="text-2xl font-bold mb-6">Network & Internet</h2>

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2"><Share2 className="w-5 h-5 text-emerald-400" /> File Sharing</h3>
                          <p className="text-slate-400 text-sm mt-1">Allow other devices on the network to discover this PC and access shared folders.</p>
                        </div>
                        <button
                          onClick={() => setFileSharingEnabled(!fileSharingEnabled)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${fileSharingEnabled ? 'bg-blue-500' : 'bg-slate-600'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${fileSharingEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      {fileSharingEnabled && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50 text-sm text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> This PC is now discoverable as "{computerName}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* File Explorer Window */}
          <AnimatePresence>
            {explorerOpen && (
              <motion.div
                className="absolute inset-16 bg-[#1e293b] rounded-lg shadow-2xl flex flex-col overflow-hidden border border-slate-600 z-10"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                drag
                dragMomentum={false}
                onClick={() => setActiveWindow("explorer")}
              >
                <div className="bg-[#0f172a] p-3 flex justify-between items-center select-none cursor-move border-b border-slate-700">
                  <span className="text-white font-semibold flex items-center gap-2"><Folder className="w-4 h-4 text-yellow-500" /> File Explorer</span>
                  <button onClick={() => setExplorerOpen(false)} className="hover:bg-red-500/20 p-1 rounded text-slate-400 hover:text-red-400"><X className="w-4 h-4" /></button>
                </div>
                <div className="bg-[#334155] p-2 flex items-center gap-2 border-b border-slate-700">
                  <button className="text-slate-400 hover:bg-slate-600 p-1 rounded">←</button>
                  <button className="text-slate-400 hover:bg-slate-600 p-1 rounded">→</button>
                  <div className="flex-1 bg-[#1e293b] border border-slate-600 rounded px-3 py-1 text-sm text-slate-300 font-mono">
                    {explorerPath}
                  </div>
                </div>
                <div className="flex-1 flex">
                  <div className="w-48 bg-[#0f172a]/30 p-2 space-y-1 border-r border-slate-700 text-sm">
                    <button onClick={() => setExplorerPath("This PC")} className={`w-full text-left p-2 rounded flex items-center gap-2 ${explorerPath === "This PC" ? "bg-blue-600/20 text-blue-400" : "text-slate-300 hover:bg-slate-700"}`}>
                      <Monitor className="w-4 h-4" /> This PC
                    </button>
                    <button onClick={() => setExplorerPath("Network")} className={`w-full text-left p-2 rounded flex items-center gap-2 ${explorerPath === "Network" ? "bg-blue-600/20 text-blue-400" : "text-slate-300 hover:bg-slate-700"}`}>
                      <Wifi className="w-4 h-4" /> Network
                    </button>
                  </div>
                  <div className="flex-1 p-4 text-slate-200">
                    {explorerPath === "This PC" ? (
                      <div className="grid grid-cols-4 gap-4">
                        <div className="p-4 hover:bg-slate-700/50 rounded flex flex-col items-center gap-2 cursor-pointer border border-transparent hover:border-slate-600">
                          <HardDrive className="w-12 h-12 text-slate-400" />
                          <span className="text-sm text-center">Local Disk (C:)</span>
                          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ) : explorerPath === "Network" ? (
                      <div className="space-y-4">
                        {fileSharingEnabled && networkConnected ? (
                          <>
                            <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Computers (2)</h3>
                            <div className="grid grid-cols-4 gap-4 mb-6">
                              <div className="p-4 hover:bg-blue-600/10 rounded flex flex-col items-center gap-2 cursor-pointer border border-transparent hover:border-blue-500/30">
                                <Monitor className="w-12 h-12 text-blue-400" />
                                <span className="text-sm text-center font-semibold">{computerName}</span>
                                <span className="text-xs text-emerald-400">(This PC)</span>
                              </div>
                              <div className="p-4 hover:bg-blue-600/10 rounded flex flex-col items-center gap-2 cursor-pointer border border-transparent hover:border-blue-500/30">
                                <Monitor className="w-12 h-12 text-slate-400" />
                                <span className="text-sm text-center">FILE-SERVER</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-sm font-bold text-slate-400 uppercase">Shared Files</h3>
                              <button
                                onClick={() => onShareFile?.({ name: `doc_${Math.floor(Math.random() * 1000)}.docx`, size: "1.2 MB", source: computerName })}
                                className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white flex items-center gap-1"
                              >
                                <Share2 className="w-3 h-3" /> Share File
                              </button>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                              {sharedFiles.map((file, idx) => (
                                <div key={idx} className="p-4 hover:bg-slate-700/50 rounded flex flex-col items-center gap-2 cursor-pointer border border-transparent hover:border-slate-600 group">
                                  <div className="relative">
                                    <Folder className="w-12 h-12 text-blue-300 group-hover:text-blue-400" />
                                    <div className="absolute -bottom-1 -right-1 bg-white text-blue-600 rounded-full p-0.5 shadow-sm">
                                      <Share2 className="w-3 h-3" />
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <span className="text-sm text-center truncate w-24">{file.name}</span>
                                    <span className="text-xs text-slate-500">{file.size} • {file.source}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-48 text-slate-500">
                            <Wifi className="w-12 h-12 mb-2 opacity-50" />
                            <p>Network discovery is turned off.</p>
                            <button onClick={() => { setSettingsOpen(true); setActiveWindow("settings") }} className="text-blue-400 hover:underline mt-1">Turn on Network Discovery</button>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Browser Window */}
          <AnimatePresence>
            {browserOpen && (
              <motion.div
                className="absolute inset-8 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                drag
                dragMomentum={false}
              >
                {/* Browser Title Bar */}
                <div className="bg-slate-900 h-10 flex items-center justify-between px-2 border-b border-slate-700">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex gap-2 mr-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500" />
                    </div>
                    <div className="flex-1 bg-slate-800 rounded-lg flex items-center px-3 py-1 border border-slate-700">
                      <Chrome className="w-4 h-4 text-cyan-500 mr-2" />
                      <input
                        type="text"
                        value={browserUrl}
                        onChange={(e) => setBrowserUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleBrowserNavigate()}
                        className="flex-1 bg-transparent text-sm text-slate-200 focus:outline-none placeholder-slate-500 font-mono"
                      />
                    </div>
                  </div>
                  <button
                    onClick={onOpenBrowser}
                    className="w-8 h-8 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded flex items-center justify-center transition-colors ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Browser Content */}
                <div className="flex-1 bg-[#0f172a] overflow-y-auto relative">
                  {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center gap-4">
                      <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
                      <p className="text-cyan-400/50 font-mono text-sm">Menghubungkan...</p>
                    </div>
                  ) : browserContent === "google" ? (
                    <div className="p-8 h-full flex flex-col items-center justify-center">
                      <div className="max-w-xl w-full">
                        <div className="text-center mb-8">
                          <h1 className="text-6xl font-bold mb-8 text-white tracking-tighter">
                            <span className="text-blue-500">G</span>
                            <span className="text-red-500">o</span>
                            <span className="text-yellow-500">o</span>
                            <span className="text-blue-500">g</span>
                            <span className="text-green-500">l</span>
                            <span className="text-red-500">e</span>
                          </h1>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md group-hover:bg-cyan-500/30 transition-all opacity-0 group-hover:opacity-100" />
                            <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-full px-5 hover:bg-slate-700/80 hover:border-slate-600 transition-all shadow-lg">
                              <span className="text-slate-500 mr-3">🔍</span>
                              <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Telusuri Google atau ketik URL"
                                className="flex-1 bg-transparent py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                              />
                              <button
                                onClick={handleSearch}
                                className="p-2 hover:bg-slate-600 rounded-full text-cyan-500 transition-colors"
                              >
                                <span className="text-lg">➔</span>
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-8">
                          <button
                            onClick={() => { setBrowserUrl("https://youtube.com"); handleBrowserNavigate("https://youtube.com"); }}
                            className="px-6 py-2 text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-all"
                          >
                            YouTube
                          </button>
                          <button
                            onClick={() => { setBrowserUrl("https://github.com"); handleBrowserNavigate("https://github.com"); }}
                            className="px-6 py-2 text-sm bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white rounded border border-slate-700 transition-all"
                          >
                            GitHub
                          </button>
                        </div>

                        {networkConnected && (
                          <div className="mt-12 text-center">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                              Terhubung • {ipAddress}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : browserContent === "youtube" ? (
                    <div className="bg-cyan-900 min-h-full p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-red-500 text-2xl font-bold">▶ YouTube</div>
                        <input className="flex-1 bg-cyan-800 border border-cyan-700 rounded-full px-4 py-2 text-cyan-100 text-sm placeholder-cyan-400" placeholder="Cari video..." />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {["Tech Tutorial", "Music Video", "Gaming Stream", "News", "Coding Tips", "Cat Videos"].map((title, i) => (
                          <div key={i} className="bg-cyan-800 rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-cyan-700 to-cyan-800 flex items-center justify-center text-4xl">
                              {["📺", "🎵", "🎮", "📰", "💻", "🐱"][i]}
                            </div>
                            <div className="p-2">
                              <p className="text-cyan-100 text-sm font-semibold truncate">{title}</p>
                              <p className="text-cyan-300 text-xs">Kanal Virtual • 10rb tayangan</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : browserContent === "github" ? (
                    <div className="bg-cyan-900 min-h-full p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="text-cyan-100 text-2xl">🐙</div>
                        <span className="text-cyan-100 text-xl font-bold">GitHub</span>
                      </div>
                      <div className="bg-cyan-800 rounded-lg p-4 mb-4">
                        <h3 className="text-cyan-100 font-bold mb-2">📁 virtual-lab-sisjarkom</h3>
                        <p className="text-cyan-300 text-sm mb-3">Simulasi lab virtual interaktif untuk sistem jaringan komputer</p>
                        <div className="flex gap-4 text-xs text-cyan-500">
                          <span>⭐ 42 bintang</span>
                          <span>🔀 12 fork</span>
                          <span>🟢 TypeScript</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {["Next.js", "React", "TypeScript", "Tailwind CSS"].map((tech, i) => (
                          <div key={i} className="bg-cyan-800 rounded p-3 text-center">
                            <span className="text-cyan-100 text-sm">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : browserContent === "search-results" ? (
                    <div className="p-6 max-w-4xl mx-auto">
                      <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                        <span className="text-xl font-bold text-white">Google</span>
                        <div className="flex-1 bg-slate-800 rounded-full px-4 py-2 flex items-center">
                          <input
                            value={searchQuery}
                            readOnly
                            className="bg-transparent text-sm text-slate-300 focus:outline-none w-full"
                          />
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm mb-6">Sekitar 245.000 hasil (0.42 detik)</p>
                      <div className="space-y-8">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="group cursor-pointer">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                                {searchQuery[0]?.toUpperCase() || "G"}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-xs text-slate-300">www.contoh{i}.com › hasil</span>
                                <span className="text-xs text-slate-500">https://www.contoh{i}.com/{searchQuery}</span>
                              </div>
                            </div>
                            <h3 className="text-blue-400 text-xl hover:underline mb-1">Hasil Pencarian {i}: {searchQuery}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                              Ini adalah simulasi hasil pencarian untuk kata kunci <span className="font-bold text-slate-200">{searchQuery}</span>.
                              Dalam simulasi ini, kami mendemonstrasikan bagaimana mesin pencari menampilkan informasi yang relevan dengan cepat dan akurat...
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : browserContent === "external" ? (
                    <div className="w-full h-full bg-white">
                      <iframe
                        src={browserUrl}
                        className="w-full h-full border-none"
                        title="External Browser"
                        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                        onError={() => setBrowserContent("generic")}
                      />
                      {/* Overlay warning for mixed content or iframe blocks if needed, but simple is better for now */}
                    </div>
                  ) : (
                    <div className="p-8 text-center h-full flex flex-col items-center justify-center text-slate-400">
                      <div className="text-6xl mb-4 opacity-50">⚠️</div>
                      <h2 className="text-xl font-bold text-slate-200 mb-2">Tidak dapat memuat halaman</h2>
                      <p className="text-sm max-w-md mx-auto">
                        Website <span className="font-mono text-cyan-400">{browserUrl}</span> menolak untuk ditampilkan dalam simulasi (iframe denied).
                      </p>
                      <button
                        onClick={() => handleBrowserNavigate("https://www.google.com")}
                        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
                      >
                        Kembali ke Google
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Taskbar */}
        <div className="bg-slate-800 h-12 flex items-center justify-between px-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center transition-colors">
              <span className="text-white text-xl">⊞</span>
            </button>
            <div className="h-8 w-px bg-slate-600" />
            {browserOpen && (
              <motion.div
                className="flex items-center gap-2 bg-slate-700 px-3 py-1 rounded"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <Chrome className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">Chrome</span>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white text-sm font-mono">
              {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </div>
            {networkConnected && (
              <div className="text-emerald-400 text-xs flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                Online
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
