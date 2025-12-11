"use client";

import { motion } from "framer-motion";
import { X, Minus, Square, Pin, PinOff, Maximize2, Minimize2 } from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  isPinned?: boolean;
  onPinToggle?: () => void;
  zIndex?: number;
  onFocus?: () => void;
  color?: string;
}

export default function Window({
  id,
  title,
  children,
  onClose,
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 600, height: 400 },
  minSize = { width: 300, height: 200 },
  maxSize = { width: 1200, height: 800 },
  isPinned = false,
  onPinToggle,
  zIndex = 50,
  onFocus,
  color = "cyan",
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [prevSize, setPrevSize] = useState(initialSize);
  const [prevPosition, setPrevPosition] = useState(initialPosition);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    onFocus?.();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMaximized) return;
    onFocus?.();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - size.height, e.clientY - dragOffset.y));
        setPosition({ x: newX, y: newY });
      }
      if (isResizing) {
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;
        const newWidth = Math.max(minSize.width, Math.min(maxSize.width, resizeStart.width + deltaX));
        const newHeight = Math.max(minSize.height, Math.min(maxSize.height, resizeStart.height + deltaY));
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, size.width, size.height, minSize, maxSize]);

  const toggleMaximize = () => {
    if (isMaximized) {
      setSize(prevSize);
      setPosition(prevPosition);
    } else {
      setPrevSize(size);
      setPrevPosition(position);
      setSize({ width: window.innerWidth - 40, height: window.innerHeight - 80 });
      setPosition({ x: 20, y: 40 });
    }
    setIsMaximized(!isMaximized);
  };

  const colorClasses: Record<string, string> = {
    cyan: "border-cyan-500/50 shadow-cyan-500/20",
    emerald: "border-emerald-500/50 shadow-emerald-500/20",
    blue: "border-blue-500/50 shadow-blue-500/20",
    purple: "border-purple-500/50 shadow-purple-500/20",
  };

  const headerColors: Record<string, string> = {
    cyan: "from-cyan-950 to-zinc-900",
    emerald: "from-emerald-950 to-zinc-900",
    blue: "from-blue-950 to-zinc-900",
    purple: "from-purple-950 to-zinc-900",
  };

  if (isMinimized) {
    return (
      <motion.div
        className={`fixed bottom-4 card rounded-lg px-4 py-2 border ${colorClasses[color]} cursor-pointer`}
        style={{ left: position.x, zIndex }}
        onClick={() => setIsMinimized(false)}
        whileHover={{ scale: 1.05 }}
      >
        <span className="text-sm font-mono text-white">{title}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={windowRef}
      className={`fixed bg-zinc-900/95 rounded-lg border-2 ${colorClasses[color]} shadow-2xl overflow-hidden`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height,
        zIndex,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`h-10 bg-gradient-to-r ${headerColors[color]} flex items-center justify-between px-3 cursor-move select-none`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full bg-${color}-400`}></div>
          <span className="text-sm font-mono text-white truncate">{title}</span>
          {isPinned && <Pin className="w-3 h-3 text-yellow-400" />}
        </div>
        <div className="flex items-center gap-1">
          {onPinToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPinToggle();
              }}
              className={`w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700/50 transition-colors ${
                isPinned ? "text-yellow-400" : "text-zinc-400"
              }`}
              title={isPinned ? "Unpin" : "Pin"}
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={() => setIsMinimized(true)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700/50 transition-colors text-zinc-400"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={toggleMaximize}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-zinc-700/50 transition-colors text-zinc-400"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-500/80 transition-colors text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-auto" style={{ height: size.height - 40 }}>
        {children}
      </div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <svg className="w-4 h-4 text-zinc-600" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22 22H20V20H22V22M22 18H20V16H22V18M18 22H16V20H18V22M18 18H16V16H18V18M14 22H12V20H14V22M22 14H20V12H22V14Z" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
