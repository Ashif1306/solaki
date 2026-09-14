import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL postingan wajib diisi." }, { status: 400 });
    }

    const trimmedUrl = url.trim();
    const isTikTok = trimmedUrl.includes("tiktok.com");
    const isInstagram = trimmedUrl.includes("instagram.com");

    if (!isTikTok && !isInstagram) {
      return NextResponse.json(
        { error: "Harap masukkan URL postingan resmi dari Instagram atau TikTok." },
        { status: 400 }
      );
    }

    // ── TIKTOK OEMBED ──
    if (isTikTok) {
      try {
        const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(trimmedUrl)}`;
        const res = await fetch(oembedUrl, {
          headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
          next: { revalidate: 0 },
        });

        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({
            success: true,
            platform: "tiktok",
            title: data.title ? (data.title.length > 60 ? `${data.title.slice(0, 57)}...` : data.title) : "Konten Kreatif TikTok SOLAKI",
            caption: data.title || "",
            mediaUrl: data.thumbnail_url || "",
            author: data.author_name || "@solaki.agency",
            postUrl: trimmedUrl,
            format: "TikTok Video / FYP",
          });
        }
      } catch (err) {
        console.warn("TikTok oembed fetch failed, using fallback:", err);
      }

      return NextResponse.json({
        success: true,
        platform: "tiktok",
        title: "Video Kreatif TikTok SOLAKI",
        caption: "Konten video vertikal TikTok dengan strategi hook visual dan audio viral.",
        mediaUrl: "",
        postUrl: trimmedUrl,
        format: "TikTok Video / FYP",
      });
    }

    // ── INSTAGRAM OEMBED / FALLBACK ──
    if (isInstagram) {
      const isReel = trimmedUrl.includes("/reel/") || trimmedUrl.includes("/reels/");
      const isPost = trimmedUrl.includes("/p/");
      const format = isReel ? "Instagram Reels" : isPost ? "Instagram Carousel / Feed" : "Instagram Post";

      return NextResponse.json({
        success: true,
        platform: "instagram",
        title: isReel ? "Reels Strategi Brand & Visual" : "Carousel Edukasi & Konversi Visual",
        caption: "Konten media sosial Instagram yang dirancang untuk memperkuat positioning dan engagement audiens.",
        mediaUrl: "",
        postUrl: trimmedUrl,
        format,
        author: "@solaki.agency",
      });
    }

    return NextResponse.json({ error: "Platform tidak didukung." }, { status: 400 });
  } catch (error) {
    console.error("Fetch meta error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
