import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang diunggah" }, { status: 400 });
    }

    const video = /^(video\/mp4|video\/webm)$/.test(file.type) && /\.(mp4|webm)$/i.test(file.name);
    if (file.size > (video ? 50 : 10) * 1024 * 1024) return NextResponse.json({ error: video ? "Ukuran video maksimal 50 MB." : "Ukuran gambar maksimal 10 MB." }, { status: 400 });
    // Validate image or supported video formats.
    if (!video && !file.type.startsWith("image/") && !file.name.match(/\.(jpg|jpeg|png|webp|svg|avif|gif)$/i)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Gunakan gambar atau video MP4/WebM." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate safe unique filename
    const ext = path.extname(file.name) || ".jpg";
    const cleanExt = ext.startsWith(".") ? ext.toLowerCase() : `.${ext.toLowerCase()}`;
    const filename = `team-${Date.now()}-${Math.random().toString(36).substring(2, 7)}${cleanExt}`;
    const filepath = path.join(uploadsDir, filename);

    await writeFile(filepath, buffer);

    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url: publicUrl, filename });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file: " + (error as Error).message },
      { status: 500 }
    );
  }
}

