"use client";

import { motion } from "framer-motion";
import { X, Info, Cable, Zap, Settings } from "lucide-react";
import { useState } from "react";

interface NetworkModalProps {
  onClose: () => void;
  onComplete: (config?: { ip: string; subnet: string; gateway: string; dns: string }) => void;
  addLog: (message: string) => void;
}

export default function NetworkModal({
  onClose,
  onComplete,
  addLog,
}: NetworkModalProps) {
  const [step, setStep] = useState<"intro" | "configure" | "test" | "connecting" | "done">("intro");
  const [configMode, setConfigMode] = useState<"dhcp" | "manual">("dhcp");
  
  // Network configuration
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [subnetMask, setSubnetMask] = useState("255.255.255.0");
  const [gateway, setGateway] = useState("192.168.1.1");
  const [dns, setDns] = useState("8.8.8.8");
  
  // Network testing
  const [pingTest, setPingTest] = useState<"idle" | "testing" | "success" | "failed">("idle");
  const [dnsTest, setDnsTest] = useState<"idle" | "testing" | "success" | "failed">("idle");

  const handleProceedToTest = () => {
    if (configMode === "dhcp") {
      const autoIP = `192.168.1.${Math.floor(Math.random() * 200) + 10}`;
      setIpAddress(autoIP);
    }
    setStep("test");
  };

  const handleRunTests = () => {
    addLog("Menjalankan network diagnostic tests...");
    
    // Ping test
    setPingTest("testing");
    setTimeout(() => {
      setPingTest("success");
      addLog("✓ Ping test ke gateway berhasil (1ms)");
    }, 1000);
    
    // DNS test
    setTimeout(() => {
      setDnsTest("testing");
    }, 1500);
    
    setTimeout(() => {
      setDnsTest("success");
      addLog("✓ DNS resolution test berhasil (8ms)");
    }, 2500);
  };

  const handleConnect = () => {
    setStep("connecting");
    addLog("Menghubungkan kabel ethernet...");
    
    setTimeout(() => {
      addLog("Kabel terhubung. Konfigurasi jaringan...");
    }, 800);

    setTimeout(() => {
      if (configMode === "dhcp") {
        addLog("Mode DHCP: IP otomatis diterima");
        addLog(`IP Address: ${ipAddress}`);
      } else {
        addLog("Mode Manual: Menggunakan konfigurasi custom");
        addLog(`IP Address: ${ipAddress}`);
      }
      addLog(`Subnet Mask: ${subnetMask}`);
      addLog(`Gateway: ${gateway}`);
      addLog(`DNS: ${dns}`);
      addLog("Network interface eth0 is UP");
      setStep("done");
    }, 2000);
  };

  const handleFinish = () => {
    onComplete({
      ip: ipAddress,
      subnet: subnetMask,
      gateway: gateway,
      dns: dns,
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
        className="bg-zinc-900 border-2 border-emerald-500/50 rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl shadow-emerald-500/20"
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
          Fase 3: Konfigurasi Jaringan
        </h2>
        <p className="text-zinc-400 text-sm mb-6 font-mono">
          Network // Koneksi ke Internet
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
                <p className="font-semibold mb-2">Tentang Jaringan Komputer:</p>
                <ul className="space-y-2 text-zinc-400">
                  <li>
                    <strong className="text-emerald-400">IP Address:</strong> Alamat unik
                    untuk mengidentifikasi komputer di jaringan.
                  </li>
                  <li>
                    <strong className="text-emerald-400">Router:</strong> Perangkat yang
                    menghubungkan komputer ke internet dan jaringan lain.
                  </li>
                  <li>
                    <strong className="text-emerald-400">Data Packet:</strong> Data
                    dipecah menjadi paket-paket kecil saat ditransmisikan.
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass rounded-lg p-4 text-center">
                <Cable className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                <p className="text-zinc-300 font-semibold text-sm">Koneksi Fisik</p>
                <p className="text-zinc-500 text-xs mt-1">Kabel Ethernet RJ45</p>
              </div>
              <div className="glass rounded-lg p-4 text-center">
                <Settings className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-zinc-300 font-semibold text-sm">Konfigurasi IP</p>
                <p className="text-zinc-500 text-xs mt-1">DHCP / Manual</p>
              </div>
            </div>

            <button
              onClick={() => setStep("configure")}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Konfigurasikan Jaringan
            </button>
          </motion.div>
        )}

        {step === "configure" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-lg p-4">
              <p className="text-sm text-zinc-400 mb-4">
                Pilih mode konfigurasi jaringan untuk komputer Anda:
              </p>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setConfigMode("dhcp")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    configMode === "dhcp"
                      ? "border-emerald-500 bg-emerald-950/30"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <Zap className={`w-8 h-8 mx-auto mb-2 ${configMode === "dhcp" ? "text-emerald-400" : "text-zinc-500"}`} />
                  <p className="text-sm font-semibold text-zinc-300">DHCP</p>
                  <p className="text-xs text-zinc-500 mt-1">Otomatis</p>
                </button>
                
                <button
                  onClick={() => setConfigMode("manual")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    configMode === "manual"
                      ? "border-cyan-500 bg-cyan-950/30"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  <Settings className={`w-8 h-8 mx-auto mb-2 ${configMode === "manual" ? "text-cyan-400" : "text-zinc-500"}`} />
                  <p className="text-sm font-semibold text-zinc-300">Manual</p>
                  <p className="text-xs text-zinc-500 mt-1">Custom</p>
                </button>
              </div>

              {configMode === "manual" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 border-t border-zinc-700 pt-4"
                >
                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block font-mono">IP Address</label>
                    <input
                      type="text"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="192.168.1.100"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block font-mono">Subnet Mask</label>
                    <input
                      type="text"
                      value={subnetMask}
                      onChange={(e) => setSubnetMask(e.target.value)}
                      placeholder="255.255.255.0"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block font-mono">Gateway</label>
                    <input
                      type="text"
                      value={gateway}
                      onChange={(e) => setGateway(e.target.value)}
                      placeholder="192.168.1.1"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-zinc-400 mb-2 block font-mono">DNS Server</label>
                    <input
                      type="text"
                      value={dns}
                      onChange={(e) => setDns(e.target.value)}
                      placeholder="8.8.8.8"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-300 font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("intro")}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 rounded-lg transition-colors"
              >
                Kembali
              </button>
              <button
                onClick={handleProceedToTest}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Test Network
              </button>
            </div>
          </motion.div>
        )}

        {step === "test" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-lg p-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-4">Network Diagnostic Tests</h3>
              
              <div className="space-y-4">
                {/* Configuration Summary */}
                <div className="bg-zinc-800 rounded-lg p-3 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-zinc-500">Mode:</span>
                      <span className="text-white ml-2">{configMode.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">IP:</span>
                      <span className="text-emerald-400 ml-2">{ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">Gateway:</span>
                      <span className="text-cyan-400 ml-2">{gateway}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500">DNS:</span>
                      <span className="text-blue-400 ml-2">{dns}</span>
                    </div>
                  </div>
                </div>

                {/* Ping Test */}
                <div className="glass rounded-lg p-3 border border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        pingTest === "idle" ? "bg-zinc-600" :
                        pingTest === "testing" ? "bg-yellow-500 animate-pulse" :
                        pingTest === "success" ? "bg-emerald-500" : "bg-red-500"
                      }`} />
                      <div>
                        <p className="text-sm font-semibold text-zinc-300">Ping Test</p>
                        <p className="text-xs text-zinc-500">Testing connection to gateway</p>
                      </div>
                    </div>
                    {pingTest === "success" && (
                      <span className="text-emerald-400 text-xs font-mono">1ms ✓</span>
                    )}
                  </div>
                </div>

                {/* DNS Test */}
                <div className="glass rounded-lg p-3 border border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        dnsTest === "idle" ? "bg-zinc-600" :
                        dnsTest === "testing" ? "bg-yellow-500 animate-pulse" :
                        dnsTest === "success" ? "bg-emerald-500" : "bg-red-500"
                      }`} />
                      <div>
                        <p className="text-sm font-semibold text-zinc-300">DNS Resolution</p>
                        <p className="text-xs text-zinc-500">Testing DNS server response</p>
                      </div>
                    </div>
                    {dnsTest === "success" && (
                      <span className="text-emerald-400 text-xs font-mono">8ms ✓</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("configure")}
                className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold py-3 rounded-lg transition-colors"
              >
                Kembali
              </button>
              
              {pingTest === "idle" ? (
                <button
                  onClick={handleRunTests}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Run Tests
                </button>
              ) : pingTest === "success" && dnsTest === "success" ? (
                <button
                  onClick={handleConnect}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Cable className="w-5 h-5" />
                  Apply Config
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-zinc-700 text-zinc-500 font-semibold py-3 rounded-lg cursor-wait"
                >
                  Testing...
                </button>
              )}
            </div>
          </motion.div>
        )}

        {step === "connecting" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-16 h-16 text-emerald-400" />
            </motion.div>
            <p className="mt-6 text-zinc-300 font-mono">Menghubungkan ke jaringan...</p>
            
            <div className="mt-6 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-emerald-500 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
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
                Koneksi Berhasil!
              </h3>
              <p className="text-zinc-400 mb-4">
                Komputer berhasil terhubung ke jaringan.
              </p>
              
              <div className="glass rounded-lg p-4 text-left font-mono text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-500">IP Address:</span>
                  <span className="text-emerald-400">192.168.1.100</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-zinc-500">Gateway:</span>
                  <span className="text-emerald-400">192.168.1.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Status:</span>
                  <span className="text-emerald-400">Connected</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Selesai - Lab Virtual Siap!
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
