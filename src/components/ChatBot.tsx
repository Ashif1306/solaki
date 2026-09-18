"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUp,
  Bot,
  ExternalLink,
  MessageCircle,
  Moon,
  RotateCcw,
  Sun,
  User,
  X,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useSiteBrand } from "@/hooks/useSiteBrand";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "Layanan apa yang cocok untuk bisnis saya?",
  "Bantu susun ide konten untuk brand saya",
  "Apa saja pilihan paket SOLAKI?",
  "Saya ingin konsultasi dengan tim SOLAKI",
];

const CHAT_STORAGE_KEY = "solaki_chat_v1";

function readHistory(): Message[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || "null");
    if (Array.isArray(saved) && saved.length && saved.every((message) =>
      message && typeof message.id === "string" &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" && typeof message.timestamp === "string"
    )) return saved;
  } catch { /* Storage may be unavailable or corrupted. */ }
  return [createWelcomeMessage()];
}

function getCurrentTime() {
  return new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createWelcomeMessage(): Message {
  return {
    id: "welcome",
    role: "assistant",
    content:
      "Halo! Saya **Sola**, partner digital dari SOLAKI. Ceritakan bisnis atau tantangan pemasaran Anda—saya bisa membantu memberi arah awal untuk konten, media sosial, dan iklan digital.",
    timestamp: "Sekarang",
  };
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 break-words">{link[1]}</a>;
    return part.startsWith("**") && part.endsWith("**") ? (
      <strong key={`${part}-${index}`} className="font-bold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    );
  });
}

function FormattedMessage({ text }: { text: string }) {
  return (
    <div className="space-y-1.5">
      {text.split("\n").map((line, index) => {
        const trimmed = line.trim();
        const bullet = /^[-•]\s+/.test(trimmed);
        const numbered = /^\d+\.\s+/.test(trimmed);
        const content = trimmed.replace(/^[-•]\s+|^\d+\.\s+/, "");

        if (!trimmed) return <div key={index} className="h-1" />;

        if (bullet || numbered) {
          return (
            <div key={index} className="flex items-start gap-2 pl-1">
              <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <p>
                <InlineText text={content} />
              </p>
            </div>
          );
        }

        return (
          <p key={index}>
            <InlineText text={line} />
          </p>
        );
      })}
    </div>
  );
}

