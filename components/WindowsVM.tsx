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
}

export default function WindowsVM({ 
  onClose, 
  networkConnected, 
  onOpenBrowser, 
  browserOpen,
  ipAddress 
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
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`bg-gradient-to-br from-blue-950 to-slate-900 border-2 border-blue-500/50 rounded-lg shadow-2xl shadow-blue-500/20 overflow-hidden ${
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
            <span className="text-white text-sm font-semibold">Windows 11 Pro - Virtual Machine</span>
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
          <div className="absolute bottom-4 right-4 glass rounded-lg p-4 w-64">
            <h3 className="text-white font-bold mb-2 text-sm">System Info</h3>
            <div className="text-xs text-white/80 space-y-1 font-mono">
              <div>OS: Windows 11 Pro</div>
              <div>Status: Running</div>
              {networkConnected && ipAddress && (
                <div className="text-emerald-400">Network: Connected ({ipAddress})</div>
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
                      className="flex-1 bg-white rounded px-3 py-1 text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <div className="flex-1 bg-white relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="p-8">
                      <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-8">
                          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Google
                          </h1>
                          <div className="bg-zinc-100 rounded-full p-4 text-zinc-600">
                            🔍 Search the web...
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                          <h3 className="font-bold text-blue-900 mb-2">✅ Koneksi Berhasil!</h3>
                          <p className="text-sm text-blue-800">
                            Virtual machine Windows berhasil terhubung ke internet melalui router.
                            IP Address: <span className="font-mono font-bold">{ipAddress}</span>
                          </p>
                          <div className="mt-3 text-xs text-blue-600 font-mono">
                            <div>• Gateway: 192.168.1.1</div>
                            <div>• DNS: 8.8.8.8</div>
                            <div>• Status: Online</div>
                          </div>
                        </div>
                      </div>
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
