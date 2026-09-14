"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export interface LeadFormData {
  ownerName: string;
  businessName: string;
  whatsapp: string;
  serviceChoice: string;
  notes: string;
}

export interface SubmitLeadResult {
  success: boolean;
  message: string;
  leadId?: string;
}

export async function submitLead(
  formData: LeadFormData
): Promise<SubmitLeadResult> {
  try {
    // Validasi input dasar
    if (!formData.ownerName?.trim()) {
      return { success: false, message: "Nama pemilik wajib diisi." };
    }
    if (!formData.businessName?.trim()) {
      return { success: false, message: "Nama bisnis wajib diisi." };
    }
    if (!formData.whatsapp?.trim()) {
      return { success: false, message: "Nomor WhatsApp wajib diisi." };
    }
    if (!formData.serviceChoice) {
      return { success: false, message: "Pilihan layanan wajib dipilih." };
    }

    // Sanitasi nomor WA
    const sanitizedWA = formData.whatsapp.trim().replace(/\s+/g, "");

    const newLead = await prisma.lead.create({
      data: {
        ownerName: formData.ownerName.trim(),
        businessName: formData.businessName.trim(),
        whatsapp: sanitizedWA,
        serviceChoice: formData.serviceChoice,
        notes: formData.notes?.trim() || "",
        status: "new",
      },
    });

    revalidatePath("/");

    return {
      success: true,
      message:
        "Terima kasih! Permintaan konsultasi Anda telah kami terima. Tim SOLAKI akan segera menghubungi Anda via WhatsApp dalam 1×24 jam. 🚀",
      leadId: newLead.id,
    };
  } catch (error) {
    console.error("Error submitting lead:", error);

    return {
      success: false,
      message:
        "Terjadi kendala penyimpanan. Anda juga dapat menghubungi kami langsung melalui WhatsApp di nomor yang tertera di website.",
    };
  }
}
