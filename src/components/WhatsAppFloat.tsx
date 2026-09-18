"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { useSiteBrand } from "@/hooks/useSiteBrand";

export default function WhatsAppFloat() {
  const { brand } = useSiteBrand();
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Show after 3 seconds
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  // Show tooltip after appearing
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setTooltip(true), 800);
    return () => clearTimeout(t);
  }, [visible]);

  const handleClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setTooltip(false);
    const url = brand.whatsappUrl || "https://wa.me/6281234567890";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const dismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTooltip(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-[86px] right-6 z-[9990] flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative bg-[#111111] border border-[#2A2A2A] rounded-2xl px-4 py-3 shadow-2xl max-w-[220px] text-right"
          >
            {/* Close */}
            <button
              onClick={dismissTooltip}
              className="absolute top-1.5 right-1.5 text-[#555] hover:text-white transition-colors p-0.5"
              aria-label="Tutup"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs font-bold text-white pr-3">Halo! 👋</p>
            <p className="text-[11px] text-[#888] font-inter mt-0.5 leading-relaxed">
              Ada yang bisa kami bantu? Chat langsung sekarang!
            </p>
            {/* Arrow */}
            <div
              className="absolute -bottom-[6px] right-5 w-3 h-3 rotate-45 bg-[#111111] border-r border-b border-[#2A2A2A]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Float button */}
      <motion.button
        onClick={handleClick}
        aria-label="Chat WhatsApp"
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #25D366, #128C5F)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Ping rings */}
        <span
          className="absolute inset-0 rounded-full animate-ping-slow opacity-40"
          style={{ background: "rgba(37,211,102,0.5)" }}
        />
        <span
          className="absolute inset-0 rounded-full animate-ping-slower opacity-20"
          style={{ background: "rgba(37,211,102,0.4)" }}
        />

        <MessageCircle className="w-6 h-6 text-white fill-white/20 relative z-10" />
      </motion.button>
    </div>
  );
}
