"use client";

import { useRef, useState, useTransition } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  User,
  Store,
  Phone,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  MessageCircle,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { submitLead, type LeadFormData } from "@/app/actions/submitLead";
import { useSiteBrand } from "@/hooks/useSiteBrand";

const serviceOptions = [
  "Content Creator (Visual & Tulisan)",
  "Social Media Management",
  "Digital Advertising (Meta & TikTok Ads)",
  "Kolaborasi & Kemitraan Digital",
  "Project-Based Branding & Desain",
  "Konsultasi Pemasaran Digital",
];

interface FormState {
  ownerName: string;
  businessName: string;
  whatsapp: string;
  serviceChoice: string;
  notes: string;
}

const initialForm: FormState = {
  ownerName: "",
  businessName: "",
  whatsapp: "",
  serviceChoice: "",
  notes: "",
};

interface FieldProps {
  id: string;
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, icon: Icon, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
        <span className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-solaki-green" />
          {label}
        </span>
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5"
        >
          <AlertCircle className="w-3 h-3" /> {error}
        </motion.p>
      )}
    </div>
  );
}

const inputClass =
  "w-full bg-solaki-card border border-solaki-border/60 rounded-xl px-4 py-3 text-white placeholder:text-solaki-muted/60 focus:outline-none focus:border-solaki-green/60 focus:ring-1 focus:ring-solaki-green/30 transition-all duration-300 text-sm font-inter";

