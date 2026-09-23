import prisma from "@/lib/prisma";

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: "Instagram Marketing" | "Meta Ads" | "Tips UMKM" | "Branding & Konten";
  tags: string[];
  readTime: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  isPublished: boolean;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const ARTICLE_CATEGORIES = [
  "Semua",
  "Instagram Marketing",
  "Meta Ads",
  "Tips UMKM",
  "Branding & Konten",
] as const;

export const DEFAULT_ARTICLES: ArticleItem[] = [
  {
    id: "art-1",
    slug: "5-trik-reels-instagram-kuliner-viral",
    title: "5 Trik Bikin Reels Instagram Cepat Viral untuk Bisnis Kuliner & F&B",
    excerpt: "Pelajari cara memaksimalkan 3 detik pertama, teknik pengambilan visual 'food-porn', dan sound trending yang terbukti meningkatkan kunjungan pelanggan hingga 300%.",
    coverImage: "/showcase/reels_kopi_enrekang.png",
    category: "Instagram Marketing",
    tags: ["Reels", "Bisnis Kuliner", "Viral Marketing", "F&B"],
    readTime: "4 menit baca",
    authorName: "Tim Edukasi SOLAKI",
    authorRole: "Social Media Strategist",
    authorAvatar: "/logo_solaki/Logo_Solaki.png",
    isPublished: true,
    isFeatured: true,
    viewCount: 1420,
    publishedAt: "2026-09-20T08:00:00.000Z",
    createdAt: "2026-09-20T08:00:00.000Z",
    updatedAt: "2026-09-20T08:00:00.000Z",
    content: `
### Mengapa Konten Reels Sangat Penting untuk Bisnis Kuliner?

Dalam industri F&B (*Food and Beverage*), keputusan konsumen membeli makanan atau minuman sering kali terjadi secara impulsif dan dipicu oleh stimulasi visual yang menggugah selera (*visual hunger*). Algoritma Instagram Reels saat ini memprioritaskan konten dengan tingkat retensi tinggi dan aksi berbagi (*shares*) yang aktif.

Berikut adalah 5 formula taktis yang kami gunakan di SOLAKI saat mengelola konten klien kuliner lokal:

---

#### 1. Kuasai Formula 3 Detik Pertama (The Hook)
Jangan mulai video dengan logo brand atau bumper intro yang berputar lambat. Audiens akan langsung melakukan *swipe-up*. Awali video dengan gerakan dinamis:
- Tarikan keju yang meleleh (*cheese pull*)
- Tuangan saus pedas merah menyala yang berkilau
- Suara renyah saat gigitan pertama (*crispy crunch sound*)
- Teks provokatif: *"Jangan nonton video ini kalau lagi diet!"*

#### 2. Manfaatkan Kekuatan Audio Sensori (ASMR & Clean Sound)
Suara desis panggangan daging, es batu yang beradu di dalam gelas kaca kopi, atau suara pisau memotong roti hangat memberikan kenikmatan audio yang membuat audiens bertahan menonton video hingga selesai (*100% completion rate*).

> **Tips Praktis SOLAKI:** Rekam suara makanan sedekat mungkin menggunakan mikrofon clip-on sederhana, lalu seimbangkan dengan musik latar yang sedang naik daun (*trending audio*) dengan volume rendah (15-20%).

#### 3. Tampilkan Lokasi & Google Maps CTA yang Jelas
Banyak UMKM membuat video viral namun penonton bingung harus beli di mana. Selalu sertakan:
- Sticker lokasi kota dan nama cabang
- Teks di video: *"Lokasi ada di Jalan Veteran No. 12 (Samping Bank Mandiri)"*
- Ajakan bertindak di caption: *"Kirim video ini ke sahabatmu yang wajib traktir kamu makan siang ini!"*

#### 4. Gunakan Pencahayaan Hangat (Golden Warm Lighting)
Warna makanan akan terlihat pucat jika terkena lampu neon putih dingin. Gunakan cahaya matahari pagi (*natural window light*) atau lampu studio dengan suhu warna hangat (3200K - 4000K) agar warna merah sambal, cokelat saus, dan keemasan gorengan terlihat segar.

#### 5. Konsistensi Posting di Jam Lapar (Hunger Prime Time)
Algoritma Reels memberikan dorongan tayang paling besar pada 1-2 jam pertama setelah diunggah. Untuk bisnis kuliner, jam tayang paling optimal adalah:
- **11.00 - 12.30:** Waktu penentuan makan siang kantor
- **16.30 - 18.00:** Waktu santai pulang kerja & persiapan makan malam
- **20.30 - 22.00:** Waktu cemilan malam (*late-night cravings*)

---

### Kesimpulan & Langkah Nyata
Membuat konten kuliner viral bukan soal kamera mahal, melainkan bagaimana Anda menyampaikan kelezatan produk dalam format visual yang menggugah selera. Terapkan strategi ini pada video Reels Anda berikutnya dan amati lonjakan interaksinya!
    `.trim(),
  },
  {
    id: "art-2",
    slug: "panduan-meta-ads-pemula-tanpa-boncos",
    title: "Panduan Meta Ads 2026: Cara Beriklan di Instagram Tanpa Boncos untuk Pemula",
    excerpt: "Jangan buru-buru klik tombol 'Boost Post'! Pelajari struktur kampanye yang benar, cara riset target audiens spesifik lokal, dan alokasi budget efisien mulai Rp 25.000 per hari.",
    coverImage: "/showcase/tiktok_edukasi_umkm.png",
    category: "Meta Ads",
    tags: ["Meta Ads", "Iklan Instagram", "Strategi Iklan", "Budget UMKM"],
    readTime: "5 menit baca",
    authorName: "Tim Edukasi SOLAKI",
    authorRole: "Performance Marketing Lead",
    authorAvatar: "/logo_solaki/Logo_Solaki.png",
    isPublished: true,
    isFeatured: true,
    viewCount: 2180,
    publishedAt: "2026-09-21T09:30:00.000Z",
    createdAt: "2026-09-21T09:30:00.000Z",
    updatedAt: "2026-09-21T09:30:00.000Z",
    content: `
### Kenapa Iklan UMKM Sering 'Boncos' (Biaya Habis Tanpa Penjualan)?

Salah satu kesalahan terbesar pemilik bisnis pemula adalah menganggap Meta Ads (Facebook & Instagram Ads) sebagai mesin ajaib: cukup pasang foto produk, klik tombol **"Promosikan Postingan" (Boost Post)**, lalu menunggu uang mengalir.

Kenyataannya, beriklan secara sembarangan tanpa pemahaman corong penjualan (*marketing funnel*) hanya akan membakar modal Anda. Berikut panduan langkah demi langkah agar budget iklan Anda menghasilkan keuntungan nyata:

---

#### 1. Hindari Tombol 'Boost Post' Langsung dari Aplikasi Instagram
Meskipun praktis, tombol *Boost Post* memiliki opsi penargetan yang sangat terbatas. Gunakan **Meta Ads Manager** melalui laptop/PC agar Anda bisa:
- Memilih objektif kampanye yang tepat (*Traffic, Leads, atau Sales*)
- Mengatur penargetan radius lokasi geografis per kilometer
- Menggunakan fitur penargetan minat bertingkat (*Narrow Audience*)

#### 2. Gunakan Formula Budget Testing 70/30
Bagi pelaku UMKM dengan modal terbatas (misalnya Rp 1.000.000 per bulan):
- **70% Budget (Rp 700.000):** Dialokasikan ke iklan terbukti berhasil (*winning campaign*)
- **30% Budget (Rp 300.000):** Digunakan untuk menguji materi kreatif baru (foto vs video, variasi judul)

> **Aturan Emas SOLAKI:** Jangan menaikkan budget lebih dari 20% per hari pada iklan yang sedang berjalan bagus agar algoritma AI Meta tidak masuk kembali ke fase pembelajaran (*learning phase*).

#### 3. Tentukan Radius Wilayah yang Masuk Akal
Jika bisnis Anda adalah kafe, salon, atau toko fisik, jangan menargetkan seluruh Indonesia! Batasi radius hanya **3 hingga 5 kilometer** di sekitar gerai Anda. Biarkan algoritma menemukan pelanggan lokal terdekat yang benar-benar bisa datang langsung ke tempat Anda.

#### 4. Buat Materi Iklan yang Terlihat Alami (*Native UGC*)
Iklan yang terlihat terlalu formal seperti brosur koran sering kali langsung diabaikan. Tren iklan terbaik saat ini adalah video berbasis *User-Generated Content* (UGC):
- Suasana asli tempat bisnis
- Testimoni spontan pelanggan yang puas
- Pemilik bisnis berbicara ramah menyapa penonton

---

### Ceklis Sebelum Menjalankan Iklan:
1. Pastikan nomor WhatsApp di link profil aktif dan memiliki pesan balasan otomatis (*WhatsApp Business auto-reply*).
2. Siapkan admin yang siap merespons chat masuk dalam waktu maksimal 5 menit.
3. Buat minimal 2 variasi gambar/video untuk dibandingkan kinerjanya.
    `.trim(),
  },
  {
    id: "art-3",
    slug: "copywriting-formula-pas-caption-jualan",
    title: "Copywriting Formula PAS: Trik Menulis Caption yang Mengubah Followers Jadi Pembeli",
    excerpt: "Sering kehabisan ide nulis caption Instagram? Terapkan formula Problem-Agitate-Solution untuk menyentuh masalah terdalam audiens dan memicu transaksi seketika.",
    coverImage: "/showcase/reels_kopi_enrekang.png",
    category: "Tips UMKM",
    tags: ["Copywriting", "Caption Jualan", "Tips UMKM", "Konversi"],
    readTime: "3 menit baca",
    authorName: "Tim Edukasi SOLAKI",
    authorRole: "Content & Copy Lead",
    authorAvatar: "/logo_solaki/Logo_Solaki.png",
    isPublished: true,
    isFeatured: false,
    viewCount: 980,
    publishedAt: "2026-09-22T10:15:00.000Z",
    createdAt: "2026-09-22T10:15:00.000Z",
    updatedAt: "2026-09-22T10:15:00.000Z",
    content: `
### Masalah Utama Caption Jualan Saat Ini
Banyak akun bisnis menulis caption yang hanya berisi: *"Baju ready stok warna navy, size L, bahan katun adem. Minat klik link di bio."*

Caption seperti ini dingin dan tidak menciptakan koneksi emosional dengan calon pembeli. Orang membeli bukan karena daftar spesifikasi produk, melainkan karena produk tersebut mampu **menyelesaikan masalah hidup mereka**.

---

### Mengenal Formula PAS (Problem - Agitate - Solution)

Formula PAS adalah salah satu struktur tulisan persuasi tertua dan paling terbukti di dunia pemasaran:

#### 1. Problem (Kenalkan Masalah Nyata)
Sebutkan satu kendala yang sering dialami oleh target audiens Anda.
> *Contoh:* "Pernah nggak sih, udah rapi mau berangkat kerja tapi baju kusut lagi cuma gara-gara duduk di mobil 15 menit?"

#### 2. Agitate (Pertegas Konsekuensi & Rasa Frustrasinya)
Sentuh dampak buruk jika masalah tersebut dibiarkan.
> *Contoh:* "Bikin nggak percaya diri pas ketemu klien penting, harus repot cari setrika uap dadakan, dan mood kerja seharian langsung berantakan."

#### 3. Solution (Hadirkan Produk Anda Sebagai Pahlawan Penyelamat)
Tunjukkan bahwa produk Anda adalah solusi termudah dan ternyaman.
> *Contoh:* "Koleksi Kemeja Anti-Kusut SOLAKI dibuat dari serat katun premium khusus yang tetap licin seharian walau beraktivitas padat. Tinggal pakai, langsung siap tampil percaya diri."

---

### Tips Tambahan: Call to Action (CTA) yang Jelas
Jangan biarkan pembaca menggantung setelah membaca solusi Anda. Berikan instruksi tunggal yang mudah:
- *"Klik link di bio untuk klaim diskon 20% khusus 10 pembeli pertama hari ini!"*
- *"Ketik 'MAU' di kolom komentar, link katalog lengkap akan kami kirim ke DM kamu."*
    `.trim(),
  },
  {
    id: "art-4",
    slug: "pentingnya-visual-identity-feed-umkm",
    title: "Pentingnya Visual Identity: Kenapa Feed Rapi Bisa Naikkan Harga Jual Produk UMKM",
    excerpt: "Produk berkualitas bagus tapi dijual murah karena kemasan dan tampilan media sosial tampak amatir? Ini panduan menyusun palet warna, tipografi, dan komposisi feed yang elegan.",
    coverImage: "/showcase/tiktok_edukasi_umkm.png",
    category: "Branding & Konten",
    tags: ["Branding", "Visual Identity", "Desain Feed", "UMKM Naik Kelas"],
    readTime: "4 menit baca",
    authorName: "Tim Edukasi SOLAKI",
    authorRole: "Creative Director",
    authorAvatar: "/logo_solaki/Logo_Solaki.png",
    isPublished: true,
    isFeatured: false,
    viewCount: 1120,
    publishedAt: "2026-09-22T14:00:00.000Z",
    createdAt: "2026-09-22T14:00:00.000Z",
    updatedAt: "2026-09-22T14:00:00.000Z",
    content: `
### Nilai Persepsi (Perceived Value): Kunci Menjual Produk Lebih Mahal
Mengapa secangkir kopi di warkop pinggir jalan dihargai Rp 5.000, sementara kopi dengan rasa serupa di kafe estetik bisa laku Rp 35.000?

Jawabannya adalah **Perceived Value (Nilai Persepsi)**. Pelanggan tidak hanya membayar rasa kopi, mereka membayar suasana, estetika kemasan, dan rasa bangga saat mengonsumsinya. Di dunia digital, akun Instagram dan media sosial Anda adalah etalase utama toko Anda.

---

#### 3 Pilar Membangun Identitas Visual yang Kredibel:

1. **Aturan 3 Palet Warna Utama (60-30-10 Rule):**
   - **60% Warna Dominan:** Biasanya warna netral bersih (putih, krem, atau abu-abu lembut)
   - **30% Warna Sekunder:** Warna identitas brand Anda (misalnya hijau botol atau navy)
   - **10% Warna Aksen:** Warna kontras mencolok untuk tombol CTA atau info diskon (misalnya emas atau oranye hangat)

2. **Batasi Maksimal 2 Jenis Font:**
   - Gunakan satu font berkarakter untuk judul (*Heading*), dan satu font sans-serif bersih yang mudah dibaca untuk isi teks (*Body text*). Hindari memakai 4 atau 5 jenis font berbeda dalam satu postingan carousel karena akan membuat brand terlihat tidak terkonsep.

3. **Tata Letak Grid Feed yang Bernafas:**
   - Jangan isi setiap feed dengan tulisan penuh sesak dan coretan promo. Berikan variasi:
     - 1 Postingan Foto Produk Estetik
     - 1 Postingan Edukasi / Carousel Bermanfaat
     - 1 Postingan Cerita di Balik Layar (*Behind the Scenes*)

---

### Mulai Transformasi Brand Anda Hari Ini
Ketika identitas visual bisnis Anda rapi, calon pelanggan tidak akan ragu membayar harga yang pantas untuk kerja keras dan kualitas produk Anda.
    `.trim(),
  },
];

