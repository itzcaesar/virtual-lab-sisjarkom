// Performance calculation utilities

export interface HardwareSpecs {
  cpu: string;
  ram: string;
  storage: string;
  gpu: string;
}

export interface NetworkConfig {
  ip: string;
  subnet: string;
  gateway: string;
  dns: string;
}

export interface DetailedHardwareInfo {
  cpuCores: number;
  cpuThreads: number;
  cpuFrequency: string;
  ramGB: number;
  ramType: string;
  storageGB: number;
  storageType: string;
  gpuCores: number;
  gpuVRAM: number;
}

export interface PerformanceMetrics {
  overall: number; // 0-100
  cpuScore: number;
  ramScore: number;
  storageScore: number;
  gpuScore: number;
  networkScore: number;
  vmBootTime: number; // milliseconds
  browserLoadTime: number; // milliseconds
  appResponseTime: number; // milliseconds
  hardwareDetails?: DetailedHardwareInfo;
}

// Parse CPU specs to get cores, threads, frequency
export const parseCPUSpecs = (cpu: string): { cores: number; threads: number; frequency: string } => {
  // Try to extract from bracket notation first: [12 Cores / 20 Threads @ 3.6GHz]
  const bracketMatch = cpu.match(/\[(\d+)\s*Cores\s*\/\s*(\d+)\s*Threads\s*@\s*([\d.]+GHz)\]/i);
  if (bracketMatch) {
    return { cores: parseInt(bracketMatch[1]), threads: parseInt(bracketMatch[2]), frequency: bracketMatch[3] };
  }
  
  // Fallback to model-based detection
  if (cpu.includes("i9-13900K")) return { cores: 24, threads: 32, frequency: "5.8 GHz" };
  if (cpu.includes("Ryzen 9")) return { cores: 16, threads: 32, frequency: "5.7 GHz" };
  if (cpu.includes("i7-12700K")) return { cores: 12, threads: 20, frequency: "5.0 GHz" };
  if (cpu.includes("Ryzen 7 5800X")) return { cores: 8, threads: 16, frequency: "4.7 GHz" };
  if (cpu.includes("i5-12400")) return { cores: 6, threads: 12, frequency: "4.4 GHz" };
  if (cpu.includes("Ryzen 5")) return { cores: 6, threads: 12, frequency: "4.6 GHz" };
  return { cores: 4, threads: 8, frequency: "3.5 GHz" };
};

// Parse RAM specs to get GB and type
export const parseRAMSpecs = (ram: string): { gb: number; type: string } => {
  const gbMatch = ram.match(/(\d+)GB/);
  const gb = gbMatch ? parseInt(gbMatch[1]) : 8;
  const type = ram.includes("DDR5") ? "DDR5" : "DDR4";
  return { gb, type };
};

// Parse storage specs to get size and type
export const parseStorageSpecs = (storage: string): { gb: number; type: string } => {
  const sizeMatch = storage.match(/(\d+)(TB|GB)/);
  let gb = 512;
  if (sizeMatch) {
    gb = sizeMatch[2] === "TB" ? parseInt(sizeMatch[1]) * 1024 : parseInt(sizeMatch[1]);
  }
  const type = storage.includes("NVMe") ? "NVMe SSD" : storage.includes("SATA") ? "SATA SSD" : "HDD";
  return { gb, type };
};

