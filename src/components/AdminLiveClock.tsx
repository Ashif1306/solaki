"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, Globe, MapPin, ChevronDown, Check } from "lucide-react";
import { useAdminTimezone, TIMEZONE_OPTIONS } from "@/hooks/useAdminTimezone";

interface AdminLiveClockProps {
  variant?: "sidebar" | "banner";
  className?: string;
}

export default function AdminLiveClock({
  variant = "sidebar",
  className = "",
}: AdminLiveClockProps) {
  const {
    timeStr,
    dateStr,
    shortDateStr,
    tzCode,
    selectedTimezone,
    resolvedTimezone,
    setTimezone,
    mounted,
  } = useAdminTimezone();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className={`p-3 rounded-xl bg-white/[0.03] border border-white/5 animate-pulse ${className}`}>
        <div className="h-4 w-24 bg-white/10 rounded mb-1" />
        <div className="h-3 w-16 bg-white/5 rounded" />
      </div>
    );
  }

  // Active option label
  const currentOpt =
    TIMEZONE_OPTIONS.find((o) => o.id === selectedTimezone) ||
    TIMEZONE_OPTIONS.find((o) => o.id === resolvedTimezone) ||
    TIMEZONE_OPTIONS[0];

  if (variant === "banner") {
    return (
      <div
        ref={dropdownRef}
        className={`relative inline-flex items-center gap-3 p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 shadow-lg backdrop-blur-md ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shrink-0">
            <Clock className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-black text-white tracking-wider">
                {timeStr}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono">
                {tzCode}
              </span>
            </div>
            <p className="text-[11px] text-solaki-muted font-inter leading-none mt-0.5">
              {dateStr}
            </p>
          </div>
        </div>

        <div className="h-6 w-px bg-white/10 hidden sm:block" />

        {/* Timezone Switcher Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Ubah zona waktu tampilan"
        >
          <MapPin className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] hidden sm:inline">{currentOpt.location.split("/")[0].trim()}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-72 p-2 rounded-2xl bg-[#14231d] border border-solaki-border shadow-2xl z-50 backdrop-blur-xl">
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                Pilih Zona Waktu Lokasi
              </p>
              <p className="text-[10px] text-solaki-muted mt-0.5 font-inter">
                Web Analytics & jam akan disesuaikan otomatis
              </p>
            </div>
            <div className="space-y-1">
              {TIMEZONE_OPTIONS.map((opt) => {
                const isSelected = selectedTimezone === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTimezone(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-white font-bold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-400 font-mono font-bold">{opt.code}</span>
                        <span>•</span>
                        <span className="font-semibold text-white">{opt.name.split("(")[0].trim()}</span>
                      </div>
                      <span className="text-[10px] text-solaki-muted block mt-0.5">
                        {opt.location} ({opt.offset})
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default: Sidebar variant
  return (
    <div
      ref={dropdownRef}
      className={`relative mx-4 my-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all ${className}`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold text-solaki-muted uppercase tracking-wider font-inter">
            Waktu Lokal
          </span>
        </div>

        {/* Timezone trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold font-mono transition-colors cursor-pointer"
          title="Klik untuk mengganti zona waktu"
        >
          <span>{tzCode}</span>
          <ChevronDown className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Live Digital Clock */}
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xl font-black text-white tracking-wider">
          {timeStr}
        </span>
        <span className="text-[11px] text-solaki-muted font-inter">
          {shortDateStr}
        </span>
      </div>

      <div className="mt-1 text-[10px] text-solaki-muted/80 flex items-center gap-1 truncate font-inter">
        <MapPin className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
        <span className="truncate">{currentOpt.location.split("/")[0].trim()} ({currentOpt.offset})</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 right-0 mb-2 p-2 rounded-2xl bg-[#14231d] border border-solaki-border shadow-2xl z-50 backdrop-blur-xl">
          <div className="px-2.5 py-1.5 border-b border-white/10 mb-1">
            <p className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-emerald-400" />
              Sesuaikan Zona Waktu
            </p>
            <p className="text-[9px] text-solaki-muted mt-0.5 font-inter">
              Sinkronisasi data Web Analytics & jam
            </p>
          </div>
          <div className="space-y-1">
            {TIMEZONE_OPTIONS.map((opt) => {
              const isSelected = selectedTimezone === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTimezone(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-white font-bold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="text-emerald-400 font-mono font-bold text-[11px]">{opt.code}</span>
                      <span className="text-white text-xs truncate">• {opt.name.split("(")[0].trim()}</span>
                    </div>
                    <span className="text-[9px] text-solaki-muted block truncate">
                      {opt.location}
                    </span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