/**
 * Get all published articles with optional filtering
 */
export async function getArticles(options?: {
  search?: string;
  category?: string;
  limit?: number;
  includeDrafts?: boolean;
}): Promise<ArticleItem[]> {
  const { search, category, limit, includeDrafts = false } = options || {};

  try {
    const where: any = {};
    if (!includeDrafts) {
      where.isPublished = true;
    }
    if (category && category !== "Semua") {
      where.category = category;
    }
    if (search && search.trim()) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { tags: { has: search.trim() } },
      ];
    }

    const items = await prisma.article.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      take: limit,
    });

    if (items && items.length > 0) {
      return items.map((i) => ({
        id: i.id,
        slug: i.slug,
        title: i.title,
        excerpt: i.excerpt,
        content: i.content,
        coverImage: i.coverImage,
        category: i.category as ArticleItem["category"],
        tags: i.tags,
        readTime: i.readTime,
        authorName: i.authorName,
        authorRole: i.authorRole,
        authorAvatar: i.authorAvatar,
        isPublished: i.isPublished,
        isFeatured: i.isFeatured,
        viewCount: i.viewCount,
        publishedAt: i.publishedAt.toISOString(),
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      }));
    }
  } catch (err) {
    console.warn("Prisma getArticles failed, using resilient fallback data:", err);
  }

  // Resilient fallback filtering
  let results = [...DEFAULT_ARTICLES];
  if (!includeDrafts) {
    results = results.filter((a) => a.isPublished);
  }
  if (category && category !== "Semua") {
    results = results.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }
  if (search && search.trim()) {
    const s = search.toLowerCase();
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        a.excerpt.toLowerCase().includes(s) ||
        a.content.toLowerCase().includes(s) ||
        a.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  if (limit) {
    results = results.slice(0, limit);
  }

  return results;
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<ArticleItem | null> {
  try {
    const item = await prisma.article.findUnique({
      where: { slug },
    });
    if (item) {
      return {
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.coverImage,
        category: item.category as ArticleItem["category"],
        tags: item.tags,
        readTime: item.readTime,
        authorName: item.authorName,
        authorRole: item.authorRole,
        authorAvatar: item.authorAvatar,
        isPublished: item.isPublished,
        isFeatured: item.isFeatured,
        viewCount: item.viewCount,
        publishedAt: item.publishedAt.toISOString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    }
  } catch (err) {
    console.warn("Prisma getArticleBySlug failed, falling back to default articles:", err);
  }

  return DEFAULT_ARTICLES.find((a) => a.slug === slug) || null;
}

/**
 * Increment view count
 */
export async function incrementArticleViews(slug: string): Promise<void> {
  try {
    await prisma.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
  } catch {
    // Gracefully ignore error in fallback mode
  }
}

/**
 * Get related articles
 */
export async function getRelatedArticles(currentSlug: string, category: string, limit = 3): Promise<ArticleItem[]> {
  const all = await getArticles({ category, limit: limit + 1 });
  const filtered = all.filter((a) => a.slug !== currentSlug);
  if (filtered.length >= limit) {
    return filtered.slice(0, limit);
  }

  // If not enough in category, fetch any other articles
  const others = (await getArticles({ limit: limit + 1 })).filter(
    (a) => a.slug !== currentSlug && !filtered.some((f) => f.slug === a.slug)
  );

  return [...filtered, ...others].slice(0, limit);
}
