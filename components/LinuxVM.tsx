"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minimize2, Maximize2, Terminal as TerminalIcon } from "lucide-react";
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
}

export default function LinuxVM({ 
  onClose, 
  networkConnected, 
  onOpenBrowser, 
  browserOpen,
  ipAddress,
  performanceMetrics,
  distro,
  hardware
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
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [commandHistory]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    setCommandHistory((prev) => [...prev, `user@${distro.toLowerCase()}:~$ ${cmd}`]);

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
          "  htop       - Penampil proses sistem",
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

      case "htop":
        setCommandHistory((prev) => [
          ...prev,
          "┌─────────────────────── htop 3.0.5 ────────────────────────┐",
          "│ CPU[||||||||||||           35%]   Tasks: 142, 203 thr; 1  │",
          "│ Mem[|||||||||||||||     3.2G/16G]   Load avg: 0.82 0.76   │",
          "│ Swp[                    0K/4.0G]   Uptime: 02:34:17       │",
          "│  PID USER      RES  CPU% COMMAND                          │",
          "│  1234 user      2.1G 12.0 firefox                         │",
          "│  5678 user      156M  5.2 terminal                        │",
          "│  9012 user       98M  2.1 systemd                         │",
          "└───────────────────────────────────────────────────────────┘",
          ""
        ]);
        break;

      case "pwd":
        setCommandHistory((prev) => [
          ...prev,
          "/home/user",
          ""
        ]);
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
        className={`bg-slate-900 border-2 border-green-500/50 rounded-lg shadow-2xl overflow-hidden ${
          isMaximized ? "w-full h-full" : "w-[90%] h-[90%] max-w-6xl"
        }`}
        initial={{ scale: 0.9, y: 20 }}
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
                        <p className="text-zinc-600 font-mono text-sm">
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
                          <div className="bg-zinc-100 rounded-full p-4 text-zinc-600">
                            🔍 Privacy, simplified.
                          </div>
                          <input
                            type="text"
                            placeholder="Cari web tanpa dilacak..."
                            className="w-full mt-6 px-6 py-4 border-2 border-zinc-300 rounded-full focus:border-green-500 focus:outline-none text-lg text-zinc-900"
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
                          className="w-full px-6 py-4 border-2 border-zinc-300 rounded-full focus:border-blue-500 focus:outline-none text-lg shadow-lg text-zinc-900"
                        />
                      </div>
                    )}

                    {browserURL.includes("github") && (
                      <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold mb-4">GitHub</h1>
                        <p className="text-xl text-zinc-600 mb-6">Tempat dunia membangun perangkat lunak</p>
                        <div className="flex gap-4 justify-center">
                          <button className="px-6 py-3 bg-zinc-900 text-white rounded-lg font-semibold">
                            Masuk
                          </button>
                          <button className="px-6 py-3 border-2 border-zinc-900 text-zinc-900 rounded-lg font-semibold">
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

                    <div className="mt-6 text-sm text-zinc-600">
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

          {/* Terminal Output */}
          <div className="space-y-1">
            {commandHistory.map((line, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`${
                  line.startsWith("user@") 
                    ? "text-green-400" 
                    : line.includes("Error") || line.includes("error")
                    ? "text-red-400"
                    : "text-zinc-300"
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
                  e.stopPropagation();
                  if (e.key === "Enter") {
                    executeCommand(currentCommand);
                  }
                }}
                onKeyUp={(e) => e.stopPropagation()}
                onClick={(e) => e.currentTarget.focus()}
                className="flex-1 bg-transparent text-zinc-300 outline-none caret-green-400"
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
        </div>
      </motion.div>
    </motion.div>
  );
}
