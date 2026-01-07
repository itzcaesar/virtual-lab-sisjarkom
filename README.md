# Virtual Lab SISJARKOM

A comprehensive PC building and networking simulator inspired by Cisco Packet Tracer, built for the Systems and Computer Networks course at Telkom University.

## 🎯 Overview

Virtual Lab is an interactive web application that allows students to:
- **Build PCs** from scratch by selecting and installing hardware components
- **Install Operating Systems** (Windows or various Linux distributions)
- **Configure Networks** with IP addressing, subnets, gateways, and DNS
- **Run Virtual Machines** to test configurations
- **Benchmark Performance** based on selected hardware
- **Learn** through integrated wiki with educational content

## 🔧 Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Key Features

### 1. **Hardware Installation**
- Drag and drop components onto motherboard
- Components: CPU, RAM, Storage, GPU, PSU
- Quick presets: Budget, Mid-Range, High-End
- Real-time power consumption calculation
- Visual component placement with validation

### 2. **Operating System**
- **Windows**: GUI-based VM with functional browser
- **Linux**: Terminal-based with 6 distributions (Ubuntu, Debian, Fedora, Arch, Kali, CentOS)
- 17+ Linux commands supported
- Browser simulation for both OSs

### 3. **Network Configuration**
- DHCP auto-configuration
- Manual IP assignment
- Subnet masking
- Gateway and DNS configuration
- Network performance impact on system

### 4. **Performance System**
- Component-based scoring algorithm
- Real-time performance metrics (CPU, RAM, Storage, GPU)
- Network latency simulation
- Benchmark testing with detailed metrics (FPS, latency, temperature)
- Performance tiers: Entry, Mid-Range, High-End, Enthusiast

### 5. **Multi-PC Support**
- Create multiple PC configurations
- Independent hardware, OS, and network settings per PC
- Aggregated performance metrics across all PCs
- Individual VM access for each PC

### 6. **Educational Wiki**
- Comprehensive content on:
  - CPU architecture (Von Neumann, Harvard, pipelines)
  - Memory hierarchy and management
  - Storage systems and file systems
  - GPU and parallel processing
  - OSI model and networking fundamentals
  - IP addressing, TCP/UDP, DNS, NAT
  - Network security basics
- All content in Bahasa Indonesia
- Cited from authoritative sources

## 🎮 How to Use

1. **Start Lab**: Click on PC Tower to begin hardware installation
2. **Install Hardware**: Select components or use quick presets
3. **Install OS**: Click on Monitor to choose and install operating system
4. **Configure Network**: Click on Router to set up network settings
5. **Launch VM**: Use "Buka VM" button to access virtual machine
6. **Run Benchmark**: Test system performance with "Benchmark" button
7. **Learn**: Access Wiki for detailed educational content

## 📚 Component Documentation

### `app/page.tsx`
Main application orchestrator. Manages global state, handles all phase transitions (hardware → OS → network), and coordinates between all components.

**Key Functions:**
- `completeHardware()`: Handles hardware installation completion
- `completeOS()`: Manages OS installation
- `completeNetwork()`: Configures network settings
- `resetLab()`: Resets entire lab to initial state

### `components/Stage.tsx`
Main workspace component. Manages drag-and-drop canvas, module placement, cable connections, and modal interactions.

**Key Features:**
- Multi-PC module management
- Cable connection system
- Configuration modal triggering
- VM and benchmark access

### `components/Sidebar.tsx`
Right sidebar displaying real-time information. Shows progress, performance metrics, and activity logs.

**Key Features:**
- Progress tracking (3-step: Hardware → OS → Network)
- Aggregated specs for multi-PC setups
- Performance metrics with color-coded tiers
- Limited log display (last 50 entries) with scrollbar

### `lib/performance.ts`
Performance calculation engine. Computes scores based on hardware specifications and network configuration.

**Scoring Algorithm:**
- CPU: `cores * 100 + threads * 50 + frequency * 100`
- RAM: `capacity_gb * 100 + type_bonus (DDR5=500, DDR4=300)`
- Storage: `capacity_gb * 10 + type_bonus (NVMe=2000, SSD=1500, HDD=500)`
- GPU: `cores / 10 + vram * 100`

## 👥 Development Team

- Alessandro Fathi Z (707022500026)
- Muhammad Caesar Rifqi (707022500036)
- Melischa Ramadhannia P (707022500056)
- Wulan Noveliza Sriyanto (707022500063)
- Dian Hijratulaini (707022500118)

**Institution**: Telkom University  
**Program**: D4 Teknologi Rekayasa Multimedia  
**Course**: Sistem Jaringan Komputer (SISJARKOM)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/itzcaesar/virtual-lab-sisjarkom.git

# Navigate to project directory
cd virtual-lab-sisjarkom

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

## 📱 Device Requirements

- **Minimum screen width**: 1024px (desktop/laptop only)
- **Browser**: Modern browsers (Chrome, Firefox, Edge)
- **Input**: Keyboard and mouse required

## 📖 Educational Sources

The wiki content is based on authoritative sources including:
- Computer Organization and Design (Patterson & Hennessy, 2020)
- Operating System Concepts (Silberschatz et al., 2018)
- Computer Networks (Tanenbaum & Wetherall, 2010)
- TCP/IP Illustrated (Stevens, 2011)
- Modern Operating Systems (Tanenbaum & Bos, 2014)
- And many more...

## 📄 License

© 2025 Virtual Lab SISJARKOM - Telkom University

---

**Note**: This is an educational project developed for academic purposes.
