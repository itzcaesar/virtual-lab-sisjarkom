"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, X, ChevronRight, Cpu, Monitor, Cable, Zap, HardDrive, MemoryStick, Wifi, Info } from "lucide-react";
import { useState } from "react";

type WikiSection = "hardware" | "os" | "network" | "overview";

interface WikiTopic {
  id: string;
  title: string;
  icon: any;
  content: string;
  tips: string[];
}

interface WikiPanelProps {
  currentPhase: WikiSection;
  onClose: () => void;
}

const wikiData: Record<WikiSection, WikiTopic[]> = {
  overview: [
    {
      id: "intro",
      title: "Selamat Datang di Virtual Lab",
      icon: BookOpen,
      content: "Virtual Lab adalah simulator interaktif bergaya Cisco Packet Tracer untuk mempelajari cara membangun dan mengkonfigurasi komputer dari nol. Drag & drop modules di canvas, hubungkan dengan kabel, dan konfigurasi setiap komponen.",
      tips: [
        "Gunakan canvas presets untuk setup cepat (Simple Network, Multi-PC Lab, Server Room)",
        "Drag modul PC, Monitor, dan Router ke canvas",
        "Klik kanan modul untuk menghubungkan kabel",
        "Klik modul untuk membuka konfigurasi",
        "Performa sistem dipengaruhi oleh komponen yang Anda pilih",
      ],
    },
    {
      id: "canvas",
      title: "Drag & Drop Canvas",
      icon: Monitor,
      content: "Canvas adalah workspace utama tempat Anda membangun topologi jaringan. Drag modul, posisikan secara bebas, dan hubungkan dengan kabel power atau ethernet.",
      tips: [
        "Klik tombol 'Add PC/Monitor/Router' untuk menambah modul",
        "Drag modul untuk memindahkan posisi",
        "Klik kanan modul → Klik modul lain untuk menghubungkan kabel",
        "Toggle 'Delete Mode' untuk menghapus modul",
        "Gunakan preset untuk load konfigurasi siap pakai",
        "Canvas mendukung unlimited modul dan kabel",
      ],
    },
    {
      id: "presets",
      title: "Canvas & Motherboard Presets",
      icon: Zap,
      content: "Presets memungkinkan Anda memuat konfigurasi siap pakai tanpa drag & drop manual. Tersedia untuk canvas (Simple Network, Multi-PC Lab, Server Room) dan motherboard (Budget, Mid-Range, High-End).",
      tips: [
        "Canvas Presets: Load topologi jaringan lengkap dengan 1 klik",
        "Motherboard Presets: Install semua komponen sesuai budget/performa",
        "Budget Build ($): Entry-level, cocok untuk tugas ringan",
        "Mid-Range Build ($$): Balanced, cocok untuk multitasking",
        "High-End Build ($$$): Maximum performance untuk gaming/workstation",
      ],
    },
    {
      id: "performance",
      title: "Sistem Performa",
      icon: Zap,
      content: "Performa komputer virtual Anda ditentukan oleh kombinasi hardware dan konfigurasi jaringan. Spesifikasi yang lebih tinggi menghasilkan VM yang lebih responsif.",
      tips: [
        "CPU dan RAM mempengaruhi kecepatan aplikasi",
        "GPU penting untuk tampilan visual yang smooth",
        "Storage SSD lebih cepat dari HDD",
        "Konfigurasi jaringan mempengaruhi kecepatan internet",
        "Preset High-End memberikan performa maksimal",
      ],
    },
  ],
  hardware: [
    {
      id: "motherboard",
      title: "Motherboard & Socket",
      icon: Cpu,
      content: "Motherboard adalah papan sirkuit utama yang menghubungkan semua komponen. Gunakan Quick Presets untuk auto-install atau drag manual setiap komponen ke socket yang benar.",
      tips: [
        "3 Quick Presets tersedia: Budget ($), Mid-Range ($$), High-End ($$$)",
        "Klik preset untuk install semua komponen otomatis",
        "Atau drag komponen manual dari katalog ke socket",
        "CPU → Socket CPU (tengah atas)",
        "RAM → RAM Slots (2 slot di kanan)",
        "GPU → PCIe x16 Slot (slot horizontal panjang)",
        "Storage → SATA Port (kanan bawah)",
        "Semua komponen di katalog bisa digunakan unlimited (∞)",
      ],
    },
    {
      id: "cpu",
      title: "CPU (Processor)",
      icon: Cpu,
      content: "CPU adalah 'otak' komputer yang memproses semua instruksi. Clock speed (GHz) dan jumlah core menentukan kecepatan pemrosesan.",
      tips: [
        "Lebih banyak core = lebih baik untuk multitasking",
        "Clock speed tinggi = pemrosesan lebih cepat",
        "CPU modern menggunakan socket LGA atau AM4",
        "Perhatikan TDP (konsumsi daya)",
      ],
    },
    {
      id: "ram",
      title: "RAM (Memory)",
      icon: MemoryStick,
      content: "RAM adalah memori temporary untuk menyimpan data yang sedang diproses. Lebih banyak RAM memungkinkan menjalankan lebih banyak program sekaligus.",
      tips: [
        "Minimal 8GB untuk penggunaan dasar",
        "16GB ideal untuk multitasking dan gaming",
        "32GB+ untuk workstation profesional",
        "Pastikan DDR generation cocok dengan motherboard",
      ],
    },
    {
      id: "storage",
      title: "Storage (HDD/SSD)",
      icon: HardDrive,
      content: "Storage adalah tempat penyimpanan permanen untuk OS, aplikasi, dan file. SSD jauh lebih cepat dari HDD tetapi lebih mahal per GB.",
      tips: [
        "SSD untuk OS dan aplikasi (boot time cepat)",
        "HDD untuk penyimpanan besar dengan budget terbatas",
        "NVMe SSD adalah yang tercepat (via M.2 slot)",
        "Minimal 256GB untuk sistem modern",
      ],
    },
    {
      id: "gpu",
      title: "GPU (Graphics Card)",
      icon: Monitor,
      content: "GPU memproses grafis dan rendering visual. Integrated GPU cukup untuk pekerjaan dasar, dedicated GPU diperlukan untuk gaming/rendering.",
      tips: [
        "Integrated GPU (Intel/AMD) untuk browsing dan office",
        "Dedicated GPU untuk gaming, video editing, 3D rendering",
        "VRAM (4GB+) penting untuk resolusi tinggi",
        "Cek kebutuhan power supply untuk GPU high-end",
      ],
    },
  ],
  os: [
    {
      id: "os-basics",
      title: "Operating System Basics",
      icon: Monitor,
      content: "Operating System (OS) adalah software yang mengelola hardware dan menjalankan aplikasi. Pilih Windows untuk GUI atau Linux dengan 6 pilihan distribusi.",
      tips: [
        "Windows: GUI desktop, functional browser dengan Google/YouTube/GitHub simulation",
        "Linux: 6 distro (Ubuntu, Debian, Fedora, Arch, Kali, CentOS)",
        "Distro berbeda memiliki fokus berbeda (Ubuntu=beginner, Kali=security, Arch=advanced)",
        "Buka VM dengan tombol 'Open VM' di toolbar atas",
        "Browser Windows support search dan navigation",
      ],
    },
    {
      id: "windows",
      title: "Windows Virtual Machine",
      icon: Monitor,
      content: "Windows menyediakan desktop GUI dengan functional browser. Browser dapat render Google, YouTube, GitHub, dan halaman web lainnya.",
      tips: [
        "Klik ikon Browser untuk membuka Chrome",
        "Search bar berfungsi - ketik query dan tekan Enter",
        "Navigate ke youtube.com, github.com, atau localhost",
        "Drag browser window untuk reposition",
        "System info menampilkan spesifikasi PC dan network status",
      ],
    },
    {
      id: "linux",
      title: "Linux Virtual Machine",
      icon: Monitor,
      content: "Linux menyediakan terminal-based interface. Pilih distro (Ubuntu, Debian, Fedora, Arch, Kali, CentOS) saat instalasi. Terminal prompt menampilkan nama distro yang dipilih.",
      tips: [
        "Prompt terminal: user@ubuntu:~$ atau user@kali:~$ (sesuai distro)",
        "Ketik 'help' untuk melihat daftar command (17+ commands)",
        "Commands: ls, cd, pwd, cat, echo, vim, nano, htop, neofetch",
        "Command 'neofetch' menampilkan info sistem dan distro",
        "Command 'ifconfig' menampilkan konfigurasi network",
        "Browser Firefox tersedia dengan 'firefox' command",
      ],
    },
    {
      id: "apps",
      title: "Aplikasi & Software",
      icon: Monitor,
      content: "Setelah OS terinstall, Anda dapat menginstall dan menjalankan berbagai aplikasi seperti browser, text editor, dan utility tools.",
      tips: [
        "Browser untuk akses internet (Chrome di Windows, Firefox di Linux)",
        "Text editor untuk coding (Vim, Nano di Linux)",
        "System monitoring tools (htop, neofetch di Linux)",
        "Pastikan jaringan aktif untuk download aplikasi",
      ],
    },
  ],
  network: [
    {
      id: "network-basics",
      title: "Dasar-dasar Jaringan",
      icon: Cable,
      content: "Jaringan komputer menghubungkan komputer Anda ke internet dan perangkat lain. Setiap komputer memerlukan IP address unik untuk komunikasi.",
      tips: [
        "IP Address = alamat unik komputer di jaringan",
        "Subnet Mask = menentukan range jaringan lokal",
        "Gateway = pintu keluar ke jaringan lain (biasanya router)",
        "DNS = menerjemahkan nama domain ke IP address",
      ],
    },
    {
      id: "dhcp",
      title: "DHCP vs Manual Configuration",
      icon: Zap,
      content: "DHCP (Dynamic Host Configuration Protocol) memberikan IP address otomatis. Manual configuration memberi Anda kontrol penuh atas network settings.",
      tips: [
        "DHCP: Mudah, otomatis, cocok untuk home network",
        "Manual: Kontrol penuh, diperlukan untuk server/network khusus",
        "IP address harus unik di jaringan yang sama",
        "Subnet mask biasanya 255.255.255.0 untuk network kecil",
      ],
    },
    {
      id: "ip-addressing",
      title: "IP Addressing",
      icon: Wifi,
      content: "IP Address format: XXX.XXX.XXX.XXX (0-255 per segmen). Private IP ranges: 192.168.x.x (home), 10.x.x.x (enterprise), 172.16.x.x - 172.31.x.x.",
      tips: [
        "192.168.1.1 biasanya IP router/gateway",
        "192.168.1.2-254 untuk client devices",
        "Hindari konflik IP (duplikasi address)",
        "Gateway harus dalam subnet yang sama",
      ],
    },
    {
      id: "dns",
      title: "DNS (Domain Name System)",
      icon: Wifi,
      content: "DNS menerjemahkan nama domain (google.com) menjadi IP address. Tanpa DNS, Anda harus mengingat IP address setiap website.",
      tips: [
        "8.8.8.8 = Google Public DNS (populer dan cepat)",
        "1.1.1.1 = Cloudflare DNS (fokus privacy)",
        "DNS ISP = default dari provider internet Anda",
        "DNS lambat = browsing terasa lambat",
      ],
    },
    {
      id: "performance",
      title: "Network Performance",
      icon: Zap,
      content: "Performa jaringan mempengaruhi kecepatan browsing, download, dan koneksi ke server. Konfigurasi yang baik mengoptimalkan latency dan throughput.",
      tips: [
        "DNS cepat (Google/Cloudflare) untuk browsing lebih responsif",
        "Ethernet lebih stabil dan cepat dari WiFi",
        "Ping ke gateway untuk test koneksi lokal",
        "Bandwidth dibagi antara semua device di jaringan",
      ],
    },
  ],
};

