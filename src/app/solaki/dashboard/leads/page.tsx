"use client";

import { useEffect, useState } from "react";
import {
  Inbox,
  MessageCircle,
  Trash2,
  Filter,
  Loader2,
  Calendar,
} from "lucide-react";

interface LeadItem {
  id?: string;
  _id?: string;
  ownerName: string;
  businessName: string;
  whatsapp: string;
  serviceChoice: string;
  notes: string;
  status: string;
  createdAt: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchLeads = async (status = filterStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads?status=${status}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch {
      alert("Gagal memuat pesan leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(filterStatus);
  }, [filterStatus]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => ((l.id || l._id) === id ? { ...l, status: newStatus } : l))
        );
      }
    } catch {
      alert("Gagal memperbarui status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;

    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => (l.id || l._id) !== id));
      } else {
        alert("Gagal menghapus pesan");
      }
    } catch {
      alert("Terjadi kesalahan jaringan");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-solaki-border">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Pesan & Leads Masuk</h1>
          <p className="text-sm text-solaki-muted font-inter mt-1">
            Daftar calon klien dan pemilik UMKM yang mengisi form konsultasi di website.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-solaki-card p-1.5 rounded-xl border border-solaki-border">
          <Filter className="w-3.5 h-3.5 text-solaki-muted ml-2" />
          {[
            { id: "all", label: "Semua" },
            { id: "new", label: "Baru" },
            { id: "contacted", label: "Dihubungi" },
            { id: "converted", label: "Deal" },
            { id: "closed", label: "Selesai" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors font-inter ${
                filterStatus === tab.id
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                  : "text-solaki-muted hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-solaki-muted font-inter flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-solaki-teal" />
          Memuat pesan...
        </div>
      ) : leads.length === 0 ? (
        <div className="bento-card p-16 text-center border-solaki-border">
          <Inbox className="w-12 h-12 text-solaki-muted mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white mb-1">Tidak Ada Pesan</h3>
          <p className="text-xs text-solaki-muted font-inter">
            {filterStatus === "all"
              ? "Belum ada formulir yang disubmit pengunjung website."
              : `Tidak ada pesan dengan status "${filterStatus}".`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => {
            const leadId = lead.id || lead._id || "";
            const cleanWA = lead.whatsapp.replace(/[^0-9]/g, "");
            const waNumber = cleanWA.startsWith("0") ? `62${cleanWA.slice(1)}` : cleanWA;
            const createdDate = new Date(lead.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={leadId}
                className="bento-card p-5 sm:p-6 border-solaki-border hover:border-white/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-bold text-white">{lead.ownerName}</h3>
                      <span className="text-xs text-solaki-teal font-semibold px-2 py-0.5 rounded-md bg-solaki-teal/10 border border-solaki-teal/20">
                        {lead.businessName}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-solaki-muted font-inter mt-1">
                      <span className="text-solaki-muted">Layanan: <strong className="text-white">{lead.serviceChoice}</strong></span>
                      <span className="flex items-center gap-1 text-solaki-muted">
                        <Calendar className="w-3.5 h-3.5" />
                        {createdDate}
                      </span>
                    </div>
                  </div>

                  {/* Status Dropdown & Action Buttons */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(leadId, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                        lead.status === "new"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : lead.status === "contacted"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : lead.status === "converted"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-white/5 text-solaki-muted border-white/10"
                      }`}
                    >
                      <option value="new" className="bg-[#14231d] text-white">Status: Baru</option>
                      <option value="contacted" className="bg-[#14231d] text-white">Status: Dihubungi</option>
                      <option value="converted" className="bg-[#14231d] text-white">Status: Jadi Klien (Deal)</option>
                      <option value="closed" className="bg-[#14231d] text-white">Status: Ditutup</option>
                    </select>

                    <a
                      href={`https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(
                        lead.ownerName
                      )},%20kami%20dari%20SOLAKI%20Creative%20Agency%20menindaklanjuti%20permintaan%20konsultasi%20untuk%20${encodeURIComponent(
                        lead.businessName
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Chat ({lead.whatsapp})
                    </a>

                    <button
                      onClick={() => handleDelete(leadId)}
                      className="p-1.5 rounded-lg text-solaki-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {lead.notes && (
                  <div className="p-3.5 rounded-xl bg-solaki-surface/80 border border-solaki-border text-xs text-slate-300 font-inter leading-relaxed mt-2">
                    <strong className="text-white">Pesan Klien:</strong> {lead.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