// Parse GPU specs to get cores and VRAM
export const parseGPUSpecs = (gpu: string): { cores: number; vram: number } => {
  // Try to extract from bracket notation first: [3584 Cores, 12GB GDDR6]
  const bracketMatch = gpu.match(/\[(\d+)\s*Cores,\s*(\d+)GB/i);
  if (bracketMatch) {
    return { cores: parseInt(bracketMatch[1]), vram: parseInt(bracketMatch[2]) };
  }
  
  // Fallback to model-based detection
  if (gpu.includes("RTX 4090")) return { cores: 16384, vram: 24 };
  if (gpu.includes("RTX 4080")) return { cores: 9728, vram: 16 };
  if (gpu.includes("RTX 4070")) return { cores: 5888, vram: 12 };
  if (gpu.includes("RTX 3080")) return { cores: 8704, vram: 10 };
  if (gpu.includes("RTX 3070")) return { cores: 5888, vram: 8 };
  if (gpu.includes("RTX 3060")) return { cores: 3584, vram: 12 };
  if (gpu.includes("RX 6700 XT")) return { cores: 2560, vram: 12 };
  if (gpu.includes("GTX 1660")) return { cores: 1408, vram: 6 };
  return { cores: 1024, vram: 4 };
};

// CPU scoring
const getCPUScore = (cpu: string): number => {
  if (cpu.includes("i9-13900K") || cpu.includes("Ryzen 9")) return 95;
  if (cpu.includes("i7-12700K") || cpu.includes("Ryzen 7")) return 85;
  if (cpu.includes("i5-12400") || cpu.includes("Ryzen 5")) return 70;
  return 50;
};

// RAM scoring
const getRAMScore = (ram: string): number => {
  if (ram.includes("32GB") && ram.includes("DDR5")) return 95;
  if (ram.includes("32GB") && ram.includes("DDR4")) return 85;
  if (ram.includes("16GB") && ram.includes("DDR5")) return 80;
  if (ram.includes("16GB") && ram.includes("DDR4")) return 70;
  if (ram.includes("8GB")) return 50;
  return 40;
};

// Storage scoring
const getStorageScore = (storage: string): number => {
  if (storage.includes("2TB") && storage.includes("NVMe")) return 95;
  if (storage.includes("1TB") && storage.includes("NVMe") && storage.includes("7000MB/s")) return 90;
  if (storage.includes("512GB") && storage.includes("NVMe")) return 75;
  if (storage.includes("256GB") && storage.includes("NVMe")) return 65;
  if (storage.includes("SATA")) return 50;
  return 40;
};

// GPU scoring
const getGPUScore = (gpu: string): number => {
  if (gpu.includes("RTX 4090") || gpu.includes("RTX 4080")) return 98;
  if (gpu.includes("RTX 3080") || gpu.includes("RTX 3070")) return 85;
  if (gpu.includes("RTX 3060") || gpu.includes("GTX 1660")) return 70;
  if (gpu.includes("Integrated")) return 40;
  return 30;
};

// Network scoring
const getNetworkScore = (config: NetworkConfig): number => {
  let score = 50; // Base score
  
  // DNS quality (Google DNS, Cloudflare, etc.)
  if (config.dns === "8.8.8.8" || config.dns === "1.1.1.1") {
    score += 25;
  } else if (config.dns.includes("8.8")) {
    score += 15;
  }
  
  // Valid IP configuration
  if (isValidIP(config.ip)) score += 10;
  if (isValidIP(config.gateway)) score += 10;
  if (config.subnet === "255.255.255.0") score += 5;
  
  return Math.min(score, 100);
};

// IP validation helper
const isValidIP = (ip: string): boolean => {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every(part => {
    const num = parseInt(part);
    return num >= 0 && num <= 255;
  });
};

// Calculate overall performance
export const calculatePerformance = (
  hardware: HardwareSpecs,
  network?: NetworkConfig
): PerformanceMetrics => {
  const cpuScore = getCPUScore(hardware.cpu);
  const ramScore = getRAMScore(hardware.ram);
  const storageScore = getStorageScore(hardware.storage);
  const gpuScore = getGPUScore(hardware.gpu);
  const networkScore = network ? getNetworkScore(network) : 50;
  
  // Parse detailed hardware info
  const cpuSpecs = parseCPUSpecs(hardware.cpu);
  const ramSpecs = parseRAMSpecs(hardware.ram);
  const storageSpecs = parseStorageSpecs(hardware.storage);
  const gpuSpecs = parseGPUSpecs(hardware.gpu);
  
  const hardwareDetails: DetailedHardwareInfo = {
    cpuCores: cpuSpecs.cores,
    cpuThreads: cpuSpecs.threads,
    cpuFrequency: cpuSpecs.frequency,
    ramGB: ramSpecs.gb,
    ramType: ramSpecs.type,
    storageGB: storageSpecs.gb,
    storageType: storageSpecs.type,
    gpuCores: gpuSpecs.cores,
    gpuVRAM: gpuSpecs.vram,
  };
  
  // Overall score (weighted average)
  const overall = Math.round(
    cpuScore * 0.3 +
    ramScore * 0.25 +
    storageScore * 0.15 +
    gpuScore * 0.2 +
    networkScore * 0.1
  );
  
  // Performance impacts
  // VM Boot Time: lower is better (500ms - 5000ms range)
  const vmBootTime = Math.max(500, 5000 - (overall * 45));
  
  // Browser Load Time: lower is better (300ms - 3000ms range)
  const browserLoadTime = Math.max(300, 3000 - (overall * 27) - (networkScore * 10));
  
  // App Response Time: lower is better (100ms - 1000ms range)
  const appResponseTime = Math.max(100, 1000 - (overall * 9));
  
  return {
    overall,
    cpuScore,
    ramScore,
    storageScore,
    gpuScore,
    networkScore,
    vmBootTime,
    browserLoadTime,
    appResponseTime,
    hardwareDetails,
  };
};

// Get performance tier/rating
export const getPerformanceTier = (score: number): { tier: string; color: string; description: string } => {
  if (score >= 90) return { 
    tier: "Excellent", 
    color: "text-emerald-400", 
    description: "Performa luar biasa! Semua aplikasi berjalan dengan sangat responsif." 
  };
  if (score >= 75) return { 
    tier: "Good", 
    color: "text-cyan-400", 
    description: "Performa bagus. Cocok untuk multitasking dan aplikasi berat." 
  };
  if (score >= 60) return { 
    tier: "Average", 
    color: "text-yellow-400", 
    description: "Performa standar. Cukup untuk penggunaan sehari-hari." 
  };
  if (score >= 40) return { 
    tier: "Below Average", 
    color: "text-orange-400", 
    description: "Performa di bawah rata-rata. Beberapa aplikasi mungkin lambat." 
  };
  return { 
    tier: "Poor", 
    color: "text-red-400", 
    description: "Performa rendah. Upgrade komponen disarankan." 
  };
};

// Get performance recommendations
export const getPerformanceRecommendations = (metrics: PerformanceMetrics): string[] => {
  const recommendations: string[] = [];
  
  if (metrics.cpuScore < 70) {
    recommendations.push("Upgrade CPU untuk performa yang lebih baik di multitasking");
  }
  if (metrics.ramScore < 70) {
    recommendations.push("Tambah kapasitas RAM untuk menjalankan lebih banyak aplikasi");
  }
  if (metrics.storageScore < 60) {
    recommendations.push("Gunakan NVMe SSD untuk boot time dan loading yang lebih cepat");
  }
  if (metrics.gpuScore < 50) {
    recommendations.push("Pertimbangkan dedicated GPU untuk grafis yang lebih baik");
  }
  if (metrics.networkScore < 70) {
    recommendations.push("Gunakan DNS server yang lebih cepat (8.8.8.8 atau 1.1.1.1)");
  }
  
  if (recommendations.length === 0) {
    recommendations.push("Sistem sudah optimal! Tidak ada rekomendasi upgrade.");
  }
  
  return recommendations;
};