export default function WikiPanel({ currentPhase, onClose }: WikiPanelProps) {
  const [selectedSection, setSelectedSection] = useState<WikiSection>(currentPhase);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const sections = [
    { id: "overview" as WikiSection, name: "Overview", icon: BookOpen },
    { id: "hardware" as WikiSection, name: "Hardware", icon: Cpu },
    { id: "os" as WikiSection, name: "Operating System", icon: Monitor },
    { id: "network" as WikiSection, name: "Network", icon: Cable },
  ];

  const currentTopics = wikiData[selectedSection];
  const currentTopic = currentTopics.find((t) => t.id === selectedTopic);

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-zinc-900 border-2 border-cyan-500/50 rounded-2xl max-w-5xl w-full h-[80vh] relative shadow-2xl shadow-cyan-500/20 flex overflow-hidden"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ type: "spring", damping: 25 }}
      >
        {/* Sidebar */}
        <div className="w-64 border-r border-zinc-800 bg-zinc-950/50 p-4 flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Wiki & Panduan
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Pelajari setiap fase</p>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setSelectedSection(section.id);
                  setSelectedTopic(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  selectedSection === section.id
                    ? "bg-cyan-500/20 border border-cyan-500/50 text-cyan-400"
                    : "hover:bg-zinc-800 text-zinc-400"
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-zinc-800 p-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {sections.find((s) => s.id === selectedSection)?.name}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                {currentTopics.length} topik tersedia
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Topics & Detail */}
          <div className="flex-1 overflow-hidden flex">
            {/* Topics List */}
            {!selectedTopic && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 p-6 overflow-y-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentTopics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                      <motion.button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.id)}
                        className="glass p-4 rounded-lg text-left hover:border-cyan-500/50 transition-all group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-cyan-500/10 rounded-lg">
                              <Icon className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                                {topic.title}
                              </h4>
                              <p className="text-xs text-zinc-400 line-clamp-2">
                                {topic.content}
                              </p>
                              <p className="text-xs text-cyan-500 mt-2">
                                {topic.tips.length} tips
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Topic Detail */}
            <AnimatePresence>
              {selectedTopic && currentTopic && (
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="flex-1 p-6 overflow-y-auto"
                >
                  <button
                    onClick={() => setSelectedTopic(null)}
                    className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 flex items-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Kembali ke daftar topik
                  </button>

                  <div className="glass rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <currentTopic.icon className="w-8 h-8 text-cyan-400" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">
                        {currentTopic.title}
                      </h4>
                    </div>

                    <p className="text-zinc-300 leading-relaxed mb-6">
                      {currentTopic.content}
                    </p>

                    <div className="border-t border-zinc-700 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <h5 className="text-sm font-semibold text-yellow-400">
                          Tips & Best Practices
                        </h5>
                      </div>
                      <ul className="space-y-2">
                        {currentTopic.tips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                            <span className="text-cyan-400 font-bold mt-0.5">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
