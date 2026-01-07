"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minimize2, Maximize2, Terminal as TerminalIcon, Share2, FileText, Download, Server, Wifi } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface LinuxVMProps {
  onClose: () => void;
  networkConnected: boolean;
  onOpenBrowser: () => void;
  browserOpen: boolean;
  ipAddress?: string;
  performanceMetrics?: any;
  distro: string;
  hardware?: {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
  };
  sharedFiles?: { name: string; size: string; source: string }[];
  onShareFile?: (file: { name: string; size: string; source: string }) => void;
  computerName?: string;
}

export default function LinuxVM({
  onClose,
  networkConnected,
  onOpenBrowser,
  browserOpen,
  ipAddress,
  performanceMetrics,
  distro,
  hardware,
  sharedFiles = [],
  onShareFile,
  computerName = "LINUX-PC"
}: LinuxVMProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([
    `Selamat datang di ${distro} (GNU/Linux)`,
    "Informasi sistem berhasil dimuat",
    "",
    "Ketik 'help' untuk melihat perintah yang tersedia",
    ""
  ]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [browserURL, setBrowserURL] = useState("https://duckduckgo.com");
  const [isLoadingPage, setIsLoadingPage] = useState(false);


  const [downloadedFiles, setDownloadedFiles] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // File Sharing App State
  const [fileShareOpen, setFileShareOpen] = useState(false);
  const [availablePeers, setAvailablePeers] = useState<string[]>([]);
  const [connectedPeer, setConnectedPeer] = useState<string | null>(null);
  const [transferProgress, setTransferProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandHistory]);

  // Focus input when clicking anywhere in the terminal
  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    setCommandHistory((prev) => [...prev, `user@${computerName?.toLowerCase() || distro.toLowerCase()}:~$ ${cmd}`]);

    switch (trimmedCmd) {
      case "help":
        setCommandHistory((prev) => [
          ...prev,
          "Perintah yang tersedia:",
          "  help       - Tampilkan pesan bantuan ini",
          "  clear      - Bersihkan terminal",
          "  ls         - Daftar file dan direktori",
          "  pwd        - Cetak direktori kerja",
          "  whoami     - Tampilkan pengguna saat ini",
          "  date       - Tampilkan tanggal dan waktu",
          "  uname      - Tampilkan informasi sistem",
          "  ifconfig   - Tampilkan konfigurasi jaringan",
          "  ping       - Tes konektivitas jaringan",
          "  firefox    - Buka browser web (memerlukan jaringan)",
          ""
        ]);
        break;

      case "clear":
        setCommandHistory(["Terminal dibersihkan", ""]);
        break;

      case "ls":
        setCommandHistory((prev) => [
          ...prev,
          "Documents/  Downloads/  Pictures/  Videos/",
          "Desktop/    Music/      Public/    Templates/",
          ""
        ]);
        break;

      case "ifconfig":
        if (networkConnected) {
          setCommandHistory((prev) => [
            ...prev,
            "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
            `        inet ${ipAddress || "192.168.1.100"}  netmask 255.255.255.0  broadcast 192.168.1.255`,
            "        inet6 fe80::20c:29ff:fe8a:6c8d  prefixlen 64  scopeid 0x20<link>",
            "        ether 00:0c:29:8a:6c:8d  txqueuelen 1000  (Ethernet)",
            "        RX packets 1234  bytes 567890 (567.8 KB)",
            "        TX packets 890  bytes 123456 (123.4 KB)",
            ""
          ]);
        } else {
          setCommandHistory((prev) => [...prev, "Error: Jaringan belum dikonfigurasi", ""]);
        }
        break;

      case "ping":
      case "ping google.com":
      case "ping 8.8.8.8":
        if (networkConnected) {
          setCommandHistory((prev) => [
            ...prev,
            "PING google.com (142.250.185.46) 56(84) bytes of data.",
            "64 bytes from lhr25s34-in-f14.1e100.net: icmp_seq=1 ttl=117 time=12.3 ms",
            "64 bytes from lhr25s34-in-f14.1e100.net: icmp_seq=2 ttl=117 time=11.8 ms",
            "64 bytes from lhr25s34-in-f14.1e100.net: icmp_seq=3 ttl=117 time=12.1 ms",
            "--- google.com ping statistics ---",
            "3 packets transmitted, 3 received, 0% packet loss",
            ""
          ]);
        } else {
          setCommandHistory((prev) => [
            ...prev,
            "ping: google.com: Network is unreachable",
            ""
          ]);
        }
        break;

      case "whoami":
        setCommandHistory((prev) => [...prev, "user", ""]);
        break;

      case "date":
        setCommandHistory((prev) => [
          ...prev,
          new Date().toString(),
          ""
        ]);
        break;

      case "uname":
      case "uname -a":
        setCommandHistory((prev) => [
          ...prev,
          "Linux lab 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux",
          ""
        ]);
        break;

      case "firefox":
      case "browser":
        if (networkConnected) {
          setCommandHistory((prev) => [
            ...prev,
            "Membuka Firefox...",
            ""
          ]);
          setTimeout(() => onOpenBrowser(), 500);
        } else {
          setCommandHistory((prev) => [
            ...prev,
            "Error: Koneksi jaringan diperlukan untuk membuka browser",
            ""
          ]);
        }
        break;

      case "pwd":
        setCommandHistory((prev) => [
          ...prev,
          "/home/user",
          ""
        ]);
        break;

      case "fileshare":
        if (!networkConnected) {
          setCommandHistory((prev) => [...prev, "Error: Network connection required for File Share."]);
        } else {
          setCommandHistory((prev) => [...prev, "Launching File Transfer Utility...", "Scanning for local peers..."]);
          setTimeout(() => {
            setFileShareOpen(true);
            setAvailablePeers(["DESKTOP-SISJARKOM", "Gateway-Router", "Printer-Lobby"]);
          }, 800);
        }
        break;

      case "":
        setCommandHistory((prev) => [...prev, ""]);
        break;

      default:
        setCommandHistory((prev) => [
          ...prev,
          `bash: ${trimmedCmd}: perintah tidak ditemukan`,
          "Ketik 'help' untuk melihat perintah yang tersedia",
          ""
        ]);
    }

    setCurrentCommand("");
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
        exit={{ scale: 0.9, y: 20 }}
        layout
      >
        {/* Title Bar */}
        <div className="bg-slate-800 h-10 flex items-center justify-between px-4 select-none border-b border-slate-700">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm font-mono">user@{distro.toLowerCase()}: ~</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-8 h-8 hover:bg-white/10 rounded flex items-center justify-center transition-colors"
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

        {/* Terminal Content */}
        <div className="h-[calc(100%-2.5rem)] bg-black p-4 font-mono text-sm overflow-y-auto relative">
          {/* Browser Window Overlay */}
          <AnimatePresence>
            {browserOpen && (
              <motion.div
                className="absolute inset-4 bg-slate-900 rounded-lg shadow-2xl flex flex-col overflow-hidden z-10 border-2 border-green-500/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                {/* Browser Title Bar */}
                <div className="bg-slate-800 h-10 flex items-center justify-between px-3 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="text-white text-sm font-mono">Firefox - Private Browsing</span>
                  </div>
                  <button
                    onClick={onOpenBrowser}
                    className="w-8 h-8 hover:bg-red-500 rounded flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                {/* URL Bar */}
                <div className="bg-slate-700 px-4 py-2 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsLoadingPage(true);
                      setTimeout(() => setIsLoadingPage(false), performanceMetrics?.browserLoadTime || 1000);
                    }}
                    className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm transition-colors"
                  >
                    {isLoadingPage ? "⏳" : "↻"}
                  </button>
                  <input
                    type="text"
                    value={browserURL}
                    onChange={(e) => setBrowserURL(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setIsLoadingPage(true);
                        setTimeout(() => setIsLoadingPage(false), performanceMetrics?.browserLoadTime || 1000);
                      }
                    }}
                    className="flex-1 bg-slate-600 text-white px-4 py-2 rounded text-sm font-mono focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Masukkan URL..."
                  />
                  <button
                    onClick={() => {
                      setIsLoadingPage(true);
                      setTimeout(() => setIsLoadingPage(false), performanceMetrics?.browserLoadTime || 1000);
                    }}
                    className="px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded text-sm transition-colors"
                  >
                    Go
                  </button>
                </div>

                {/* Browser Content */}
                <div className="flex-1 bg-white p-8 overflow-auto relative">
                  {isLoadingPage && (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-10">
                      <div className="text-center">
                        <motion.div
                          className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-3"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <p className="text-cyan-300 font-mono text-sm">
                          Memuat... ({performanceMetrics?.browserLoadTime || 1000}ms)
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="max-w-2xl mx-auto">
                    {browserURL.includes("duckduckgo") && (
                      <>
                        <div className="text-center mb-8">
                          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            DuckDuckGo
                          </h1>
                          <div className="bg-blue-950/50 border border-cyan-500/30 rounded-full p-4 text-cyan-400">
                            🔍 Privacy, simplified.
                          </div>
                          <input
                            type="text"
                            placeholder="Cari web tanpa dilacak..."
                            className="w-full mt-6 px-6 py-4 border-2 border-cyan-500/30 bg-blue-950/20 rounded-full focus:border-cyan-400 focus:outline-none text-lg text-cyan-300"
                          />
                        </div>
                      </>
                    )}

                    {browserURL.includes("google") && (
                      <div className="text-center mb-8">
                        <h1 className="text-6xl font-bold mb-8">
                          <span className="text-blue-500">G</span>
                          <span className="text-red-500">o</span>
                          <span className="text-yellow-500">o</span>
                          <span className="text-blue-500">g</span>
                          <span className="text-green-500">l</span>
                          <span className="text-red-500">e</span>
                        </h1>
                        <input
                          type="text"
                          placeholder="Cari Google atau ketik URL"
                          className="w-full px-6 py-4 border-2 border-cyan-500/30 bg-blue-950/20 rounded-full focus:border-cyan-400 focus:outline-none text-lg shadow-lg text-cyan-300"
                        />
                      </div>
                    )}

                    {browserURL.includes("github") && (
                      <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold mb-4">GitHub</h1>
                        <p className="text-xl text-cyan-300/80 mb-6">Tempat dunia membangun perangkat lunak</p>
                        <div className="flex gap-4 justify-center">
                          <button className="px-6 py-3 bg-blue-950/80 border border-cyan-500/30 text-cyan-300 rounded-lg font-semibold">
                            Masuk
                          </button>
                          <button className="px-6 py-3 border-2 border-cyan-900 text-cyan-900 rounded-lg font-semibold">
                            Daftar
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
                      <h3 className="font-bold text-green-900 mb-2">✅ Jaringan Aktif!</h3>
                      <p className="text-sm text-green-800">
                        Terminal Linux berhasil mengakses internet melalui interface eth0.
                      </p>
                      <div className="mt-3 text-xs text-green-600 font-mono space-y-1">
                        <div>inet: {ipAddress || "192.168.1.100"}</div>
                        <div>gateway: 192.168.1.1</div>
                        <div>DNS: 8.8.8.8</div>
                        <div>status: terhubung</div>
                        <div>waktu muat: {performanceMetrics?.browserLoadTime || 1000}ms</div>
                      </div>
                    </div>

                    <div className="mt-6 text-sm text-cyan-600">
                      <p className="font-mono">
                        $ curl -I {browserURL}<br />
                        HTTP/2 200<br />
                        server: nginx<br />
                        content-type: text/html; charset=UTF-8<br />
                        connection time: {performanceMetrics?.browserLoadTime || 1000}ms
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>



          {/* File Sharing App Overlay */}
          <AnimatePresence>
            {fileShareOpen && (
              <motion.div
                className="absolute inset-8 bg-[#2d3748] rounded shadow-2xl flex flex-col overflow-hidden z-20 border border-slate-600 font-sans"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                {/* Header (GTK Style) */}
                <div className="bg-[#1a202c] h-10 flex items-center justify-between px-3 border-b border-slate-600 select-none">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-slate-300" />
                    <span className="text-slate-200 text-sm font-semibold">Nautilus Share</span>
                  </div>
                  <button onClick={() => setFileShareOpen(false)} className="bg-red-500/80 hover:bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center p-0.5"><X className="w-3 h-3" /></button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  {/* Sidebar */}
                  <div className="w-40 bg-[#2d3748] border-r border-slate-600 p-2 flex flex-col gap-1">
                    <div className="text-xs font-bold text-slate-400 uppercase mb-2 px-2 mt-2">Network</div>
                    {availablePeers.map(peer => (
                      <button
                        key={peer}
                        onClick={() => setConnectedPeer(peer)}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left truncate ${connectedPeer === peer ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                      >
                        <Server className="w-3 h-3" />
                        {peer}
                      </button>
                    ))}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 bg-[#edf2f7] text-slate-800 p-4">
                    {connectedPeer === "DESKTOP-SISJARKOM" ? (
                      <div>
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-300">
                          <span className="text-lg font-bold">Public Share</span>
                          <span className="text-sm text-gray-500">on {connectedPeer}</span>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                          <button
                            onClick={() => {
                              if (transferProgress === 0) {
                                setTransferProgress(10);
                                let progress = 0;
                                const interval = setInterval(() => {
                                  progress += 10;
                                  setTransferProgress(progress);
                                  if (progress >= 100) {
                                    clearInterval(interval);
                                    setCommandHistory(prev => [...prev, "File 'secure_payload.dat' downloaded to ~/Downloads"]);
                                    setDownloadedFiles(prev => [...prev, 'secure_payload.dat']);
                                  }
                                }, 200);
                              }
                            }}
                            className="flex flex-col items-center gap-2 group p-4 rounded hover:bg-blue-100 transition-colors"
                          >
                            <FileText className="w-12 h-12 text-gray-600 group-hover:text-blue-600" />
                            <span className="text-sm font-medium">secure_payload.dat</span>
                            <span className="text-xs text-gray-500">2.4 MB</span>
                          </button>
                        </div>

                        {transferProgress > 0 && transferProgress < 100 && (
                          <div className="mt-8 bg-white p-4 rounded shadow border border-gray-200">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Downloading...</span>
                              <span>{transferProgress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full transition-all duration-200" style={{ width: `${transferProgress}%` }}></div>
                            </div>
                          </div>
                        )}

                        {transferProgress === 100 && (
                          <div className="mt-8 bg-green-100 text-green-800 p-3 rounded flex items-center gap-2 text-sm border border-green-200">
                            <Download className="w-4 h-4" /> Download Complete!
                          </div>
                        )}

                      </div>
                    ) : connectedPeer ? (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Server className="w-16 h-16 mb-4 opacity-50" />
                        <p>No shared folders found on {connectedPeer}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <Wifi className="w-16 h-16 mb-4 opacity-50" />
                        <p>Select a device to browse files</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal Output */}
          <div className="space-y-1">
            {commandHistory.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${line.startsWith("user@")
                  ? "text-green-400"
                  : line.includes("Error") || line.includes("error")
                    ? "text-red-400"
                    : "text-cyan-300"
                  }`}
              >
                {line}
              </motion.div>
            ))}

            {/* Input Line */}
            <div className="flex items-center gap-2">
              <span className="text-green-400">user@{distro.toLowerCase()}:~$</span>
              <input
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    executeCommand(currentCommand);
                  }
                }}
                autoFocus
                className="flex-1 bg-transparent text-cyan-300 outline-none caret-green-400"
                spellCheck={false}
              />
              <motion.div
                className="w-2 h-4 bg-green-400"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>
            <div ref={terminalEndRef} />
          </div>
        </div >
      </motion.div >
    </motion.div >
  );
}
