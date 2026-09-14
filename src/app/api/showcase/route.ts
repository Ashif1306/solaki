import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 60; // revalidate cache every 60 seconds

const DEFAULT_SHOWCASE_ITEMS = [
  {
    id: "seed-ig-1",
    order: 1,
    platform: "instagram",
    title: "Reels: Strategi Rebranding Kopi Lokal Enrekang",
    caption: "Bagaimana mengubah identitas UMKM kopi lokal dari kemasan konvensional menjadi brand premium dengan daya saing nasional.",
    mediaUrl: "/showcase/reels_kopi_enrekang.png",
    postUrl: "https://instagram.com/solaki.agency",
    format: "Instagram Reels (9:16)",
    views: 124500,
    likes: 8920,
    comments: 432,
    shares: 1240,
    saves: 2150,
    engagementRate: "9.8%",
    reachMultiplier: "5.4x Organic",
    hookStrategy: "3 detik pertama: Blind test rasa kopi kemasan lama vs visual kemasan baru berestetika tinggi yang memicu rasa penasaran.",
    contentPillar: "Storytelling & Brand Transformation",
    targetAudience: "Pecinta Kopi & Anak Muda 18-35 Tahun",
    keyTakeaway: "Peningkatan pesanan langsung via WhatsApp sebesar 185% dalam 7 hari pertama pasca peluncuran video reels.",
    sentimentScore: "99% Positif",
    isActive: true,
    isFeatured: true,
  },
  {
    id: "seed-tt-1",
    order: 2,
    platform: "tiktok",
    title: "TikTok FYP: Edukasi Konten Viral UMKM Tanpa Iklan",
    caption: "3 Kesalahan fatal UMKM saat baru memulai akun TikTok yang membuat konten sepi penonton dan cara memperbaikinya.",
    mediaUrl: "/showcase/tiktok_edukasi_umkm.png",
    postUrl: "https://tiktok.com/@solaki.agency",
    format: "TikTok Video / FYP",
    views: 286000,
    likes: 24300,
    comments: 890,
    shares: 4120,
    saves: 9800,
    engagementRate: "13.4%",
    reachMultiplier: "8.2x FYP",
    hookStrategy: "Teks kontras dramatis 'Jangan posting video TikTok sebelum perbaiki 1 hal ini' dengan demonstrasi visual langsung.",
    contentPillar: "Edukasi Solutif & Trend Jacking",
    targetAudience: "Pelaku UMKM, Owner Bisnis & Kreator Pemula",
    keyTakeaway: "Menghasilkan 40+ inbound inquiries kemitraan digital marketing dan pertumbuhan 3.500+ followers baru.",
    sentimentScore: "97% Positif",
    isActive: true,
    isFeatured: true,
  },
  {
    id: "seed-ig-2",
    order: 3,
    platform: "instagram",
    title: "Carousel: Anatomi Visual Identity yang Menjual",
    caption: "Panduan visual memilih palet warna, tipografi, dan komposisi grid agar feed Instagram bisnis terlihat profesional dan kredibel.",
    mediaUrl: "/showcase/carousel_visual_identity.png",
    postUrl: "https://instagram.com/solaki.agency",
    format: "Instagram Carousel (10 Slides)",
    views: 87200,
    likes: 6410,
    comments: 310,
    shares: 1890,
    saves: 3450,
    engagementRate: "11.2%",
    reachMultiplier: "4.1x Saved Rate",
    hookStrategy: "Slide 1 dengan mockup perbandingan visual amatir vs visual berstandar agensi dengan checklist perbaikan.",
    contentPillar: "Design Insight & Value-Driven Advice",
    targetAudience: "Brand Builder, Desainer & Business Owner",
    keyTakeaway: "Tingkat 'Save' tertinggi sepanjang kuartal, memposisikan SOLAKI sebagai agensi kreatif berstandar tinggi di mata klien.",
    sentimentScore: "99% Positif",
    isActive: true,
    isFeatured: false,
  },
  {
    id: "seed-tt-2",
    order: 4,
    platform: "tiktok",
    title: "TikTok Behind The Scene: Produksi Konten Kreatif Lapangan",
    caption: "Dibalik layar tim SOLAKI saat pengambilan footage produk UMKM lokal di pelosok dengan perlengkapan mobile sinematik.",
    mediaUrl: "/showcase/tiktok_behind_the_scenes.png",
    postUrl: "https://tiktok.com/@solaki.agency",
    format: "TikTok Short Docu-Reels",
    views: 198400,
    likes: 16700,
    comments: 520,
    shares: 1350,
    saves: 2890,
    engagementRate: "10.5%",
    reachMultiplier: "6.0x Organic",
    hookStrategy: "Footage dinamis fast-paced dengan sound trending audio dan transisi beat-matching yang memikat mata.",
    contentPillar: "Culture, Human Story & Authenticity",
    targetAudience: "Gen-Z & Komunitas Kreatif Lokal",
    keyTakeaway: "Membangun kedekatan emosional dan membuktikan komitmen tim SOLAKI yang turun langsung mendampingi mitra lokal.",
    sentimentScore: "98% Positif",
    isActive: true,
    isFeatured: false,
  },
];

export async function GET() {
  try {
    const items = await prisma.socialShowcase.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    if (items.length > 0) {
      return NextResponse.json({ items });
    }

    // If database is not populated yet, return curated seed items
    return NextResponse.json({ items: DEFAULT_SHOWCASE_ITEMS });
  } catch (error) {
    console.error("Public showcase API error, returning fallback:", error);
    return NextResponse.json({ items: DEFAULT_SHOWCASE_ITEMS });
  }
}
