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
}

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
