import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function runPrismaSeed() {
  // 1. Admin User
  const existingAdmin = await prisma.user.findUnique({
    where: { email: "admin@solaki.id" },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("solaki2025!", 10);
    await prisma.user.create({
      data: {
        email: "admin@solaki.id",
        password: hashedPassword,
        name: "Admin SOLAKI",
        role: "admin",
      },
    });
    console.log("✅ Admin user seeded to PostgreSQL");
  }

  // 2. Site Content
  const contents = [
    {
      key: "hero_tagline",
      value: "Mitra Pertumbuhan UMKM & Bisnis Lokal",
      label: "Hero Tagline",
      section: "hero",
      type: "text",
    },
    {
      key: "hero_headline",
      value: "Strategi Digital yang Personal, Terjangkau, dan Terukur",
      label: "Hero Headline",
      section: "hero",
      type: "text",
    },
    {
      key: "hero_subtitle",
      value:
        "Diambil dari frasa lokal Enrekang \"Sola ki\" yang berarti \"Bersama Kita\". SOLAKI hadir sebagai mitra bisnis yang membantu UMKM tumbuh berkelanjutan melalui konten kreatif, pengelolaan media sosial, dan digital advertising presisi.",
      label: "Hero Subtitle",
      section: "hero",
      type: "textarea",
    },
    {
      key: "agency_meaning",
      value:
        "Nama SOLAKI diambil dari frasa lokal Enrekang, Sulawesi Selatan: \"Sola ki\", yang bermakna \"Bersama Kita\" atau \"Mitra Kita\". Kami percaya agensi harus bekerja bersama klien untuk mencapai tujuan bisnis.",
      label: "Makna Nama SOLAKI",
      section: "philosophy",
      type: "textarea",
    },
    {
      key: "contact_email",
      value: "hello@solaki.id",
      label: "Email Kontak",
      section: "contact",
      type: "text",
    },
    {
      key: "contact_whatsapp",
      value: "6285255557890",
      label: "Nomor WhatsApp (Format: 628xxx)",
      section: "branding",
      type: "text",
    },
    {
      key: "contact_whatsapp_message",
      value: "Halo SOLAKI Creative Agency, saya ingin konsultasi mengenai strategi pemasaran digital untuk bisnis saya.",
      label: "Pesan Template WhatsApp",
      section: "branding",
      type: "textarea",
    },
    {
      key: "social_instagram",
      value: "https://instagram.com/solaki.agency",
      label: "Link Instagram",
      section: "branding",
      type: "text",
    },
    {
      key: "social_tiktok",
      value: "https://tiktok.com/@solaki.id",
      label: "Link TikTok",
      section: "branding",
      type: "text",
    },
    {
      key: "social_linkedin",
      value: "https://linkedin.com/company/solaki",
      label: "Link LinkedIn",
      section: "branding",
      type: "text",
    },
    {
      key: "logo_type",
      value: "svg_default",
      label: "Tipe Logo (svg_default / image)",
      section: "branding",
      type: "text",
    },
    {
      key: "logo_image_url",
      value: "",
      label: "URL / Path Gambar Logo",
      section: "branding",
      type: "text",
    },
    {
      key: "logo_text",
      value: "SOLAKI",
      label: "Teks Nama Logo",
      section: "branding",
      type: "text",
    },
    {
      key: "logo_subtitle",
      value: "Creative Agency",
      label: "Subjudul di bawah Logo",
      section: "branding",
      type: "text",
    },
    {
      key: "contact_address",
      value: "Enrekang / Makassar, Sulawesi Selatan, Indonesia",
      label: "Alamat / Lokasi",
      section: "contact",
      type: "text",
    },
  ];

  for (const c of contents) {
    await prisma.siteContent.upsert({
      where: { key: c.key },
      update: {},
      create: c,
    });
  }
  console.log("✅ Site contents seeded to PostgreSQL");

  // 3. Services
  const servicesCount = await prisma.service.count();
  if (servicesCount === 0) {
    await prisma.service.createMany({
      data: [
        {
          order: 1,
          slug: "content-creator",
          title: "Content Creator",
          subtitle: "Visual & Tulisan Relevan",
          description:
            "Merancang konten visual dan tulisan yang menarik untuk mendukung strategi pemasaran digital yang sesuai dengan target pasar bisnis Anda.",
          features: [
            "Desain grafis & visual template",
            "Copywriting persuasif & caption",
            "Short-form video (Reels & TikTok)",
            "Kalender editorial bulanan",
            "Konsistensi identitas visual brand",
          ],
          icon: "PenTool",
          color: "#0D5C46",
          isActive: true,
        },
        {
          order: 2,
          slug: "social-media-management",
          title: "Social Media Management",
          subtitle: "Kehadiran Digital Terjadwal",
          description:
            "Mengelola media sosial mulai dari perencanaan konten hingga interaksi langsung dengan audiens agar brand Anda aktif dan dipercaya.",
          features: [
            "Perencanaan & penjadwalan posting",
            "Pengelolaan Instagram, TikTok, Facebook",
            "Interaksi komunitas & respon audiens",
            "Optimasi profil & bio akun bisnis",
            "Evaluasi & laporan performa bulanan",
          ],
          icon: "Share2",
          color: "#D95338",
          isActive: true,
        },
        {
          order: 3,
          slug: "digital-advertising",
          title: "Digital Advertising",
          subtitle: "Iklan Efisien & Terukur",
          description:
            "Menjalankan dan mengoptimalkan kampanye iklan digital berbayar untuk meningkatkan jangkauan pelanggan baru dan konversi nyata.",
          features: [
            "Setup & riset target Meta Ads (IG & FB)",
            "Setup kampanye TikTok Ads",
            "Targeting audiens lokal spesifik",
            "A/B testing materi visual & copy",
            "Optimasi budget agar efisien & hemat",
          ],
          icon: "TrendingUp",
          color: "#4F46E5",
          isActive: true,
        },
      ],
    });
    console.log("✅ Services seeded to PostgreSQL");
  }

  // 4. Team Members
  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    await prisma.teamMember.createMany({
      data: [
        {
          order: 1,
          name: "Muhammad Nur Zikri",
          role: "Founder & Brand Strategist",
          description:
            "Memimpin arah strategis agensi, perancangan positioning brand, pengembangan model bisnis, dan membina hubungan erat dengan klien utama.",
          skills: [
            "Brand Strategy",
            "Market Positioning",
            "Business Development",
            "Client Relationship",
          ],
          initials: "MNZ",
          color: "#0D5C46",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
          isActive: true,
        },
        {
          order: 2,
          name: "Ifan Tri Yandies",
          role: "Social Media & Design Specialist",
          description:
            "Mengembangkan ekosistem konten media sosial, produksi desain grafis, dan menjaga konsistensi estetika visual brand mitra.",
          skills: [
            "Content Creation",
            "Graphic Design",
            "Social Media",
            "Visual Identity",
          ],
          initials: "ITY",
          color: "#D95338",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
          isActive: true,
        },
        {
          order: 3,
          name: "Kasman Muh. Ashif",
          role: "Digital Advertising & Client Relation Officer",
          description:
            "Bertanggung jawab atas eksekusi dan optimasi iklan digital (Meta & TikTok Ads) serta koordinasi komunikasi aktif dengan mitra UMKM.",
          skills: [
            "Digital Advertising",
            "Meta Ads",
            "TikTok Ads",
            "Client Communication",
          ],
          initials: "KMA",
          color: "#4F46E5",
          instagram: "https://instagram.com",
          linkedin: "https://linkedin.com",
          isActive: true,
        },
      ],
    });
    console.log("✅ Team members seeded to PostgreSQL");
  }

  // 5. Packages
  const packagesCount = await prisma.package.count();
  if (packagesCount === 0) {
    await prisma.package.createMany({
      data: [
        {
          order: 1,
          name: "Paket Retainer Bulanan",
          modelType: "retainer",
          subtitle: "Solusi Berkelanjutan untuk UMKM",
          description:
            "Layanan bulanan komprehensif untuk mengelola media sosial dan memproduksi konten secara konsisten tanpa perlu merekrut tim tetap.",
          price: "Rp 2.500.000",
          period: "/ bulan",
          badge: "Paling Populer",
          isHighlight: true,
          features: [
            "15-20 konten feed, carousel & reels",
            "Copywriting caption & hashtag relevan",
            "Penjadwalan & publikasi teratur",
            "Manajemen interaksi pesan & komentar",
            "Laporan analitik performa bulanan",
            "Konsultasi strategi rutin bulanan",
          ],
          isActive: true,
        },
        {
          order: 2,
          name: "Project-Based Branding",
          modelType: "project_fee",
          subtitle: "Kebutuhan Khusus & Desain Proyek",
          description:
            "Biaya berdasarkan kebutuhan proyek spesifik seperti perancangan logo, visual identity, katalog promosi, atau re-branding produk.",
          price: "Rp 1.800.000",
          period: "/ proyek",
          badge: "Fleksibel",
          isHighlight: false,
          features: [
            "Panduan identitas visual brand (Brand Guidelines)",
            "Paket aset grafis promosi siap pakai",
            "Desain kemasan atau materi digital khusus",
            "File master high-resolution (AI, PSD, PNG)",
            "Revisi terarah hingga hasil maksimal",
          ],
          isActive: true,
        },
        {
          order: 3,
          name: "Digital Ads Management",
          modelType: "ad_fee",
          subtitle: "Pengelolaan & Optimasi Iklan",
          description:
            "Biaya jasa pengelolaan kampanye iklan digital di Meta dan TikTok dengan sistem fee transparan dan berorientasi hasil terukur.",
          price: "15%",
          period: "dari ad spend (min. fee Rp 750k)",
          badge: "Fokus Konversi",
          isHighlight: false,
          features: [
            "Setup akun iklan & integrasi pixel tracking",
            "Riset target audiens & demografi potensial",
            "Pembuatan copy & materi visual iklan",
            "A/B testing untuk efisiensi biaya per klik",
            "Monitoring harian & laporan transparan",
          ],
          isActive: true,
        },
      ],
    });
    console.log("✅ Packages seeded to PostgreSQL");
  }

  return { success: true, message: "PostgreSQL Database seeded successfully" };
}
