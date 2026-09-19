"use client";

import { useState, useEffect, useCallback } from "react";

export interface TimezoneOption {
  id: string;
  name: string;
  code: string;
  offset: string;
  location: string;
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  {
    id: "Asia/Makassar",
    name: "Waktu Indonesia Tengah (WITA)",
    code: "WITA",
    offset: "UTC+8",
    location: "Makassar / Enrekang / Bali",
  },
  {
    id: "Asia/Jakarta",
    name: "Waktu Indonesia Barat (WIB)",
    code: "WIB",
    offset: "UTC+7",
    location: "Jakarta / Surabaya / Medan",
  },
  {
    id: "Asia/Jayapura",
    name: "Waktu Indonesia Timur (WIT)",
    code: "WIT",
    offset: "UTC+9",
    location: "Jayapura / Maluku / Papua",
  },
  {
    id: "auto",
    name: "Otomatis (Sesuai Perangkat)",
    code: "AUTO",
    offset: "Perangkat",
    location: "Deteksi Otomatis Lokasi Anda",
  },
];

const STORAGE_KEY = "solaki_admin_timezone";
const EVENT_KEY = "solaki-timezone-changed";

export function getResolvedTimezone(selectedId: string): string {
  if (selectedId === "auto") {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Makassar";
    } catch {
      return "Asia/Makassar";
    }
  }
  return selectedId;
}

export function getTimezoneCode(tz: string): string {
  if (tz === "Asia/Makassar") return "WITA";
  if (tz === "Asia/Jakarta") return "WIB";
  if (tz === "Asia/Jayapura") return "WIT";
  try {
    const parts = new Intl.DateTimeFormat("id-ID", {
      timeZone: tz,
      timeZoneName: "short",
    }).formatToParts(new Date());
    const namePart = parts.find((p) => p.type === "timeZoneName");
    return namePart?.value || "Lokal";
  } catch {
    return "Lokal";
  }
}

export function useAdminTimezone() {
  const [selectedTz, setSelectedTz] = useState<string>("Asia/Makassar");
  const [resolvedTz, setResolvedTz] = useState<string>("Asia/Makassar");
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  // Load stored timezone or detect default
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSelectedTz(stored);
        setResolvedTz(getResolvedTimezone(stored));
      } else {
        // Default to Asia/Makassar (WITA) since Solaki is located in Sulawesi Selatan
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const initial = detected || "Asia/Makassar";
        setSelectedTz(initial);
        setResolvedTz(getResolvedTimezone(initial));
      }
    } catch {
      setSelectedTz("Asia/Makassar");
      setResolvedTz("Asia/Makassar");
    } finally {
      setMounted(true);
    }
  }, []);

  // Listen for timezone changes from other components
  useEffect(() => {
    const handleTzChange = (e: CustomEvent<{ timezone: string }>) => {
      if (e.detail?.timezone) {
        setSelectedTz(e.detail.timezone);
        setResolvedTz(getResolvedTimezone(e.detail.timezone));
      }
    };

    window.addEventListener(EVENT_KEY as any, handleTzChange);
    return () => window.removeEventListener(EVENT_KEY as any, handleTzChange);
  }, []);

  // 1-second live ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const changeTimezone = useCallback((newTz: string) => {
    setSelectedTz(newTz);
    const resolved = getResolvedTimezone(newTz);
    setResolvedTz(resolved);
    try {
      localStorage.setItem(STORAGE_KEY, newTz);
      window.dispatchEvent(
        new CustomEvent(EVENT_KEY, { detail: { timezone: newTz } })
      );
    } catch {}
  }, []);

  // Formatted strings
  const timeStr = mounted
    ? new Intl.DateTimeFormat("id-ID", {
        timeZone: resolvedTz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(currentTime)
    : "--:--:--";

  const dateStr = mounted
    ? new Intl.DateTimeFormat("id-ID", {
        timeZone: resolvedTz,
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(currentTime)
    : "Memuat tanggal...";

  const shortDateStr = mounted
    ? new Intl.DateTimeFormat("id-ID", {
        timeZone: resolvedTz,
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(currentTime)
    : "";

  const tzCode = getTimezoneCode(resolvedTz);

  const formatDateTime = useCallback(
    (date: Date | string) => {
      try {
        const d = typeof date === "string" ? new Date(date) : date;
        return new Intl.DateTimeFormat("id-ID", {
          timeZone: resolvedTz,
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(d);
      } catch {
        return "";
      }
    },
    [resolvedTz]
  );

  return {
    selectedTimezone: selectedTz,
    resolvedTimezone: resolvedTz,
    currentTime,
    timeStr,
    dateStr,
    shortDateStr,
    tzCode,
    setTimezone: changeTimezone,
    formatDateTime,
    options: TIMEZONE_OPTIONS,
    mounted,
  };
}
