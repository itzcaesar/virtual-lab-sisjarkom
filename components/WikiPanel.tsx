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
      content: "CPU (Central Processing Unit) adalah otak komputer yang mengeksekusi instruksi program melalui operasi aritmatika, logika, kontrol, dan input/output. Clock speed diukur dalam GHz (gigahertz), sedangkan core adalah unit pemrosesan independen dalam CPU yang memungkinkan multi-threading.",
      tips: [
        "Lebih banyak core = lebih baik untuk multitasking dan parallel computing",
        "Clock speed tinggi (3.5GHz+) = single-thread performance lebih cepat",
        "Cache L1/L2/L3 mempercepat akses data ke CPU",
        "CPU modern menggunakan socket LGA (Intel) atau AM4/AM5 (AMD)",
        "TDP (Thermal Design Power) menentukan kebutuhan pendinginan",
        "Hyper-Threading/SMT memungkinkan 2 thread per core",
        "Sumber: Computer Organization and Design (Patterson & Hennessy, 2020)",
      ],
    },
    {
      id: "cpu-architecture",
      title: "Arsitektur CPU",
      icon: Cpu,
      content: "Arsitektur CPU mengacu pada desain internal prosesor. Arsitektur Von Neumann menyimpan instruksi dan data di memori yang sama, sedangkan arsitektur Harvard memisahkannya. Modern CPU menggunakan pipeline, superscalar, dan out-of-order execution untuk meningkatkan throughput.",
      tips: [
        "Pipeline: Membagi eksekusi instruksi menjadi beberapa stage paralel",
        "Branch Prediction: Memprediksi alur program untuk menghindari pipeline stall",
        "RISC vs CISC: RISC (ARM) sederhana & efisien, CISC (x86) kompleks & backward compatible",
        "Instruction Set Architecture (ISA): x86-64, ARM64, RISC-V",
        "Cache hierarchy: L1 (paling cepat, 32-64KB) → L2 (256KB-1MB) → L3 (8-64MB)",
        "Sumber: Computer Architecture: A Quantitative Approach (Hennessy & Patterson, 2017)",
      ],
    },
    {
      id: "ram",
      title: "RAM (Random Access Memory)",
      icon: MemoryStick,
      content: "RAM adalah volatile memory yang menyimpan data dan instruksi program yang sedang dieksekusi. RAM memungkinkan akses acak (random access) dengan kecepatan konstan, berbeda dengan sequential access pada storage. Kapasitas dan kecepatan RAM mempengaruhi kemampuan multitasking sistem.",
      tips: [
        "Minimal 8GB untuk penggunaan dasar (browsing, office)",
        "16GB ideal untuk multitasking, gaming, dan development",
        "32GB+ untuk workstation profesional, video editing, virtualization",
        "DDR4 vs DDR5: DDR5 lebih cepat (4800MHz+) tapi lebih mahal",
        "Dual-channel (2 stick) lebih cepat dari single-channel",
        "Latency (CL): Angka lebih rendah = respons lebih cepat",
        "ECC RAM untuk server (error correction)",
        "Sumber: Modern Operating Systems (Tanenbaum & Bos, 2014)",
      ],
    },
    {
      id: "memory-hierarchy",
      title: "Hirarki Memori",
      icon: MemoryStick,
      content: "Sistem komputer menggunakan hirarki memori dengan trade-off antara kecepatan, kapasitas, dan biaya. Register CPU (paling cepat, <1KB) → Cache (L1/L2/L3, KB-MB) → RAM (GB, ~100ns) → SSD (GB-TB, ~100μs) → HDD (TB, ~10ms). Prinsip locality of reference membuat hirarki ini efisien.",
      tips: [
        "Temporal locality: Data yang baru diakses cenderung diakses lagi",
        "Spatial locality: Data di dekat lokasi yang diakses cenderung diakses",
        "Virtual memory: Menggunakan disk sebagai extension RAM",
        "Page file/swap: Area disk untuk virtual memory",
        "Memory management unit (MMU) menerjemahkan virtual ke physical address",
        "Sumber: Computer Systems: A Programmer's Perspective (Bryant & O'Hallaron, 2015)",
      ],
    },
    {
      id: "storage",
      title: "Storage (HDD/SSD)",
      icon: HardDrive,
      content: "Storage adalah non-volatile memory untuk penyimpanan data permanen. HDD (Hard Disk Drive) menggunakan piringan magnetik yang berputar, sedangkan SSD (Solid State Drive) menggunakan flash memory tanpa moving parts. SSD memiliki kecepatan baca/tulis jauh lebih tinggi (500MB/s SATA, 7000MB/s NVMe) dibanding HDD (~150MB/s).",
      tips: [
        "SSD untuk OS dan aplikasi (boot time 10-30 detik vs 1-2 menit HDD)",
        "HDD untuk penyimpanan besar dengan budget terbatas (>2TB)",
        "NVMe SSD (PCIe) adalah yang tercepat, SATA SSD lebih lambat tapi lebih murah",
        "M.2 adalah form factor, bisa SATA atau NVMe",
        "TLC/QLC NAND: Lebih murah tapi endurance lebih rendah",
        "RAID 0 (striping) untuk kecepatan, RAID 1 (mirroring) untuk redundancy",
        "Wear leveling dan TRIM memperpanjang umur SSD",
        "Sumber: Operating System Concepts (Silberschatz et al., 2018)",
      ],
    },
    {
      id: "file-systems",
      title: "Sistem File",
      icon: HardDrive,
      content: "File system mengatur cara data disimpan dan diorganisir di storage. NTFS (Windows), ext4 (Linux), APFS (macOS) adalah file system modern dengan journaling untuk recovery. File system mengelola blocks, inodes, directories, dan metadata.",
      tips: [
        "NTFS: Support file >4GB, permissions, encryption (BitLocker)",
        "ext4: Robust, journaling, support volume hingga 1EB",
        "FAT32: Compatible semua OS tapi file max 4GB",
        "exFAT: FAT32 modern untuk flash drive",
        "Journaling: Log perubahan sebelum menulis, untuk recovery",
        "Inode: Data structure yang menyimpan metadata file (permissions, timestamps)",
        "Fragmentation: File terpecah di disk, defragment untuk optimasi (HDD)",
        "Sumber: Linux Kernel Development (Love, 2010)",
      ],
    },
    {
      id: "gpu",
      title: "GPU (Graphics Processing Unit)",
      icon: Monitor,
      content: "GPU adalah specialized processor dengan ribuan core kecil untuk parallel processing. Berbeda dengan CPU yang optimize untuk serial processing, GPU dirancang untuk memproses banyak operasi sederhana secara simultan. Modern GPU digunakan untuk grafis, machine learning, scientific computing, dan cryptocurrency mining.",
      tips: [
        "Integrated GPU (Intel UHD, AMD Radeon) untuk browsing dan office, shared system RAM",
        "Dedicated GPU (NVIDIA/AMD) dengan VRAM sendiri untuk gaming dan rendering",
        "CUDA cores (NVIDIA) / Stream processors (AMD): Lebih banyak = lebih powerful",
        "VRAM (4GB minimum, 8-12GB ideal) untuk texture dan frame buffer",
        "Ray tracing: Real-time lighting simulation (RTX/RDNA 2+)",
        "Tensor cores: Specialized untuk AI/deep learning",
        "PCIe bandwidth: x16 ideal, x8 minimal untuk high-end GPU",
        "TDP 150-450W untuk high-end GPU, pastikan PSU cukup",
        "Sumber: GPU Gems (NVIDIA, 2004) & CUDA Programming Guide",
      ],
    },
    {
      id: "psu",
      title: "Power Supply Unit (PSU)",
      icon: Zap,
      content: "PSU mengkonversi AC power dari outlet listrik menjadi DC power untuk komponen PC. PSU harus menyediakan wattage yang cukup untuk semua komponen dengan headroom 20-30%. Efficiency rating (80+ Bronze/Silver/Gold/Platinum/Titanium) menunjukkan seberapa banyak power yang terbuang sebagai panas.",
      tips: [
        "Hitung total TDP: CPU + GPU + motherboard + storage + peripherals",
        "Tambah 30% headroom untuk safety dan future upgrade",
        "80+ Gold minimum untuk efisiensi dan noise rendah",
        "Modular PSU: Kabel bisa dilepas untuk cable management",
        "Single +12V rail vs multi-rail: Single rail lebih flexible",
        "450W: Basic office PC | 650W: Mid-range gaming | 850W+: High-end/multi-GPU",
        "Proteksi: OVP (over-voltage), OCP (over-current), OTP (over-temperature)",
        "Sumber: PSU 101: A Reference Guide (jonnyGURU)",
      ],
    },
  ],
  os: [
    {
      id: "os-basics",
      title: "Dasar-dasar Sistem Operasi",
      icon: Monitor,
      content: "Operating System (OS) adalah software layer antara hardware dan aplikasi yang menyediakan abstraction, resource management, dan protection. OS bertanggung jawab untuk process management, memory management, file system, I/O management, dan security. Kernel adalah core OS yang berjalan di privileged mode dengan akses penuh ke hardware.",
      tips: [
        "Fungsi utama OS: Resource allocation, process scheduling, memory management, I/O control",
        "Kernel mode vs User mode: Protection ring untuk security",
        "System calls: Interface antara user programs dan kernel (fork, exec, open, read, write)",
        "Context switching: OS switches CPU dari satu process ke lainnya",
        "Interrupts: Hardware/software signals untuk attention (timer, I/O, exceptions)",
        "Windows: Proprietary, GUI-focused, NT kernel, NTFS, widespread compatibility",
        "Linux: Open-source, monolithic kernel, multiple distros, ext4/btrfs, server dominance",
        "macOS: Unix-based (Darwin kernel), hybrid XNU kernel, HFS+/APFS",
        "Sumber: Operating Systems: Three Easy Pieces (Arpaci-Dusseau, 2018)",
      ],
    },
    {
      id: "processes",
      title: "Process & Thread Management",
      icon: Cpu,
      content: "Process adalah program dalam eksekusi dengan address space, registers, dan resources. Thread adalah lightweight process yang share address space. OS scheduler menentukan process mana yang dapat CPU time. Scheduling algorithms: FCFS, SJF, Round Robin, Priority, Multilevel Feedback Queue.",
      tips: [
        "Process Control Block (PCB): Data structure untuk menyimpan process state",
        "Process states: New → Ready → Running → Waiting → Terminated",
        "Context switch overhead: Save/restore registers, update PCB, flush cache",
        "Thread advantages: Shared memory, faster creation, lower overhead",
        "User-level threads vs Kernel-level threads: M:N threading model",
        "Concurrency issues: Race condition, deadlock, starvation",
        "Synchronization: Mutex, semaphore, monitor, conditional variables",
        "IPC (Inter-Process Communication): Pipe, message queue, shared memory, socket",
        "Sumber: Modern Operating Systems (Tanenbaum & Bos, 2014)",
      ],
    },
    {
      id: "memory-management",
      title: "Memory Management",
      icon: MemoryStick,
      content: "OS memory manager mengalokasikan RAM ke processes, implements virtual memory, dan handles page faults. Virtual memory memberikan illusion bahwa setiap process memiliki entire address space untuk dirinya sendiri. Paging membagi memory menjadi fixed-size pages, segmentation menggunakan variable-size segments.",
      tips: [
        "Virtual address space: Isolate processes, enable memory overcommitment",
        "Paging: Fixed-size pages (4KB typical), page table maps virtual → physical",
        "Page fault: Access page not in RAM, load from disk (slow ~10ms)",
        "TLB (Translation Lookaside Buffer): Cache untuk page table entries",
        "Demand paging: Load pages only when needed (lazy loading)",
        "Page replacement algorithms: LRU, FIFO, Clock, Optimal",
        "Thrashing: Too many page faults, system spends time paging instead of executing",
        "Working set: Set of pages process actively using",
        "Sumber: Operating System Concepts (Silberschatz et al., 2018)",
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
      title: "Linux Operating System",
      icon: Monitor,
      content: "Linux adalah open-source Unix-like OS dengan monolithic kernel. Linux distros berbeda dalam package manager, default software, release cycle, dan target users. Kernel sama (Linux kernel by Linus Torvalds), tapi userland tools dan configuration bervariasi. Linux mendominasi servers (96.3% of top 1 million web servers), supercomputers (100% of TOP500), dan embedded systems.",
      tips: [
        "Ubuntu: Beginner-friendly, Debian-based, APT package manager, LTS releases",
        "Debian: Stable, conservative updates, large package repository, foundation untuk Ubuntu",
        "Fedora: Cutting-edge, Red Hat sponsored, DNF/YUM, testing ground for RHEL",
        "Arch: Rolling release, DIY philosophy, Pacman, AUR for community packages",
        "Kali: Security/penetration testing, pre-installed hacking tools (Metasploit, Nmap)",
        "CentOS: Enterprise, RHEL clone, long support cycles (EOL: CentOS Stream replacement)",
        "Shell: bash (default), zsh (modern), fish (user-friendly)",
        "Terminal commands: ls, cd, pwd, cat, grep, find, chmod, chown, ps, top, htop",
        "Package managers: apt (Debian/Ubuntu), yum/dnf (Fedora/CentOS), pacman (Arch)",
        "Sumber: The Linux Programming Interface (Kerrisk, 2010)",
      ],
    },
    {
      id: "linux-commands",
      title: "Linux Command Line",
      icon: Monitor,
      content: "Linux command line (shell) adalah powerful interface untuk system administration dan automation. Shell interprets commands dan executes programs. Syntax: command [options] [arguments]. Pipes (|) dan redirection (>, <, >>) memungkinkan chaining commands. Shell scripting automates tasks.",
      tips: [
        "Navigation: ls (list), cd (change dir), pwd (print working dir), mkdir, rmdir",
        "File operations: cp (copy), mv (move), rm (remove), touch (create), cat (view)",
        "Text processing: grep (search), sed (stream editor), awk (pattern scanning)",
        "System info: uname (kernel), df (disk), free (memory), ps (processes), top/htop",
        "Permissions: chmod (change mode), chown (change owner), umask (default perms)",
        "Network: ping, ifconfig/ip, netstat/ss, curl, wget, ssh, scp",
        "Package: apt install/update, yum install, pacman -S",
        "Process: ps aux, kill, killall, jobs, fg, bg, nohup",
        "Wildcards: * (any chars), ? (single char), [abc] (character class)",
        "Sumber: The Linux Command Line (Shotts, 2019)",
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
      title: "Dasar-dasar Jaringan Komputer",
      icon: Cable,
      content: "Jaringan komputer adalah kumpulan komputer dan perangkat yang saling terhubung untuk berbagi resources dan data. Model OSI (Open Systems Interconnection) membagi networking menjadi 7 layer: Physical, Data Link, Network, Transport, Session, Presentation, Application. Model TCP/IP lebih praktis dengan 4 layer: Network Access, Internet, Transport, Application.",
      tips: [
        "IP Address = alamat logical unik (Layer 3 - Network)",
        "MAC Address = alamat physical NIC (Layer 2 - Data Link)",
        "Subnet Mask = menentukan network portion vs host portion IP",
        "Gateway/Router = pintu keluar antar network (Layer 3)",
        "Switch = menghubungkan devices dalam LAN (Layer 2)",
        "DNS = menerjemahkan domain name ke IP address",
        "Protocol: HTTP, FTP, SMTP, SSH, dll (Layer 7 - Application)",
        "Sumber: Computer Networking: A Top-Down Approach (Kurose & Ross, 2020)",
      ],
    },
    {
      id: "osi-model",
      title: "Model OSI 7 Layer",
      icon: Cable,
      content: "OSI Model adalah framework referensi untuk memahami komunikasi network. Layer 1 (Physical): Transmisi bit via media fisik. Layer 2 (Data Link): Frame, MAC address, error detection. Layer 3 (Network): Routing, IP addressing. Layer 4 (Transport): TCP/UDP, port numbers. Layer 5-7: Session management, data formatting, application protocols.",
      tips: [
        "Mnemonic: Please Do Not Throw Sausage Pizza Away",
        "Layer 1 (Physical): Cable, fiber, wireless signal, voltage",
        "Layer 2 (Data Link): Ethernet, MAC, ARP, switches",
        "Layer 3 (Network): IP, ICMP, routers, routing tables",
        "Layer 4 (Transport): TCP (reliable), UDP (fast), ports",
        "Layer 5 (Session): NetBIOS, RPC, session establishment",
        "Layer 6 (Presentation): Encryption, compression, encoding",
        "Layer 7 (Application): HTTP, FTP, SMTP, DNS, SSH",
        "Sumber: Data Communications and Networking (Forouzan, 2012)",
      ],
    },
    {
      id: "dhcp",
      title: "DHCP (Dynamic Host Configuration Protocol)",
      icon: Zap,
      content: "DHCP adalah protocol yang mengotomasi pemberian IP address dan network configuration kepada client. DHCP server menyimpan pool IP address dan 'lease' kepada client untuk periode tertentu. DHCP menggunakan DORA process: Discover, Offer, Request, Acknowledge. Alternative: Static IP untuk server, printer, dan network devices.",
      tips: [
        "DHCP Discover: Client broadcast mencari DHCP server",
        "DHCP Offer: Server menawarkan IP configuration",
        "DHCP Request: Client menerima offer",
        "DHCP Acknowledge: Server mengkonfirmasi assignment",
        "Lease time: Duration IP valid (biasanya 24 jam - 7 hari)",
        "DHCP Scope: Range IP yang bisa di-assign (e.g., 192.168.1.100-200)",
        "Reservation: MAC address → fixed IP (hybrid DHCP/static)",
        "Static IP: Manual config, untuk servers, printers, network devices",
        "Sumber: DHCP Handbook (Droms & Lemon, 2002)",
      ],
    },
    {
      id: "routing",
      title: "Routing & Default Gateway",
      icon: Wifi,
      content: "Routing adalah proses menentukan path terbaik untuk packet dari source ke destination melalui intermediate networks. Router menggunakan routing table untuk decision-making. Default gateway adalah router yang digunakan ketika destination network tidak ada di routing table lokal. Routing protocol: Static (manual), RIP, OSPF, BGP.",
      tips: [
        "Default gateway: Router ke internet (biasanya 192.168.1.1 atau 10.0.0.1)",
        "Routing table: Destination network + Next hop + Interface",
        "Static routing: Admin manually configure routes (simple, tidak scale)",
        "Dynamic routing: Protocol automatically update routes (RIP, OSPF, EIGRP)",
        "Metric: Cost untuk memilih best path (hop count, bandwidth, delay)",
        "Longest prefix match: Route paling spesifik dipilih",
        "Default route (0.0.0.0/0): Catch-all untuk unknown destinations",
        "Sumber: Routing TCP/IP Volume 1 (Doyle & Carroll, 2005)",
      ],
    },
    {
      id: "ip-addressing",
      title: "IP Addressing & Subnetting",
      icon: Wifi,
      content: "IPv4 menggunakan 32-bit address (4 octet, 0-255), menghasilkan ~4.3 miliar alamat. CIDR (Classless Inter-Domain Routing) notation: 192.168.1.0/24 berarti 24 bit pertama adalah network, 8 bit terakhir untuk host (256 alamat). Private IP ranges (RFC 1918): 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16. IPv6 menggunakan 128-bit untuk mengatasi exhaustion IPv4.",
      tips: [
        "Class A: 1.0.0.0 - 126.255.255.255 (default mask /8)",
        "Class B: 128.0.0.0 - 191.255.255.255 (default mask /16)",
        "Class C: 192.0.0.0 - 223.255.255.255 (default mask /24)",
        "192.168.1.1 biasanya IP router/gateway",
        "192.168.1.2-254 untuk client devices",
        "Subnet mask 255.255.255.0 = /24 = 254 host usable",
        "Network address: All host bits = 0 (192.168.1.0)",
        "Broadcast address: All host bits = 1 (192.168.1.255)",
        "VLSM (Variable Length Subnet Masking) untuk efisiensi IP",
        "Sumber: TCP/IP Illustrated (Stevens, 2011)",
      ],
    },
    {
      id: "tcp-udp",
      title: "TCP vs UDP Protocol",
      icon: Cable,
      content: "TCP (Transmission Control Protocol) adalah connection-oriented protocol yang menjamin reliable delivery dengan three-way handshake, acknowledgment, dan retransmission. UDP (User Datagram Protocol) adalah connectionless protocol tanpa guarantee, lebih cepat dan cocok untuk real-time application. Port numbers (0-65535) membedakan services.",
      tips: [
        "TCP: Reliable, ordered, connection-based (HTTP, FTP, SSH, email)",
        "UDP: Fast, connectionless, no guarantee (DNS, streaming, gaming, VoIP)",
        "TCP 3-way handshake: SYN → SYN-ACK → ACK",
        "Well-known ports (0-1023): 80=HTTP, 443=HTTPS, 22=SSH, 21=FTP",
        "Registered ports (1024-49151): Application-specific",
        "Dynamic ports (49152-65535): Client-side temporary ports",
        "TCP windowing: Flow control untuk mencegah overflow",
        "UDP broadcast/multicast: Mengirim ke multiple hosts",
        "Sumber: Computer Networks (Tanenbaum & Wetherall, 2010)",
      ],
    },
    {
      id: "dns",
      title: "DNS (Domain Name System)",
      icon: Wifi,
      content: "DNS adalah distributed database system yang menerjemahkan human-readable domain names (google.com) menjadi IP addresses (142.250.190.46). DNS menggunakan hierarchical structure: Root servers → TLD servers (.com, .org) → Authoritative name servers. DNS query bisa recursive (server handle semua) atau iterative (client handle).",
      tips: [
        "DNS Record types: A (IPv4), AAAA (IPv6), CNAME (alias), MX (mail), NS (nameserver)",
        "8.8.8.8 / 8.8.4.4 = Google Public DNS (fast, reliable)",
        "1.1.1.1 / 1.0.0.1 = Cloudflare DNS (privacy-focused, fastest)",
        "208.67.222.222 = OpenDNS (filtering, parental control)",
        "DNS caching: Local cache di OS/browser untuk speed",
        "TTL (Time To Live): Duration record di-cache",
        "DNS propagation: Time untuk update spread globally (24-48 jam)",
        "nslookup/dig: Command untuk query DNS manually",
        "DNSSEC: Security extension untuk prevent spoofing",
        "Sumber: DNS and BIND (Liu & Albitz, 2006)",
      ],
    },
    {
      id: "nat",
      title: "NAT (Network Address Translation)",
      icon: Wifi,
      content: "NAT adalah teknik yang memungkinkan multiple devices di private network berbagi single public IP address. Router melakukan translation antara private IP (192.168.x.x) dan public IP. NAT membantu konservasi IPv4 address dan menambah security layer dengan menyembunyikan internal network structure.",
      tips: [
        "Private IP (RFC 1918): Tidak routable di internet, butuh NAT",
        "Public IP: Routable di internet, assigned by ISP",
        "Static NAT: 1-to-1 mapping (private IP ↔ public IP)",
        "Dynamic NAT: Multiple private IPs share pool of public IPs",
        "PAT (Port Address Translation / NAT Overload): Many-to-one dengan port",
        "Port forwarding: Redirect traffic dari public IP:port ke internal IP:port",
        "DMZ (Demilitarized Zone): Exposed host di antara internal & external network",
        "NAT mempersulit P2P, gaming, VoIP (butuh port forwarding/UPnP)",
        "Sumber: NAT Handbook (Dutcher, 2001)",
      ],
    },
    {
      id: "performance",
      title: "Network Performance & QoS",
      icon: Zap,
      content: "Network performance diukur dengan bandwidth (throughput), latency (delay), jitter (latency variation), dan packet loss. QoS (Quality of Service) adalah teknik untuk prioritize traffic berdasarkan aplikasi. Bottleneck bisa terjadi di link capacity, router processing, congestion, atau distance (propagation delay).",
      tips: [
        "Bandwidth: Maximum data rate (Mbps/Gbps), berbeda dengan throughput (actual)",
        "Latency: Round-trip time (RTT), diukur dengan ping (ms)",
        "Jitter: Variation in latency, penting untuk VoIP/streaming",
        "Packet loss: % packet hilang, >1% = masalah",
        "Ethernet (wired): 1Gbps, low latency, reliable",
        "WiFi: Shared medium, interference, max 300-1200Mbps real-world",
        "QoS: Prioritize VoIP > video > web > file transfer",
        "TCP congestion control: Slow start, congestion avoidance, fast recovery",
        "Tools: ping (latency), traceroute (path), iperf (bandwidth), Wireshark (packet analysis)",
        "Sumber: High Performance Browser Networking (Grigorik, 2013)",
      ],
    },
    {
      id: "security",
      title: "Network Security Basics",
      icon: Wifi,
      content: "Network security melindungi data dan resources dari unauthorized access, attacks, dan damage. Defense in depth menggunakan multiple layers: Firewall, encryption, authentication, intrusion detection. Common threats: malware, phishing, DDoS, man-in-the-middle, SQL injection.",
      tips: [
        "Firewall: Filter traffic berdasarkan rules (stateful vs stateless)",
        "Encryption: TLS/SSL untuk web (HTTPS), VPN untuk remote access",
        "Authentication: Password, 2FA, certificates, biometric",
        "Port security: Close unused ports, change default passwords",
        "VLAN: Segment network untuk isolate traffic",
        "IDS/IPS: Intrusion Detection/Prevention System",
        "VPN: Encrypted tunnel melalui untrusted network (IPsec, OpenVPN, WireGuard)",
        "WPA3: WiFi encryption terbaru (lebih aman dari WPA2)",
        "Zero trust: Never trust, always verify",
        "Sumber: Network Security Essentials (Stallings, 2017)",
      ],
    },
  ],
};

export default function WikiPanel({ currentPhase, onClose }: WikiPanelProps) {
  const [selectedSection, setSelectedSection] = useState<WikiSection>(currentPhase);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const sections = [
    { id: "overview" as WikiSection, name: "Ikhtisar", icon: BookOpen },
    { id: "hardware" as WikiSection, name: "Perangkat Keras", icon: Cpu },
    { id: "os" as WikiSection, name: "Sistem Operasi", icon: Monitor },
    { id: "network" as WikiSection, name: "Jaringan", icon: Cable },
  ];

  const currentTopics = wikiData[selectedSection];
  const currentTopic = currentTopics.find((t) => t.id === selectedTopic);

  return (
    <motion.div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <motion.div
        className="relative bg-gradient-to-br from-[#0d1b2a] via-[#0d1b2a] to-[#0a1628] border-2 border-cyan-500/30 rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl shadow-cyan-500/10 flex overflow-hidden"
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />
        
        {/* Animated border glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.1), transparent)",
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Sidebar */}
        <div className="relative w-64 border-r border-cyan-500/20 bg-gradient-to-b from-[#0a1628]/80 to-[#0d1b2a]/80 backdrop-blur-sm p-4 flex flex-col">
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                className="p-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </motion.div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Wiki & Panduan
                </h2>
              </div>
            </div>
            <p className="text-xs text-cyan-300/70 ml-1">Pelajari setiap fase</p>
          </motion.div>

          <div className="space-y-2 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
            {sections.map((section, idx) => (
              <motion.button
                key={section.id}
                onClick={() => {
                  setSelectedSection(section.id);
                  setSelectedTopic(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all relative overflow-hidden group ${
                  selectedSection === section.id
                    ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400 shadow-lg shadow-cyan-500/10"
                    : "hover:bg-blue-950/30 text-cyan-300/70 hover:text-cyan-300 border border-transparent hover:border-cyan-500/20"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedSection === section.id && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"
                    layoutId="activeSection"
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  />
                )}
                <motion.div
                  className="relative"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.3 }}
                >
                  <section.icon className="w-4 h-4" />
                </motion.div>
                <span className="text-sm font-medium relative">{section.name}</span>
                {selectedSection === section.id && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="relative flex-1 flex flex-col">
          {/* Header */}
          <div className="relative border-b border-cyan-500/20 p-6 flex items-center justify-between bg-gradient-to-r from-cyan-900/50 via-cyan-800/30 to-cyan-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  {sections.find((s) => s.id === selectedSection)?.name}
                </h3>
                <motion.div
                  className="px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/30"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-xs font-bold text-cyan-400">
                    {currentTopics.length} topik
                  </span>
                </motion.div>
              </div>
              <p className="text-sm text-cyan-300/70">
                Klik topik untuk mempelajari lebih detail
              </p>
            </motion.div>
            <motion.button
              onClick={onClose}
              className="p-2.5 hover:bg-blue-950/30 rounded-xl transition-all duration-200 border border-transparent hover:border-cyan-500/30"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <X className="w-6 h-6 text-cyan-400/70 hover:text-cyan-400 transition-colors" />
            </motion.button>
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
                  {currentTopics.map((topic, idx) => {
                    const Icon = topic.icon;
                    return (
                      <motion.button
                        key={topic.id}
                        onClick={() => setSelectedTopic(topic.id)}
                        className="relative bg-gradient-to-br from-blue-950/40 to-blue-900/30 border border-cyan-500/30 p-4 rounded-xl text-left hover:border-cyan-500/60 transition-all duration-200 group overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.03, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Hover gradient effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <motion.div
                              className="p-2.5 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20"
                              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Icon className="w-5 h-5 text-cyan-400" />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="text-white font-semibold mb-1.5 group-hover:text-cyan-400 transition-colors">
                                {topic.title}
                              </h4>
                              <p className="text-xs text-cyan-300/80 line-clamp-2 mb-2 leading-relaxed">
                                {topic.content}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="px-2 py-1 bg-cyan-500/10 rounded-md border border-cyan-500/20">
                                  <span className="text-xs text-cyan-400 font-semibold">
                                    {topic.tips.length} tips
                                  </span>
                                </div>
                                <motion.div
                                  className="text-xs text-cyan-400/70 group-hover:text-cyan-400 transition-colors"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + idx * 0.05 }}
                                >
                                  Pelajari →
                                </motion.div>
                              </div>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 400 }}
                          >
                            <ChevronRight className="w-5 h-5 text-cyan-400/50 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                          </motion.div>
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
                  <motion.button
                    onClick={() => setSelectedTopic(null)}
                    className="px-4 py-2 bg-blue-950/30 hover:bg-blue-900/30 text-cyan-400 hover:text-cyan-300 text-sm mb-6 flex items-center gap-2 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-200"
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Kembali ke daftar topik
                  </motion.button>

                  <motion.div
                    className="relative bg-gradient-to-br from-blue-950/40 to-blue-900/30 border border-cyan-500/30 rounded-xl p-6 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {/* Background decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl" />
                    
                    <div className="relative">
                      {/* Header */}
                      <motion.div 
                        className="flex items-center gap-4 mb-6 pb-6 border-b border-cyan-500/20"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <currentTopic.icon className="w-8 h-8 text-cyan-400" />
                        </motion.div>
                        <div>
                          <h4 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
                            {currentTopic.title}
                          </h4>
                          <p className="text-xs text-cyan-300/70">Panduan lengkap dan tips praktis</p>
                        </div>
                      </motion.div>

                      {/* Content */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="bg-blue-950/30 border border-cyan-500/20 rounded-lg p-5 mb-6">
                          <p className="text-cyan-300/90 leading-relaxed">
                            {currentTopic.content}
                          </p>
                        </div>

                        {/* Tips Section */}
                        <div className="bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20 rounded-lg p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <motion.div
                              animate={{ 
                                rotate: [0, -10, 10, -10, 0],
                                scale: [1, 1.1, 1, 1.1, 1],
                              }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                            >
                              <Zap className="w-5 h-5 text-yellow-400" />
                            </motion.div>
                            <h5 className="text-base font-bold text-yellow-400">
                              Tips & Praktik Terbaik
                            </h5>
                            <div className="ml-auto px-2 py-1 bg-yellow-500/10 rounded-md border border-yellow-500/20">
                              <span className="text-xs text-yellow-400 font-semibold">
                                {currentTopic.tips.length} tips
                              </span>
                            </div>
                          </div>
                          <ul className="space-y-3">
                            {currentTopic.tips.map((tip, idx) => (
                              <motion.li
                                key={idx}
                                className="flex items-start gap-3 text-sm text-cyan-300/70 p-3 rounded-lg bg-blue-950/30 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-200"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + idx * 0.05 }}
                                whileHover={{ x: 5 }}
                              >
                                <motion.span 
                                  className="text-cyan-400 font-bold mt-0.5 text-lg"
                                  whileHover={{ scale: 1.2, rotate: 90 }}
                                >
                                  •
                                </motion.span>
                                <span className="flex-1">{tip}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
