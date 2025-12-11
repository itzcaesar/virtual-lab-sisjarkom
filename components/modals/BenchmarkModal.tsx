"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, MemoryStick, HardDrive, Monitor as MonitorIcon, Zap, CheckCircle, Loader2, TrendingUp, Award, Clock, Thermometer } from "lucide-react";
import { useState, useEffect } from "react";
import { parseCPUSpecs, parseRAMSpecs, parseStorageSpecs, parseGPUSpecs } from "@/lib/performance";

interface BenchmarkModalProps {
  onClose: () => void;
  hardware: {
    cpu: string;
    ram: string;
    storage: string;
    gpu: string;
  };
}

interface BenchmarkTest {
  name: string;
  component: string;
  icon: any;
  status: "pending" | "running" | "completed";
  score: number;
  maxScore: number;
  description: string;
  color: string;
  fps?: number;
  latency?: number;
  temperature?: number;
}

interface DetailedMetrics {
  totalTests: number;
  passedTests: number;
  avgFPS: number;
  avgLatency: number;
  peakTemp: number;
  runTime: number;
}

export default function BenchmarkModal({ onClose, hardware }: BenchmarkModalProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [overallScore, setOverallScore] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [metrics, setMetrics] = useState<DetailedMetrics>({
    totalTests: 6,
    passedTests: 0,
    avgFPS: 0,
    avgLatency: 0,
    peakTemp: 0,
    runTime: 0,
  });

  // Parse hardware specs
  const cpuInfo = parseCPUSpecs(hardware.cpu);
  const ramInfo = parseRAMSpecs(hardware.ram);
  const storageInfo = parseStorageSpecs(hardware.storage);
  const gpuInfo = parseGPUSpecs(hardware.gpu);

  // Calculate scores based on hardware
  const calculateCPUScore = () => {
    const baseScore = (cpuInfo.cores * 100) + (cpuInfo.threads * 50);
    const freqBonus = parseFloat(cpuInfo.frequency) * 100;
    return Math.min(Math.round(baseScore + freqBonus), 10000);
  };

  const calculateRAMScore = () => {
    const sizeScore = ramInfo.gb * 100;
    const typeBonus = ramInfo.type === "DDR5" ? 500 : 300;
    return Math.min(Math.round(sizeScore + typeBonus), 5000);
  };

  const calculateStorageScore = () => {
    const sizeScore = (storageInfo.gb / 1024) * 500;
    const typeBonus = storageInfo.type === "NVMe SSD" ? 1000 : storageInfo.type === "SATA SSD" ? 500 : 200;
    return Math.min(Math.round(sizeScore + typeBonus), 3000);
  };

  const calculateGPUScore = () => {
    const coresScore = (gpuInfo.cores / 10);
    const vramBonus = gpuInfo.vram * 100;
    return Math.min(Math.round(coresScore + vramBonus), 20000);
  };

  const [tests, setTests] = useState<BenchmarkTest[]>([
    {
      name: "CPU Single-Core",
      component: "CPU",
      icon: Cpu,
      status: "pending",
      score: 0,
      maxScore: calculateCPUScore(),
      description: `${cpuInfo.cores} Cores / ${cpuInfo.threads} Threads @ ${cpuInfo.frequency}`,
      color: "blue",
      latency: 0,
      temperature: 0,
    },
    {
      name: "CPU Multi-Core",
      component: "CPU",
      icon: Cpu,
      status: "pending",
      score: 0,
      maxScore: calculateCPUScore() * 1.5,
      description: "Parallel processing test",
      color: "blue",
      latency: 0,
      temperature: 0,
    },
    {
      name: "RAM Speed",
      component: "RAM",
      icon: MemoryStick,
      status: "pending",
      score: 0,
      maxScore: calculateRAMScore(),
      description: `${ramInfo.gb}GB ${ramInfo.type}`,
      color: "cyan",
      latency: 0,
      temperature: 0,
    },
    {
      name: "Storage Read/Write",
      component: "Storage",
      icon: HardDrive,
      status: "pending",
      score: 0,
      maxScore: calculateStorageScore(),
      description: `${storageInfo.gb >= 1024 ? (storageInfo.gb / 1024).toFixed(1) + "TB" : storageInfo.gb + "GB"} ${storageInfo.type}`,
      color: "blue",
      latency: 0,
      temperature: 0,
    },
    {
      name: "GPU Compute",
      component: "GPU",
      icon: MonitorIcon,
      status: "pending",
      score: 0,
      maxScore: calculateGPUScore(),
      description: `${gpuInfo.cores} Cores / ${gpuInfo.vram}GB VRAM`,
      color: "purple",
      fps: 0,
      temperature: 0,
    },
    {
      name: "GPU Graphics",
      component: "GPU",
      icon: MonitorIcon,
      status: "pending",
      score: 0,
      maxScore: calculateGPUScore() * 0.8,
      description: "3D rendering performance",
      color: "purple",
      fps: 0,
      temperature: 0,
    },
  ]);

  const runBenchmark = async () => {
    setIsRunning(true);
    setCurrentTestIndex(0);
    setStartTime(Date.now());
    
    let totalFPS = 0;
    let totalLatency = 0;
    let peakTemp = 0;
    let passedCount = 0;

    for (let i = 0; i < tests.length; i++) {
      setCurrentTestIndex(i);
      
      // Mark test as running
      setTests((prev) =>
        prev.map((test, idx) =>
          idx === i ? { ...test, status: "running" } : test
        )
      );

      // Simulate benchmark with progressive scoring and metrics
      const targetScore = tests[i].maxScore;
      const steps = 20;
      const increment = targetScore / steps;
      
      // Generate random metrics based on component
      const isGPU = tests[i].component === "GPU";
      const targetFPS = isGPU ? Math.floor(60 + Math.random() * 180) : 0;
      const targetLatency = !isGPU ? Math.floor(1 + Math.random() * 10) : 0;
      const targetTemp = 45 + Math.floor(Math.random() * 40); // 45-85°C
      
      for (let step = 0; step <= steps; step++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const currentScore = Math.round(increment * step);
        const progress = step / steps;
        
        setTests((prev) =>
          prev.map((test, idx) =>
            idx === i ? { 
              ...test, 
              score: currentScore,
              fps: isGPU ? Math.round(targetFPS * progress) : undefined,
              latency: !isGPU ? Math.round(targetLatency * progress) : undefined,
              temperature: Math.round(targetTemp * progress),
            } : test
          )
        );
      }

      // Finalize metrics
      if (isGPU) {
        totalFPS += targetFPS;
      } else {
        totalLatency += targetLatency;
      }
      
      if (targetTemp > peakTemp) peakTemp = targetTemp;
      
      // Mark as passed if score is at least 60% of max
      if (targetScore >= tests[i].maxScore * 0.6) {
        passedCount++;
      }

      // Mark test as completed
      setTests((prev) =>
        prev.map((test, idx) =>
          idx === i ? { 
            ...test, 
            status: "completed", 
            score: targetScore,
            fps: isGPU ? targetFPS : undefined,
            latency: !isGPU ? targetLatency : undefined,
            temperature: targetTemp,
          } : test
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Calculate overall metrics
    const runTime = Math.round((Date.now() - startTime) / 1000);
    const totalScore = tests.reduce((sum, test) => sum + test.score, 0);
    const maxTotalScore = tests.reduce((sum, test) => sum + test.maxScore, 0);
    const overall = Math.round((totalScore / maxTotalScore) * 100);
    
    setOverallScore(overall);
    setMetrics({
      totalTests: tests.length,
      passedTests: passedCount,
      avgFPS: Math.round(totalFPS / 2), // 2 GPU tests
      avgLatency: Math.round(totalLatency / 4), // 4 non-GPU tests
      peakTemp: peakTemp,
      runTime: runTime,
    });
    
    setIsRunning(false);
    setCurrentTestIndex(-1);
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return "text-emerald-400";
    if (percentage >= 60) return "text-cyan-400";
    if (percentage >= 40) return "text-yellow-400";
    return "text-orange-400";
  };

  const getOverallRating = (score: number) => {
    if (score >= 90) return { text: "Excellent", color: "text-emerald-400" };
    if (score >= 75) return { text: "Very Good", color: "text-cyan-400" };
    if (score >= 60) return { text: "Good", color: "text-blue-400" };
    if (score >= 45) return { text: "Average", color: "text-yellow-400" };
    return { text: "Below Average", color: "text-orange-400" };
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-[#0d1b2a]/95 backdrop-blur-xl border-2 border-cyan-500/30 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/10"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0d1b2a]/95 backdrop-blur-xl border-b border-cyan-500/20 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-cyan-400 font-mono">System Benchmark</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-blue-950/30 rounded-lg transition-all duration-200"
          >
            <X className="w-5 h-5 text-cyan-400/70" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overall Score */}
          {overallScore > 0 && (
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-950/30 border border-cyan-500/30 rounded-lg p-6 text-center"
              >
                <p className="text-sm text-cyan-300/70 mb-2">Overall Performance Score</p>
                <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {overallScore}
                </div>
                <p className={`text-xl font-semibold ${getOverallRating(overallScore).color}`}>
                  {getOverallRating(overallScore).text}
                </p>
              </motion.div>

              {/* Detailed Metrics Summary */}
              {metrics && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-blue-950/30 border border-cyan-500/30 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-semibold text-cyan-300 font-mono">Performance Metrics</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#0a1628]/50 border border-cyan-500/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-300/70">Tests Passed</span>
                      </div>
                      <p className="text-xl font-bold text-cyan-300 font-mono">
                        {metrics.passedTests}/{metrics.totalTests}
                      </p>
                    </div>

                    <div className="bg-[#0a1628]/50 border border-cyan-500/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-300/70">Runtime</span>
                      </div>
                      <p className="text-xl font-bold text-cyan-300 font-mono">
                        {metrics.runTime}s
                      </p>
                    </div>

                    <div className="bg-[#0a1628]/50 border border-cyan-500/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-300/70">Avg FPS (GPU)</span>
                      </div>
                      <p className={`text-xl font-bold font-mono ${metrics.avgFPS >= 120 ? 'text-cyan-400' : metrics.avgFPS >= 60 ? 'text-blue-400' : 'text-yellow-400'}`}>
                        {metrics.avgFPS}
                      </p>
                    </div>

                    <div className="bg-[#0a1628]/50 border border-cyan-500/10 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs text-cyan-300/70">Avg Latency</span>
                      </div>
                      <p className={`text-xl font-bold font-mono ${metrics.avgLatency <= 3 ? 'text-cyan-400' : metrics.avgLatency <= 6 ? 'text-blue-400' : 'text-yellow-400'}`}>
                        {metrics.avgLatency}ms
                      </p>
                    </div>

                    <div className="bg-[#0a1628]/50 border border-cyan-500/10 rounded-lg p-3 col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Thermometer className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-cyan-300/70">Peak Temperature</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-xl font-bold font-mono ${metrics.peakTemp <= 65 ? 'text-cyan-400' : metrics.peakTemp <= 75 ? 'text-yellow-400' : 'text-orange-400'}`}>
                          {metrics.peakTemp}°C
                        </p>
                        <span className="text-xs text-cyan-400/50">
                          {metrics.peakTemp <= 65 ? '(Optimal)' : metrics.peakTemp <= 75 ? '(Good)' : metrics.peakTemp <= 85 ? '(Warm)' : '(Hot)'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Benchmark Tests */}
          <div className="space-y-4">
            {tests.map((test, index) => {
              const Icon = test.icon;
              const isActive = currentTestIndex === index;
              const percentage = test.maxScore > 0 ? (test.score / test.maxScore) * 100 : 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-blue-950/30 border rounded-lg p-4 transition-all duration-200 ${
                    isActive ? "border-cyan-500 shadow-lg shadow-cyan-500/20" : "border-cyan-500/20"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${test.color}-500/10`}>
                        <Icon className={`w-5 h-5 text-${test.color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-cyan-300 font-mono">{test.name}</h3>
                        <p className="text-xs text-cyan-300/70">{test.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.status === "completed" && (
                        <CheckCircle className="w-5 h-5 text-cyan-400" />
                      )}
                      {test.status === "running" && (
                        <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                      )}
                      {test.status === "pending" && (
                        <div className="w-5 h-5 rounded-full border-2 border-cyan-500/30" />
                      )}
                    </div>
                  </div>

                  {/* Score Display */}
                  {test.score > 0 && (
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-cyan-400/50">Score</span>
                          <span className={`text-sm font-bold font-mono ${getScoreColor(test.score, test.maxScore)}`}>
                            {test.score.toLocaleString()} / {test.maxScore.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-[#0a1628] rounded-full h-2 overflow-hidden border border-cyan-500/20">
                          <motion.div
                            className={`h-full ${
                              test.color === 'emerald' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                              test.color === 'cyan' ? 'bg-gradient-to-r from-cyan-500 to-blue-400' :
                              test.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                              test.color === 'purple' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                              'bg-gradient-to-r from-cyan-500 to-blue-400'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>
                      
                      {/* Performance Metrics */}
                      {(test.fps !== undefined || test.latency !== undefined || test.temperature !== undefined) && (
                        <div className="flex gap-3 text-xs">
                          {test.fps !== undefined && test.fps > 0 && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3 text-cyan-400" />
                              <span className="text-cyan-400/70">FPS:</span>
                              <span className={`font-mono font-semibold ${test.fps >= 120 ? 'text-cyan-400' : test.fps >= 60 ? 'text-blue-400' : 'text-yellow-400'}`}>
                                {test.fps}
                              </span>
                            </div>
                          )}
                          {test.latency !== undefined && test.latency > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              <span className="text-cyan-400/70">Latency:</span>
                              <span className={`font-mono font-semibold ${test.latency <= 3 ? 'text-cyan-400' : test.latency <= 6 ? 'text-blue-400' : 'text-yellow-400'}`}>
                                {test.latency}ms
                              </span>
                            </div>
                          )}
                          {test.temperature !== undefined && test.temperature > 0 && (
                            <div className="flex items-center gap-1">
                              <Thermometer className="w-3 h-3 text-orange-400" />
                              <span className="text-cyan-400/70">Temp:</span>
                              <span className={`font-mono font-semibold ${test.temperature <= 65 ? 'text-cyan-400' : test.temperature <= 75 ? 'text-yellow-400' : 'text-orange-400'}`}>
                                {test.temperature}°C
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Run Benchmark Button */}
          <motion.button
            onClick={runBenchmark}
            disabled={isRunning}
            className={`w-full py-4 rounded-lg font-semibold font-mono transition-all duration-200 flex items-center justify-center gap-2 ${
              isRunning
                ? "bg-blue-950/30 text-cyan-400/50 cursor-not-allowed border-2 border-cyan-500/20"
                : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-2 border-cyan-500/30"
            }`}
            whileHover={!isRunning ? { scale: 1.02 } : {}}
            whileTap={!isRunning ? { scale: 0.98 } : {}}
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Benchmark... {currentTestIndex + 1}/{tests.length}
              </>
            ) : overallScore > 0 ? (
              <>
                <Zap className="w-5 h-5" />
                Run Again
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Start Benchmark
              </>
            )}
          </motion.button>

          {/* Info */}
          <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-4">
            <p className="text-xs text-cyan-300/70 text-center">
              💡 Benchmark akan menguji performa CPU, RAM, Storage, dan GPU berdasarkan spesifikasi hardware yang terpasang
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
