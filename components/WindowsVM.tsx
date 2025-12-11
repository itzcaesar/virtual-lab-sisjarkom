"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minimize2, Maximize2, Chrome, Loader2 } from "lucide-react";
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
}

export default function WindowsVM({ 
  onClose, 
  networkConnected, 
  onOpenBrowser, 
  browserOpen,
  ipAddress,
  edition = "Windows 11 Pro",
  hardware,
  performanceMetrics
}: WindowsVMProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [browserUrl, setBrowserUrl] = useState("https://www.google.com");
  const [isLoading, setIsLoading] = useState(false);
  const [activeApp, setActiveApp] = useState<"desktop" | "settings" | "task-manager">("desktop");
  const [cpuUsage] = useState(Math.floor(Math.random() * 30) + 10);
  const [ramUsage] = useState(Math.floor(Math.random() * 40) + 30);
  const [browserContent, setBrowserContent] = useState("google");
  const [searchQuery, setSearchQuery] = useState("");

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
      setBrowserContent("generic");
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
        className={`bg-gradient-to-br from-blue-950 to-slate-900 border-2 border-blue-500/50 rounded-lg shadow-2xl overflow-hidden ${
          isMaximized ? "w-full h-full" : "w-[90%] h-[90%] max-w-6xl"
        }`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        layout
      >
        {/* Title Bar */}
        <div className="bg-blue-600 h-10 flex items-center justify-between px-4 select-none">
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
        <div className="h-[calc(100%-6.5rem)] bg-gradient-to-br from-blue-500 to-purple-600 p-8 relative">
          {/* Desktop Icons */}
          <div className="flex flex-col gap-4">
            <motion.button
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
                <div className="bg-zinc-200 h-10 flex items-center justify-between px-2 border-b">
                  <div className="flex items-center gap-2 flex-1">
                    <Chrome className="w-5 h-5 text-blue-600" />
                    <input
                      type="text"
                      value={browserUrl}
                      onChange={(e) => setBrowserUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleBrowserNavigate()}
                      className="flex-1 bg-white rounded px-3 py-1 text-sm text-black border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={onOpenBrowser}
                    className="w-8 h-8 hover:bg-red-500 rounded flex items-center justify-center transition-colors ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Browser Content */}
                <div className="flex-1 bg-white overflow-y-auto">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  ) : browserContent === "google" ? (
                    <div className="p-8">
                      <div className="max-w-xl mx-auto">
                        <div className="text-center mb-6">
                          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-red-500 via-yellow-500 via-green-500 to-blue-600 bg-clip-text text-transparent">
                            Google
                          </h1>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                              placeholder="Cari di Google..."
                              className="flex-1 border border-zinc-300 rounded-full px-4 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button 
                              onClick={handleSearch}
                              className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-600"
                            >
                              Cari
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-center gap-4 mt-6">
                          <button 
                            onClick={() => { setBrowserUrl("https://youtube.com"); handleBrowserNavigate("https://youtube.com"); }}
                            className="px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 rounded"
                          >
                            🎬 YouTube
                          </button>
                          <button 
                            onClick={() => { setBrowserUrl("https://github.com"); handleBrowserNavigate("https://github.com"); }}
                            className="px-4 py-2 text-sm bg-zinc-100 hover:bg-zinc-200 rounded"
                          >
                            💻 GitHub
                          </button>
                        </div>

                        {networkConnected && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-6 text-sm">
                            <p className="text-green-700">✅ Terhubung • IP: {ipAddress}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : browserContent === "youtube" ? (
                    <div className="bg-zinc-900 min-h-full p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-red-500 text-2xl font-bold">▶ YouTube</div>
                        <input className="flex-1 bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-zinc-100 text-sm placeholder-zinc-400" placeholder="Cari video..." />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {["Tech Tutorial", "Music Video", "Gaming Stream", "News", "Coding Tips", "Cat Videos"].map((title, i) => (
                          <div key={i} className="bg-zinc-800 rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-4xl">
                              {["📺", "🎵", "🎮", "📰", "💻", "🐱"][i]}
                            </div>
                            <div className="p-2">
                              <p className="text-zinc-100 text-sm font-semibold truncate">{title}</p>
                              <p className="text-zinc-300 text-xs">Kanal Virtual • 10rb tayangan</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : browserContent === "github" ? (
                    <div className="bg-zinc-900 min-h-full p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="text-zinc-100 text-2xl">🐙</div>
                        <span className="text-zinc-100 text-xl font-bold">GitHub</span>
                      </div>
                      <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                        <h3 className="text-zinc-100 font-bold mb-2">📁 virtual-lab-sisjarkom</h3>
                        <p className="text-zinc-300 text-sm mb-3">Simulasi lab virtual interaktif untuk sistem jaringan komputer</p>
                        <div className="flex gap-4 text-xs text-zinc-500">
                          <span>⭐ 42 bintang</span>
                          <span>🔀 12 fork</span>
                          <span>🟢 TypeScript</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {["Next.js", "React", "TypeScript", "Tailwind CSS"].map((tech, i) => (
                          <div key={i} className="bg-zinc-800 rounded p-3 text-center">
                            <span className="text-zinc-100 text-sm">{tech}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : browserContent === "search-results" ? (
                    <div className="p-6">
                      <p className="text-zinc-500 text-sm mb-4">Hasil untuk "{searchQuery}"</p>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="border-b pb-4">
                            <a href="#" className="text-blue-600 hover:underline text-lg">Hasil Pencarian {i}: {searchQuery}</a>
                            <p className="text-green-700 text-sm">www.contoh{i}.com</p>
                            <p className="text-zinc-600 text-sm">Ini adalah hasil pencarian simulasi untuk pencarian Anda tentang {searchQuery}...</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="text-6xl mb-4">🌐</div>
                      <h2 className="text-xl font-bold text-zinc-800 mb-2">{browserUrl}</h2>
                      <p className="text-zinc-500">Halaman berhasil dimuat</p>
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
