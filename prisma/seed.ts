// Prisma seeding script — data awal dari profil SOLAKI
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding SOLAKI database...");

  // ─── Admin User ─────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "solaki2025!",
    12
  );
  await prisma.user.upsert({
    where: { email: "admin@solaki.id" },
    update: {},
    create: {
      email: "admin@solaki.id",
      password: hashedPassword,
      name: "Admin SOLAKI",
      role: "admin",
    },
  });
  console.log("✅ Admin user created");

  // ─── Site Content ────────────────────────────────────────────────
  const siteContents = [
    {
      key: "hero_tagline",
      value: "Bersama Kita Tumbuh",
      label: "Hero — Tagline Utama",
      type: "text",
    },
    {
      key: "hero_headline",
      value: "Strategi Digital yang Personal, Terjangkau, dan Terukur",
      label: "Hero — Headline",
      type: "text",
    },
    {
      key: "hero_subtitle",
      value:
        "SOLAKI hadir sebagai mitra bisnis — bukan sekadar vendor jasa. Kami membantu UMKM dan bisnis lokal tumbuh melalui konten kreatif, pengelolaan media sosial, dan iklan digital yang benar-benar sesuai kebutuhan bisnis Anda.",
      label: "Hero — Subtitle / Deskripsi",
      type: "textarea",
    },
    {
      key: "hero_cta_primary",
      value: "Konsultasi Gratis",
      label: "Hero — Teks Tombol Utama",
      type: "text",
    },
    {
      key: "hero_cta_secondary",
      value: "Lihat Layanan Kami",
      label: "Hero — Teks Tombol Sekunder",
      type: "text",
    },
    {
      key: "philosophy_badge",
      value: "Filosofi & Identitas",
      label: "Filosofi — Badge",
      type: "text",
    },
    {
      key: "philosophy_headline",
      value: "Berakar Lokal, Bergerak Digital",
      label: "Filosofi — Headline",
      type: "text",
    },
    {
      key: "philosophy_intro",
      value:
        "Nama SOLAKI diambil dari frasa lokal Enrekang, Sulawesi Selatan — \"Sola ki\" — yang berarti \"Bersama Kita\". Filosofi ini bukan sekadar nama; ia merepresentasikan cara kami bekerja: berdampingan dengan klien, memahami bisnis mereka secara mendalam, dan tumbuh bersama.",
      label: "Filosofi — Paragraf Intro",
      type: "textarea",
    },
    {
      key: "contact_email",
      value: "hello@solaki.id",
      label: "Kontak — Email",
      type: "text",
    },
    {
      key: "contact_whatsapp",
      value: "628xxxxxxxxxx",
      label: "Kontak — Nomor WhatsApp (tanpa +)",
      type: "text",
    },
    {
      key: "contact_instagram",
      value: "@solaki.id",
      label: "Kontak — Instagram",
      type: "text",
    },
    {
      key: "contact_location",
      value: "Enrekang, Sulawesi Selatan, Indonesia",
      label: "Kontak — Lokasi",
      type: "text",
    },
  ];

  for (const content of siteContents) {
    await prisma.siteContent.upsert({
      where: { key: content.key },
      update: { value: content.value, label: content.label },
      create: content,
    });
  }
  console.log("✅ Site content seeded");

  // ─── Services ────────────────────────────────────────────────────
  const services = [
    {
      order: 1,
      icon: "PenTool",
      title: "Content Creator",
      subtitle: "Konten yang Bicara ke Audiens",
      description:
        "Merancang konten visual dan tulisan yang menarik, relevan, dan konsisten dengan identitas brand Anda — mulai dari desain grafis, carousel, caption, hingga short-form video.",
      features: [
        "Desain grafis & template brand",
        "Copywriting & caption strategy",
        "Short-form video (Reels & TikTok)",
        "Kalender konten editorial 30 hari",
        "Konsistensi visual & brand voice",
      ],
      color: "#0D5C46",
    },
    {
      order: 2,
      icon: "Share2",
      title: "Social Media Management",
      subtitle: "Kehadiran Digital yang Konsisten",
      description:
        "Mengelola media sosial dari perencanaan konten hingga interaksi langsung dengan audiens — memastikan brand Anda aktif, relevan, dan membangun komunitas yang loyal.",
      features: [
        "Perencanaan & penjadwalan konten",
        "Pengelolaan Instagram, TikTok, Facebook",
        "Komunitas & respons komentar/DM",
        "Optimasi profil & bio",
        "Laporan performa bulanan",
      ],
      color: "#D95338",
    },
    {
      order: 3,
      icon: "TrendingUp",
      title: "Digital Advertising",
      subtitle: "Iklan yang Menghasilkan Konversi",
      description:
        "Menjalankan dan mengoptimalkan kampanye iklan berbayar di Meta (Instagram & Facebook) dan TikTok Ads — dengan target audiens yang presisi dan fokus pada hasil nyata.",
      features: [
        "Setup & manajemen Meta Ads",
        "Setup & manajemen TikTok Ads",
        "Targeting audience & lookalike",
        "A/B testing iklan & kreatif",
        "Laporan ROAS & konversi rutin",
      ],
      color: "#1D4ED8",
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { id: `service-0${service.order}` },
      update: service,
      create: { id: `service-0${service.order}`, ...service },
    });
  }
  console.log("✅ Services seeded");

  // ─── Team Members ─────────────────────────────────────────────────
  const team = [
    {
      order: 1,
      name: "Muhammad Nur Zikri",
      role: "Founder & Brand Strategist",
      description:
        "Memimpin arah strategis agensi dan perancangan positioning brand. Zikri memastikan setiap strategi berakar pada pemahaman mendalam terhadap bisnis klien dan tujuan jangka panjang mereka.",
      skills: ["Brand Strategy", "Business Development", "Client Relations", "Digital Positioning"],
      initials: "MNZ",
      color: "#0D5C46",
    },
    {
      order: 2,
      name: "Ifan Tri Yandies",
      role: "Social Media & Design Specialist",
      description:
        "Mengarahkan ekosistem visual dan produksi konten kreatif. Ifan mengubah esensi brand menjadi narasi visual yang menarik dan relevan dengan pasar target.",
      skills: ["Visual Design", "Social Media Strategy", "Short-Form Video", "Brand Consistency"],
      initials: "ITY",
      color: "#D95338",
    },
    {
      order: 3,
      name: "Kasman Muh. Ashif",
      role: "Digital Advertising & Client Relation Officer",
      description:
        "Spesialis periklanan digital berbayar dan koordinasi klien. Ashif memastikan setiap rupiah iklan dioptimalkan dengan baik sambil menjaga komunikasi yang proaktif dengan klien.",
      skills: ["Meta Ads", "TikTok Ads", "Client Communication", "Campaign Optimization"],
      initials: "KMA",
      color: "#6366F1",
    },
  ];

  for (const member of team) {
    await prisma.teamMember.upsert({
      where: { id: `team-0${member.order}` },
      update: member,
      create: { id: `team-0${member.order}`, ...member },
    });
  }
  console.log("✅ Team members seeded");

  // ─── Packages ────────────────────────────────────────────────────
  const packages = [
    {
      order: 1,
      name: "Retainer Bulanan",
      subtitle: "Kemitraan Jangka Panjang",
      description:
        "Solusi menyeluruh bulanan untuk brand yang menginginkan tim digital marketing terintegrasi. Cocok untuk bisnis yang ingin hadir secara konsisten di media sosial.",
      priceLabel: "Mulai dari",
      price: "Hubungi Kami",
      period: "/ bulan",
      badge: "Paling Populer",
      features: [
        "Konten kreatif rutin (foto & video)",
        "Pengelolaan multi-platform media sosial",
        "Caption & copywriting strategi",
        "Laporan performa bulanan",
        "Konsultasi strategi mingguan",
        "Revisi fleksibel",
      ],
      isHighlight: true,
    },
    {
      order: 2,
      name: "Project & Branding",
      subtitle: "Peluncuran Brand & Aset Visual",
      description:
        "Untuk brand yang membutuhkan identitas visual baru, peluncuran kampanye, atau perancangan aset digital utama secara menyeluruh.",
      priceLabel: "Mulai dari",
      price: "Hubungi Kami",
      period: "/ project",
      badge: "Fleksibel",
      features: [
        "Identitas visual brand lengkap",
        "Template feed & social media",
        "Produksi video konten",
        "Copywriting & storyboard",
        "File master (vector & media)",
        "Brand guidelines",
      ],
      isHighlight: false,
    },
    {
      order: 3,
      name: "Performance Ads",
      subtitle: "Iklan Digital yang Mengkonversi",
      description:
        "Pengelolaan kampanye iklan berbayar di Meta dan TikTok dengan fokus pada konversi dan efisiensi anggaran iklan Anda.",
      priceLabel: "Management Fee",
      price: "Hubungi Kami",
      period: "dari budget iklan",
      badge: "ROI Focused",
      features: [
        "Setup kampanye Meta & TikTok Ads",
        "Targeting audiens & lookalike",
        "A/B testing kreatif iklan",
        "Tracking & attribution",
        "Retargeting audiens hangat",
        "Laporan ROAS rutin",
      ],
      isHighlight: false,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { id: `pkg-0${pkg.order}` },
      update: pkg,
      create: { id: `pkg-0${pkg.order}`, ...pkg },
    });
  }
  console.log("✅ Packages seeded");

  // ─── Site Settings ────────────────────────────────────────────────
  const siteSettings = [
    { key: "site_name", value: "Solaki", label: "Nama Website/Agency" },
    { key: "site_tagline", value: "Creative Agency", label: "Sub-tagline di Logo" },
    { key: "og_title", value: "Solaki — Creative Digital Agency untuk UMKM", label: "OG Title" },
    { key: "og_description", value: "Mitra digital personal untuk bisnis lokal dan UMKM. Tumbuh bersama melalui konten kreatif, media sosial, dan iklan digital yang terukur.", label: "OG Description" },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, label: setting.label },
      create: setting,
    });
  }
  console.log("✅ Site settings seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("📧 Admin login: admin@solaki.id");
  console.log("🔑 Password:", process.env.ADMIN_PASSWORD || "solaki2025!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