export default function ContactForm() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const { brand } = useSiteBrand();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.ownerName.trim()) newErrors.ownerName = "Nama PIC/Pemilik wajib diisi";
    if (!form.businessName.trim()) newErrors.businessName = "Nama brand/perusahaan wajib diisi";
    if (!form.whatsapp.trim()) newErrors.whatsapp = "Nomor WhatsApp wajib diisi";
    else if (!/^(\+62|62|0)[0-9]{8,13}$/.test(form.whatsapp.trim()))
      newErrors.whatsapp = "Format: 08xx, 628xx, atau +628xx";
    if (!form.serviceChoice) newErrors.serviceChoice = "Pilih salah satu kebutuhan layanan";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const res = await submitLead(form as LeadFormData);
      setResult(res);
      if (res.success) {
        setForm(initialForm);
        setErrors({});
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (result) setResult(null);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-32 relative overflow-hidden bg-solaki-dark scroll-mt-12">
      {/* Anchor alias for #kontak */}
      <span id="kontak" className="sr-only absolute -top-12 left-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(13,92,70,0.1)_0%,transparent_70%)]" />
      <div className="absolute inset-0 grid-bg opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span className="section-badge mb-8 inline-flex">
              <MessageCircle className="w-3 h-3" />
              Inisiasi Kemitraan & Konsultasi
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Mulai Kolaborasi
              <br />
              <span className="gradient-text-green">Akselerasi Brand Anda</span>
            </h2>
            <p className="text-solaki-muted text-lg font-inter leading-relaxed mb-8">
              Diskusikan visi bisnis, target akuisisi pelanggan, dan kebutuhan strategi digital brand Anda bersama tim spesialis SOLAKI.
              Kami siap melakukan diagnosis menyeluruh dan merancang roadmap pertumbuhan berorientasi hasil.
              Tim kami akan merespons permintaan Anda dalam{" "}
              <span className="text-white font-semibold">1×24 jam</span>.
            </p>

            {/* Technical Scope Highlights */}
            <div className="space-y-4 mb-8">
              {[
                { icon: Zap, title: "Comprehensive Brand & Market Diagnosis", desc: "Audit menyeluruh terhadap channel digital, visual system, efisiensi ads, dan benchmarking industri kompetitor." },
                { icon: CheckCircle2, title: "Dedicated Multidisciplinary Creative Team", desc: "Didukung oleh strategist, visual designer, video creator, dan performance ads engineer berpengalaman." },
                { icon: MessageCircle, title: "Transparent & Measurable Business Impact", desc: "Pelaporan analitik data berkala tanpa vanity metrics — fokus utama pada ROI, ROAS, dan skala komersial." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-solaki-green/15 border border-solaki-green/30 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-solaki-green" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-solaki-muted text-sm font-inter">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct contact & WhatsApp Button */}
            <div className="mt-8 p-6 rounded-2xl border border-solaki-border/40 bg-solaki-card/50 space-y-4 backdrop-blur-sm">
              <div>
                <p className="text-solaki-muted text-xs font-inter mb-1 uppercase tracking-wider">Inquiry Langsung & Kolaborasi</p>
                <p className="text-white font-semibold flex items-center gap-2">
                  <span>📧 {brand.contactEmail}</span>
                </p>
                <p className="text-solaki-muted text-xs mt-1 font-inter">
                  📍 {brand.contactAddress}
                </p>
              </div>

              {brand.whatsapp && (
                <div className="pt-3 border-t border-solaki-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-white">Lebih suka chat langsung?</p>
                    <p className="text-[11px] text-solaki-muted font-inter">Respon cepat via WhatsApp tim SOLAKI</p>
                  </div>
                  <a
                    href={brand.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black text-xs font-bold transition-all shadow-md hover:shadow-lg shadow-[#25D366]/20 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-black/20" />
                    <span>Hubungi Kami</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bento-card p-8">
              <AnimatePresence mode="wait">
                {result?.success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-solaki-green/20 border border-solaki-green/40 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-solaki-green" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Pendaftaran Terkirim! 🎉</h3>
                    <p className="text-solaki-muted font-inter leading-relaxed mb-8">
                      {result.message}
                    </p>
                    <button
                      onClick={() => setResult(null)}
                      className="px-6 py-3 rounded-xl border border-solaki-border/50 text-solaki-muted hover:text-white hover:border-solaki-green/40 transition-all text-sm font-medium"
                    >
                      Kirim Pesan Lain
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <Field id="ownerName" label="Nama Lengkap / PIC" icon={User} error={errors.ownerName}>
                        <input
                          id="ownerName"
                          name="ownerName"
                          type="text"
                          value={form.ownerName}
                          onChange={handleChange}
                          placeholder="Nama lengkap Anda"
                          className={`${inputClass} ${errors.ownerName ? "border-red-500/50" : ""}`}
                          disabled={isPending}
                        />
                      </Field>

                      <Field id="businessName" label="Nama Brand / Perusahaan" icon={Store} error={errors.businessName}>
                        <input
                          id="businessName"
                          name="businessName"
                          type="text"
                          value={form.businessName}
                          onChange={handleChange}
                          placeholder="Contoh: Solaki Apparel"
                          className={`${inputClass} ${errors.businessName ? "border-red-500/50" : ""}`}
                          disabled={isPending}
                        />
                      </Field>
                    </div>

                    <Field id="whatsapp" label="Nomor WhatsApp / Kontak" icon={Phone} error={errors.whatsapp}>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        value={form.whatsapp}
                        onChange={handleChange}
                        placeholder="08xx-xxxx-xxxx"
                        className={`${inputClass} ${errors.whatsapp ? "border-red-500/50" : ""}`}
                        disabled={isPending}
                      />
                    </Field>

                    <Field id="serviceChoice" label="Kebutuhan Layanan Utama" icon={Zap} error={errors.serviceChoice}>
                      <div className="relative">
                        <select
                          id="serviceChoice"
                          name="serviceChoice"
                          value={form.serviceChoice}
                          onChange={handleChange}
                          className={`${inputClass} appearance-none pr-10 ${
                            errors.serviceChoice ? "border-red-500/50" : ""
                          } ${!form.serviceChoice ? "text-solaki-muted/60" : ""}`}
                          disabled={isPending}
                        >
                          <option value="" disabled>
                            Pilih cakupan solusi yang dibutuhkan
                          </option>
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-solaki-dark text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-solaki-muted pointer-events-none" />
                      </div>
                    </Field>

                    <Field id="notes" label="Detail Kebutuhan & Target Brand" icon={MessageSquare}>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Ceritakan gambaran singkat mengenai bisnis, tujuan kampanye, atau target pertumbuhan yang ingin dicapai..."
                        className={`${inputClass} resize-none`}
                        disabled={isPending}
                      />
                    </Field>

                    {result && !result.success && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm font-inter">{result.message}</p>
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={isPending}
                      className="w-full btn-neon flex items-center justify-center gap-3 py-4 rounded-xl text-white font-semibold text-base disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shadow-xl"
                      whileHover={!isPending ? { scale: 1.02 } : undefined}
                      whileTap={!isPending ? { scale: 0.98 } : undefined}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Memproses Permintaan Konsultasi...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Kirim Permintaan Konsultasi Strategis
                        </>
                      )}
                    </motion.button>

                    <p className="text-center text-xs text-solaki-muted font-inter">
                      Kerahasiaan data bisnis Anda terjamin & dilindungi sepenuhnya.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