export default function ChatBot() {
  const { brand } = useSiteBrand();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [createWelcomeMessage()]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const sendingRef = useRef(false);

  useEffect(() => {
    if (!historyLoaded) return;
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch { /* Keep the current conversation usable without storage. */ }
  }, [messages, historyLoaded]);

  useEffect(() => {
    if (!isOpen) return;

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => window.clearTimeout(focusTimer);
  }, [isOpen, messages]);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || sendingRef.current) return;

    sendingRef.current = true;
    const messageId = crypto.randomUUID();
    const userMessage: Message = {
      id: `user-${messageId}`,
      role: "user",
      content: text,
      timestamp: getCurrentTime(),
    };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = updatedMessages
        .filter(({ id }) => id !== "welcome" && !id.startsWith("error-"))
        .map(({ role, content }) => ({ role, content }));
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data: { reply?: string; error?: string } = await response.json();

      if (!response.ok || !data.reply) {
        throw new Error(data.error || "Respons belum dapat dimuat.");
      }

      const reply = data.reply;

      setMessages((current) => [
        ...current,
        {
          id: `assistant-${messageId}`,
          role: "assistant",
          content: reply,
          timestamp: getCurrentTime(),
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `error-${messageId}`,
          role: "assistant",
          content: error instanceof Error ? error.message : "Koneksi sedang terkendala. Silakan coba kembali.",
          timestamp: getCurrentTime(),
        },
      ]);
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  };

  const whatsappUrl = brand.whatsappUrl || "https://wa.me/6285255443322";
  const panelClass = isDark
    ? "border-[#27453b] bg-[#0d1a17] text-[#f7fbf9] shadow-[0_28px_80px_rgba(0,0,0,0.55)]"
    : "border-[#dce8e3] bg-[#fbfdfc] text-[#17211e] shadow-[0_28px_80px_rgba(23,50,41,0.18)]";
  const mutedText = isDark ? "text-[#8fb2a5]" : "text-[#64756f]";

  return (
    <>
      <div className="fixed bottom-5 right-4 z-[9999] sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0.85, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 12 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (!historyLoaded) {
                  setMessages(readHistory());
                  setHistoryLoaded(true);
                }
                setIsOpen(true);
                setHasUnread(false);
              }}
              aria-label="Buka chat dengan Sola"
              className="group relative flex cursor-pointer items-center justify-center sm:justify-start gap-3 overflow-hidden rounded-2xl border border-[#dec83a]/30 bg-gradient-to-br from-[#025048] to-[#013e37] w-14 h-14 p-2 sm:w-auto sm:h-auto sm:px-3.5 sm:py-3 text-left shadow-[0_16px_42px_rgba(1,62,55,0.38)] transition-all duration-300"
            >
              <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#dec83a]/80 to-transparent" />
              <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
                <Bot className="h-5 w-5 text-emerald-300 force-text-white" />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#025048] bg-emerald-400" />
              </span>
              <span className="hidden sm:block pr-2">
                <span className="force-text-white block text-sm font-bold leading-tight">Tanya Sola</span>
                <span className="force-text-light mt-0.5 block text-[10px] font-medium">Partner digital SOLAKI</span>
              </span>
              {hasUnread && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#dec83a] ring-2 ring-[#013e37]" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            role="dialog"
            aria-label="Chat dengan Sola, partner digital SOLAKI"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed inset-x-3 bottom-3 z-[10001] flex h-[min(680px,calc(100dvh-24px))] flex-col overflow-hidden rounded-[28px] border font-inter sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[420px] ${panelClass}`}
          >
            <header
              className={`relative flex items-center justify-between border-b px-4 py-3.5 ${
                isDark ? "border-white/10 bg-[#10231d]" : "border-[#e3ece8] bg-white"
              }`}
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#0a7a5e] to-[#013e37] shadow-[0_8px_24px_rgba(1,62,55,0.25)]">
                  <Bot className="h-6 w-6 text-emerald-300 force-text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-sm font-extrabold tracking-tight">Sola</h2>
                    <span className="rounded-full bg-[#dec83a]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#9b8610] dark:text-[#f0dc55]">
                      SOLAKI
                    </span>
                  </div>
                  <p className={`mt-0.5 truncate text-[11px] ${mutedText}`}>
                    Partner strategi digital bisnis Anda
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleTheme}
                  title={isDark ? "Gunakan mode terang" : "Gunakan mode gelap"}
                  aria-label={isDark ? "Gunakan mode terang" : "Gunakan mode gelap"}
                  className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl transition-colors ${
                    isDark ? "text-[#9bbcaf] hover:bg-white/10" : "text-[#52655e] hover:bg-[#edf4f1]"
                  }`}
                >
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setMessages([createWelcomeMessage()])}
                  disabled={loading}
                  title="Mulai percakapan baru"
                  aria-label="Mulai percakapan baru"
                  className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl transition-colors ${
                    isDark ? "text-[#9bbcaf] hover:bg-white/10" : "text-[#52655e] hover:bg-[#edf4f1]"
                  }`}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Tutup chat"
                  aria-label="Tutup chat"
                  className={`grid h-9 w-9 cursor-pointer place-items-center rounded-xl transition-colors ${
                    isDark ? "text-[#9bbcaf] hover:bg-white/10" : "text-[#52655e] hover:bg-[#edf4f1]"
                  }`}
                >
                  <X className="h-[18px] w-[18px]" />
                </button>
              </div>
            </header>

            <div
              aria-live="polite"
              className={`flex-1 space-y-5 overflow-y-auto px-4 py-5 ${
                isDark
                  ? "bg-[radial-gradient(circle_at_top_right,rgba(10,122,94,0.10),transparent_38%)]"
                  : "bg-[radial-gradient(circle_at_top_right,rgba(10,122,94,0.07),transparent_38%)]"
              }`}
            >
              <div className="mx-auto flex max-w-[280px] items-center justify-center gap-2 text-center">
                <span className={`h-px flex-1 ${isDark ? "bg-white/10" : "bg-[#dce8e3]"}`} />
                <span className={`text-[9px] font-bold uppercase tracking-[0.18em] ${mutedText}`}>
                  Konsultasi awal
                </span>
                <span className={`h-px flex-1 ${isDark ? "bg-white/10" : "bg-[#dce8e3]"}`} />
              </div>

              {messages.map((message) => {
                const isUser = message.role === "user";
                return (
                  <div key={message.id} className={`flex items-end gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
                    {!isUser && (
                      <div
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${
                          isDark
                            ? "border-emerald-400/20 bg-emerald-400/10"
                            : "border-emerald-700/10 bg-emerald-700/[0.07]"
                        }`}
                      >
                        <Bot className="h-4 w-4 text-emerald-400" />
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] break-words rounded-2xl px-3.5 py-3 text-[13px] leading-[1.65] ${
                        isUser
                          ? "rounded-br-md bg-gradient-to-br from-[#0a7058] to-[#025048] text-white force-text-white shadow-[0_8px_20px_rgba(1,62,55,0.16)]"
                          : isDark
                            ? "rounded-bl-md border border-white/[0.08] bg-white/[0.055] text-[#e4eee9]"
                            : "rounded-bl-md border border-[#e1ebe7] bg-white text-[#263a33] shadow-[0_5px_18px_rgba(29,65,52,0.06)]"
                      }`}
                    >
                      {isUser ? message.content : <FormattedMessage text={message.content} />}
                      <span
                        className={`mt-1.5 block text-[9px] ${
                          isUser ? "text-right text-emerald-100/60" : mutedText
                        }`}
                      >
                        {message.timestamp}
                      </span>
                    </div>

                    {isUser && (
                      <div
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${
                          isDark ? "border-white/10 bg-white/[0.06]" : "border-[#dce8e3] bg-white"
                        }`}
                      >
                        <User className={`h-3.5 w-3.5 ${mutedText}`} />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-end gap-2.5" role="status" aria-label="Sola sedang menyiapkan balasan">
                  <div className={`grid h-8 w-8 place-items-center rounded-xl border ${isDark ? "border-emerald-400/20 bg-emerald-400/10" : "border-emerald-700/10 bg-emerald-700/[0.07]"}`}>
                    <Bot className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div
                    className={`flex items-center gap-1.5 rounded-2xl rounded-bl-md border px-4 py-3.5 ${
                      isDark ? "border-white/[0.08] bg-white/[0.055]" : "border-[#e1ebe7] bg-white"
                    }`}
                  >
                    {[0, 1, 2].map((item) => (
                      <span
                        key={item}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-500"
                        style={{ animationDelay: `${item * 0.14}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div className="grid grid-cols-2 gap-2 pl-[42px]">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className={`min-h-14 cursor-pointer rounded-xl border px-3 py-2.5 text-left text-[10px] font-semibold leading-relaxed transition-all ${
                        isDark
                          ? "border-white/10 bg-white/[0.035] text-[#a9c3b9] hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white"
                          : "border-[#dce8e3] bg-white text-[#50645d] hover:border-emerald-700/30 hover:bg-emerald-50 hover:text-[#174b3d]"
                      }`}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div
              className={`border-t px-3.5 pb-3 pt-2.5 ${
                isDark ? "border-white/10 bg-[#0b1613]" : "border-[#e1ebe7] bg-white"
              }`}
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className={`text-[9px] ${mutedText}`}>AI dapat keliru—konfirmasi detail proyek dengan tim.</span>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 transition-colors hover:text-emerald-500"
                >
                  <MessageCircle className="h-3 w-3" />
                  Hubungi tim
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSendMessage();
                }}
                className={`flex items-center gap-2 rounded-2xl border p-1.5 pl-4 transition-colors focus-within:border-emerald-600/50 ${
                  isDark ? "border-white/10 bg-white/[0.055]" : "border-[#d4e2dc] bg-[#f7faf9]"
                }`}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(event) => setInput(event.target.value.slice(0, 2000))}
                  placeholder="Ceritakan kebutuhan bisnis Anda..."
                  disabled={loading}
                  maxLength={2000}
                  autoComplete="off"
                  className={`min-w-0 flex-1 border-0 bg-transparent py-2 text-xs outline-none focus:shadow-none ${
                    isDark
                      ? "text-white placeholder:text-[#64877a]"
                      : "text-[#17211e] placeholder:text-[#879790]"
                  }`}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Kirim pesan"
                  className="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-xl bg-gradient-to-br from-[#0a7a5e] to-[#013e37] text-white shadow-md transition-all hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  <ArrowUp className="h-4 w-4 force-text-white" />
                </button>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
