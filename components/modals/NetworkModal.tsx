"use client";

import { motion } from "framer-motion";
import { X, Info, Cable, Zap, Settings, Wifi, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface NetworkModalProps {
  onClose: () => void;
  onComplete: (config?: { ip: string; subnet: string; gateway: string; dns: string }) => void;
  addLog: (message: string) => void;
  isRouter?: boolean;
}

// IP validation helper
const isValidIP = (ip: string): boolean => {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part, 10);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
};

// Check if IP is in same network as gateway
const isIPInNetwork = (ip: string, gateway: string, subnet: string): boolean => {
  const ipParts = ip.split(".").map(Number);
  const gatewayParts = gateway.split(".").map(Number);
  const subnetParts = subnet.split(".").map(Number);

  for (let i = 0; i < 4; i++) {
    if ((ipParts[i] & subnetParts[i]) !== (gatewayParts[i] & subnetParts[i])) {
      return false;
    }
  }
  return true;
};

export default function NetworkModal({
  onClose,
  onComplete,
  addLog,
  isRouter = false,
}: NetworkModalProps) {
  const [step, setStep] = useState<"intro" | "cable" | "configure" | "test" | "connecting" | "done" | "failed">("intro");
  const [configMode, setConfigMode] = useState<"dhcp" | "manual">("dhcp");
  const [cableType, setCableType] = useState<"ethernet" | "fiber">("ethernet");

  // Network configuration
  const [ipAddress, setIpAddress] = useState("192.168.1.100");
  const [subnetMask, setSubnetMask] = useState("255.255.255.0");
  const [gateway, setGateway] = useState("192.168.1.1");
  const [dns, setDns] = useState("8.8.8.8");

  // Validation errors
  const [ipError, setIpError] = useState<string | null>(null);
  const [subnetError, setSubnetError] = useState<string | null>(null);
  const [gatewayError, setGatewayError] = useState<string | null>(null);
  const [dnsError, setDnsError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Router Config State
  const [routerInterface, setRouterInterface] = useState("FastEthernet0/0");
  const [interfaceStatus, setInterfaceStatus] = useState(false);
  const [routingProtocol, setRoutingProtocol] = useState<"static" | "rip" | "ospf">("static");
  const [dhcpServerEnabled, setDhcpServerEnabled] = useState(false);

  // Network testing
  const [pingTest, setPingTest] = useState<"idle" | "testing" | "success" | "failed">("idle");
  const [dnsTest, setDnsTest] = useState<"idle" | "testing" | "success" | "failed">("idle");

  // Cable speeds
  const cableTypes = [
    { id: "ethernet", name: "Ethernet Cat8", speed: "1 Gbps", latency: "1-2ms", icon: "🔌", color: "emerald" },
    { id: "fiber", name: "Fiber Optik", speed: "10 Gbps", latency: "<1ms", icon: "💡", color: "cyan" },
  ];

  const validateIP = (ip: string) => {
    if (!isValidIP(ip)) {
      setIpError("Format IP tidak valid (contoh: 192.168.1.100)");
      return false;
    }
    setIpError(null);
    return true;
  };

  const validateSubnet = (subnet: string) => {
    if (!isValidIP(subnet)) {
      setSubnetError("Format subnet tidak valid");
      return false;
    }
    setSubnetError(null);
    return true;
  };

  const validateGateway = (gw: string) => {
    if (!isValidIP(gw)) {
      setGatewayError("Format gateway tidak valid");
      return false;
    }
    setGatewayError(null);
    return true;
  };

  const validateDns = (dnsServer: string) => {
    if (!isValidIP(dnsServer)) {
      setDnsError("Format DNS tidak valid");
      return false;
    }
    setDnsError(null);
    return true;
  };

  const handleProceedToTest = () => {
    if (configMode === "dhcp") {
      const autoIP = `192.168.1.${Math.floor(Math.random() * 200) + 10}`;
      setIpAddress(autoIP);
      setStep("test");
    } else {
      // Validate all fields for manual mode
      const ipValid = validateIP(ipAddress);
      const subnetValid = validateSubnet(subnetMask);
      const gatewayValid = validateGateway(gateway);
      const dnsValid = validateDns(dns);

      if (ipValid && subnetValid && gatewayValid && dnsValid) {
        setStep("test");
      }
    }
  };

  const handleRunTests = () => {
    addLog("Menjalankan network diagnostic tests...");

    // Check if IP is in the same network as gateway
    const inNetwork = isIPInNetwork(ipAddress, gateway, subnetMask);

    // Ping test
    setPingTest("testing");
    setTimeout(() => {
      if (!inNetwork && configMode === "manual") {
        setPingTest("failed");
        addLog("✗ Ping test GAGAL - IP tidak dalam jaringan yang sama dengan gateway");
      } else {
        setPingTest("success");
        const latency = cableType === "fiber" ? "0.5ms" : "1ms";
        addLog(`✓ Ping test ke gateway berhasil (${latency})`);
      }
    }, 1000);

    // DNS test
    setTimeout(() => {
      setDnsTest("testing");
    }, 1500);

    setTimeout(() => {
      if (!inNetwork && configMode === "manual") {
        setDnsTest("failed");
        addLog("✗ DNS resolution test GAGAL - Tidak dapat mencapai server DNS");
      } else {
        setDnsTest("success");
        const latency = cableType === "fiber" ? "4ms" : "8ms";
        addLog(`✓ DNS resolution test berhasil (${latency})`);
      }
    }, 2500);
  };

  const handleConnect = () => {
    // Check if configuration is valid
    const inNetwork = isIPInNetwork(ipAddress, gateway, subnetMask);

    if (!inNetwork && configMode === "manual") {
      setConnectionError("Konfigurasi IP tidak valid - IP tidak berada dalam jaringan yang sama dengan gateway");
      setStep("failed");
      addLog("❌ KONEKSI GAGAL: IP tidak dapat menjangkau gateway");
      addLog(`IP ${ipAddress} tidak berada dalam subnet yang sama dengan gateway ${gateway}`);
      return;
    }

    setStep("connecting");
    const cableName = cableType === "fiber" ? "kabel fiber optik" : "kabel ethernet";
    addLog(`Menghubungkan ${cableName}...`);

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
      addLog(`Kabel: ${cableName} (${cableType === "fiber" ? "10 Gbps" : "1 Gbps"})`);
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
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#0d1b2a]/95 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-400/70 hover:text-cyan-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-bold text-cyan-400 mb-2">
          Fase 3: Konfigurasi Jaringan
        </h2>
        <p className="text-cyan-300/70 text-sm mb-6 font-mono">
          {isRouter ? "Router Config // Routing & Interfaces" : "Network // Koneksi ke Internet"}
        </p>

        {step === "intro" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="card rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-cyan-300/90">
                <p className="font-semibold mb-2">Tentang Jaringan Komputer:</p>
                <ul className="space-y-2 text-cyan-300/70">
                  <li>
                    <strong className="text-cyan-400">IP Address:</strong> Alamat unik
                    untuk mengidentifikasi komputer di jaringan.
                  </li>
                  <li>
                    <strong className="text-cyan-400">Router:</strong> Perangkat yang
                    menghubungkan komputer ke internet dan jaringan lain.
                  </li>
                  <li>
                    <strong className="text-cyan-400">Data Packet:</strong> Data
                    dipecah menjadi paket-paket kecil saat ditransmisikan.
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-center">
                <Cable className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-cyan-300 font-semibold text-sm">Koneksi Fisik</p>
                <p className="text-cyan-400/50 text-xs mt-1">Kabel Ethernet RJ45</p>
              </div>
              <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4 text-center">
                <Settings className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-cyan-300 font-semibold text-sm">Konfigurasi IP</p>
                <p className="text-cyan-400/50 text-xs mt-1">DHCP / Manual</p>
              </div>
            </div>

            <button
              onClick={() => setStep("cable")}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Cable className="w-5 h-5" />
              Pilih Jenis Kabel
            </button>
          </motion.div>
        )}

        {step === "cable" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card rounded-lg p-4">
              <p className="text-sm text-cyan-300/80 mb-4">
                Pilih jenis kabel untuk koneksi jaringan:
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {cableTypes.map((cable) => (
                  <button
                    key={cable.id}
                    onClick={() => setCableType(cable.id as "ethernet" | "fiber")}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${cableType === cable.id
                      ? "border-cyan-500 bg-blue-950/30"
                      : "border-cyan-500/20 hover:border-cyan-500/40 bg-blue-950/10"
                      }`}
                  >
                    <div className="text-3xl mb-2">{cable.icon}</div>
                    <p className={`text-sm font-semibold ${cableType === cable.id ? "text-cyan-400" : "text-cyan-300"}`}>
                      {cable.name}
                    </p>
                    <p className="text-xs text-cyan-400/60 mt-1">Kecepatan: {cable.speed}</p>
                    <p className="text-xs text-cyan-400/60">Latensi: {cable.latency}</p>
                  </button>
                ))}
              </div>

              <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-3 text-xs text-cyan-300/70">
                <p><span className="text-blue-400 font-semibold">Ethernet Cat6:</span> Kabel tembaga standar, cocok untuk sebagian besar kebutuhan.</p>
                <p className="mt-1"><span className="text-cyan-400 font-semibold">Fiber Optik:</span> Menggunakan cahaya untuk transmisi data, lebih cepat dan stabil.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("intro")}
                className="flex-1 bg-blue-950/30 hover:bg-blue-900/30 text-cyan-300 border border-cyan-500/20 font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Kembali
              </button>
              <button
                onClick={() => setStep("configure")}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Settings className="w-5 h-5" />
                Konfigurasi IP
              </button>
            </div>
          </motion.div>
        )}

        {step === "configure" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card rounded-lg p-4">
              <p className="text-sm text-cyan-300/80 mb-4">
                {isRouter ? "Konfigurasi Antarmuka & Routing:" : "Pilih mode konfigurasi jaringan untuk komputer Anda:"}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {!isRouter ? (
                  <>
                    <button
                      onClick={() => setConfigMode("dhcp")}
                      className={`p-4 rounded-lg border-2 transition-all ${configMode === "dhcp"
                        ? "border-cyan-500 bg-blue-950/30"
                        : "border-cyan-500/20 hover:border-cyan-500/40 bg-blue-950/10"
                        }`}
                    >
                      <Zap className={`w-8 h-8 mx-auto mb-2 ${configMode === "dhcp" ? "text-cyan-400" : "text-cyan-400/40"}`} />
                      <p className="text-sm font-semibold text-cyan-300">DHCP</p>
                      <p className="text-xs text-cyan-400/60 mt-1">Otomatis</p>
                    </button>

                    <button
                      onClick={() => setConfigMode("manual")}
                      className={`p-4 rounded-lg border-2 transition-all ${configMode === "manual"
                        ? "border-cyan-500 bg-blue-950/30"
                        : "border-cyan-500/20 hover:border-cyan-500/40 bg-blue-950/10"
                        }`}
                    >
                      <Settings className={`w-8 h-8 mx-auto mb-2 ${configMode === "manual" ? "text-cyan-400" : "text-cyan-400/40"}`} />
                      <p className="text-sm font-semibold text-cyan-300">Manual</p>
                      <p className="text-xs text-cyan-400/60 mt-1">Custom</p>
                    </button>
                  </>
                ) : (
                  /* Router Mode Selector (Simplified as just Manual for now, could add CLI mode later) */
                  <div className="col-span-2 p-4 bg-cyan-900/20 border border-cyan-500/30 rounded-lg flex items-center gap-4">
                    <div className="bg-cyan-500/20 p-3 rounded-full">
                      <Settings className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-cyan-300">Router Configuration Mode</h4>
                      <p className="text-xs text-cyan-400/70">Configure interfaces, routing protocols, and services.</p>
                    </div>
                  </div>
                )}
              </div>

              {(configMode === "manual" || isRouter) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 border-t border-cyan-500/20 pt-4"
                >
                  <div>
                    <label className="text-xs text-cyan-300/80 mb-2 block font-mono">IP Address</label>
                    <input
                      type="text"
                      value={ipAddress}
                      onChange={(e) => { setIpAddress(e.target.value); setIpError(null); }}
                      onBlur={() => validateIP(ipAddress)}
                      placeholder="192.168.1.100"
                      className={`w-full bg-blue-950/30 border rounded px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none transition-colors ${ipError ? "border-red-500" : "border-cyan-500/20 focus:border-cyan-500"}`}
                    />
                    {ipError && <p className="text-red-400 text-xs mt-1">{ipError}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-cyan-300/80 mb-2 block font-mono">Subnet Mask</label>
                    <input
                      type="text"
                      value={subnetMask}
                      onChange={(e) => { setSubnetMask(e.target.value); setSubnetError(null); }}
                      onBlur={() => validateSubnet(subnetMask)}
                      placeholder="255.255.255.0"
                      className={`w-full bg-blue-950/30 border rounded px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none transition-colors ${subnetError ? "border-red-500" : "border-cyan-500/20 focus:border-cyan-500"}`}
                    />
                    {subnetError && <p className="text-red-400 text-xs mt-1">{subnetError}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-cyan-300/80 mb-2 block font-mono">Gateway</label>
                    <input
                      type="text"
                      value={gateway}
                      onChange={(e) => { setGateway(e.target.value); setGatewayError(null); }}
                      onBlur={() => validateGateway(gateway)}
                      placeholder="192.168.1.1"
                      className={`w-full bg-blue-950/30 border rounded px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none transition-colors ${gatewayError ? "border-red-500" : "border-cyan-500/20 focus:border-cyan-500"}`}
                    />
                    {gatewayError && <p className="text-red-400 text-xs mt-1">{gatewayError}</p>}
                  </div>

                  <div>
                    <label className="text-xs text-cyan-300/80 mb-2 block font-mono">DNS Server</label>
                    <input
                      type="text"
                      value={dns}
                      onChange={(e) => { setDns(e.target.value); setDnsError(null); }}
                      onBlur={() => validateDns(dns)}
                      placeholder="8.8.8.8"
                      className={`w-full bg-blue-950/30 border rounded px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none transition-colors ${dnsError ? "border-red-500" : "border-cyan-500/20 focus:border-cyan-500"}`}
                    />
                    {dnsError && <p className="text-red-400 text-xs mt-1">{dnsError}</p>}
                  </div>

                  <div className="bg-yellow-950/30 border border-yellow-600/30 rounded-lg p-3 text-xs text-yellow-400">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    Pastikan IP berada dalam subnet yang sama dengan gateway untuk koneksi berhasil.
                  </div>
                </motion.div>
              )}

              {isRouter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 border-t border-cyan-500/20 pt-4"
                >
                  {/* Interface Config */}
                  <div>
                    <h4 className="text-cyan-400 font-bold mb-2 flex items-center gap-2 text-sm">
                      <Cable className="w-4 h-4" /> Interface Configuration
                    </h4>
                    <div className="bg-black/20 p-3 rounded-lg border border-cyan-500/10 space-y-3">
                      <div className="flex gap-4 items-center">
                        <select
                          value={routerInterface}
                          onChange={(e) => setRouterInterface(e.target.value)}
                          className="bg-blue-950/40 border border-cyan-500/30 rounded px-3 py-2 text-sm text-cyan-300 outline-none focus:border-cyan-500"
                        >
                          <option value="FastEthernet0/0">FastEthernet0/0 (LAN)</option>
                          <option value="FastEthernet0/1">FastEthernet0/1 (WAN)</option>
                          <option value="Serial0/0/0">Serial0/0/0</option>
                        </select>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-cyan-500 uppercase font-bold">Status:</span>
                          <button
                            onClick={() => setInterfaceStatus(!interfaceStatus)}
                            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${interfaceStatus ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "bg-red-500/20 text-red-400 border border-red-500/50"}`}
                          >
                            {interfaceStatus ? "NO SHUTDOWN" : "SHUTDOWN"}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-cyan-500/70 block mb-1">IP Address</label>
                          <input
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            className="w-full bg-blue-900/20 border border-cyan-500/20 rounded px-2 py-1 text-sm text-cyan-300 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-cyan-500/70 block mb-1">Subnet Mask</label>
                          <input
                            value={subnetMask}
                            onChange={(e) => setSubnetMask(e.target.value)}
                            className="w-full bg-blue-900/20 border border-cyan-500/20 rounded px-2 py-1 text-sm text-cyan-300 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Routing Protocol */}
                  <div>
                    <h4 className="text-cyan-400 font-bold mb-2 flex items-center gap-2 text-sm">
                      <Settings className="w-4 h-4" /> Routing Protocol
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {(['static', 'rip', 'ospf'] as const).map(p => (
                        <button
                          key={p}
                          onClick={() => setRoutingProtocol(p)}
                          className={`py-2 px-3 rounded border text-xs font-bold uppercase transition-all ${routingProtocol === p ? "bg-cyan-500/20 border-cyan-500 text-cyan-300" : "bg-blue-950/20 border-cyan-500/10 text-cyan-500/50 hover:border-cyan-500/30"}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DHCP Server */}
                  <div className="flex items-center justify-between bg-cyan-900/10 p-4 rounded-lg border border-cyan-500/10">
                    <div>
                      <h4 className="text-cyan-300 font-bold text-sm">DHCP Server</h4>
                      <p className="text-xs text-cyan-500/60">Assign IPs to connected devices automatically</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={dhcpServerEnabled} onChange={() => setDhcpServerEnabled(!dhcpServerEnabled)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-blue-900/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                    </label>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("cable")}
                className="flex-1 bg-blue-950/30 hover:bg-blue-900/30 text-cyan-300 border border-cyan-500/20 font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Kembali
              </button>
              <button
                onClick={handleProceedToTest}
                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Tes Jaringan
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
            <div className="card rounded-lg p-4">
              <h3 className="text-sm font-semibold text-cyan-400 mb-4">Tes Diagnostik Jaringan</h3>

              <div className="space-y-4">
                {/* Ringkasan Konfigurasi */}
                <div className="bg-cyan-800 rounded-lg p-3 font-mono text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-cyan-500">Mode:</span>
                      <span className="text-white ml-2">{configMode.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-cyan-500">IP:</span>
                      <span className="text-emerald-400 ml-2">{ipAddress}</span>
                    </div>
                    <div>
                      <span className="text-cyan-500">Gateway:</span>
                      <span className="text-cyan-400 ml-2">{gateway}</span>
                    </div>
                    <div>
                      <span className="text-cyan-500">DNS:</span>
                      <span className="text-blue-400 ml-2">{dns}</span>
                    </div>
                  </div>
                </div>

                {/* Tes Ping */}
                <div className="card rounded-lg p-3 border border-cyan-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${pingTest === "idle" ? "bg-blue-900" :
                        pingTest === "testing" ? "bg-yellow-500 animate-pulse" :
                          pingTest === "success" ? "bg-cyan-500" : "bg-red-500"
                        }`} />
                      <div>
                        <p className="text-sm font-semibold text-cyan-300">Tes Ping</p>
                        <p className="text-xs text-cyan-500">Menguji koneksi ke gateway</p>
                      </div>
                    </div>
                    {pingTest === "success" && (
                      <span className="text-emerald-400 text-xs font-mono">1ms ✓</span>
                    )}
                  </div>
                </div>

                {/* Tes DNS */}
                <div className="card rounded-lg p-3 border border-cyan-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${dnsTest === "idle" ? "bg-blue-900" :
                        dnsTest === "testing" ? "bg-yellow-500 animate-pulse" :
                          dnsTest === "success" ? "bg-cyan-500" : "bg-red-500"
                        }`} />
                      <div>
                        <p className="text-sm font-semibold text-cyan-300">Resolusi DNS</p>
                        <p className="text-xs text-cyan-500">Menguji respon server DNS</p>
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
                className="flex-1 bg-blue-950/30 hover:bg-blue-900/30 text-cyan-300 border border-cyan-500/20 font-semibold py-3 rounded-lg transition-all duration-200"
              >
                Kembali
              </button>

              {pingTest === "idle" ? (
                <button
                  onClick={handleRunTests}
                  className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Jalankan Tes
                </button>
              ) : pingTest === "success" && dnsTest === "success" ? (
                <button
                  onClick={handleConnect}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Cable className="w-5 h-5" />
                  Terapkan Konfigurasi
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-cyan-700 text-cyan-500 font-semibold py-3 rounded-lg cursor-wait"
                >
                  Menguji...
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
              <Zap className="w-16 h-16 text-cyan-400" />
            </motion.div>
            <p className="mt-6 text-cyan-300 font-mono">Menghubungkan ke jaringan...</p>

            <div className="mt-6 flex gap-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-cyan-500 rounded-full"
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
            <div className="bg-blue-950/30 border border-cyan-500/30 rounded-lg p-6 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
              </motion.div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                Koneksi Berhasil!
              </h3>
              <p className="text-cyan-400 mb-4">
                Komputer berhasil terhubung ke jaringan.
              </p>

              <div className="card rounded-lg p-4 text-left font-mono text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-500">IP Address:</span>
                  <span className="text-cyan-400">{ipAddress}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-300/50">Gateway:</span>
                  <span className="text-cyan-400">{gateway}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-300/50">Kabel:</span>
                  <span className="text-blue-400">{cableType === "fiber" ? "Fiber Optik" : "Ethernet Cat6"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-300/50">Status:</span>
                  <span className="text-cyan-400">Terhubung</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold py-3 rounded-lg transition-all duration-200"
            >
              Selesai - Lab Virtual Siap!
            </button>
          </motion.div>
        )}

        {step === "failed" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center py-8">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-4" />
              </motion.div>

              <h3 className="text-2xl font-bold text-red-400 mb-2">
                Koneksi Gagal!
              </h3>
              <p className="text-cyan-400 mb-4">
                {connectionError || "Terjadi kesalahan saat menghubungkan ke jaringan."}
              </p>

              <div className="card rounded-lg p-4 text-left font-mono text-sm border-red-500/30">
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-500">IP Address:</span>
                  <span className="text-red-400">{ipAddress}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-500">Gateway:</span>
                  <span className="text-cyan-400">{gateway}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-cyan-500">Subnet:</span>
                  <span className="text-cyan-400">{subnetMask}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-500">Status:</span>
                  <span className="text-red-400">Tidak Terhubung</span>
                </div>
              </div>

              <div className="bg-red-950/30 border border-red-600/30 rounded-lg p-3 text-xs text-red-400 mt-4 text-left">
                <p className="font-semibold mb-1">💡 Tips Perbaikan:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Pastikan IP address berada dalam rentang subnet yang sama dengan gateway</li>
                  <li>Contoh: Gateway 192.168.1.1 memerlukan IP 192.168.1.x</li>
                  <li>Gunakan mode DHCP untuk konfigurasi otomatis</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setStep("configure"); setConnectionError(null); setPingTest("idle"); setDnsTest("idle"); }}
                className="flex-1 bg-cyan-800 hover:bg-cyan-700 text-cyan-300 font-semibold py-3 rounded-lg transition-colors"
              >
                ← Konfigurasi Ulang
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
