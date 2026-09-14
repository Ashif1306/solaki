import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const contents = await prisma.siteContent.findMany();
    return NextResponse.json({ contents });
  } catch (error) {
    return NextResponse.json({ contents: [] });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (Array.isArray(body)) {
      for (const item of body) {
        if (item.key) {
          await prisma.siteContent.upsert({
            where: { key: item.key },
            update: {
              value: item.value,
              label: item.label,
              type: item.type,
              section: item.section,
            },
            create: {
              key: item.key,
              value: item.value,
              label: item.label,
              type: item.type,
              section: item.section || "general",
            },
          });
        }
      }
    } else if (body.key) {
      await prisma.siteContent.upsert({
        where: { key: body.key },
        update: { value: body.value },
        create: {
          key: body.key,
          value: body.value,
          label: body.label || body.key,
          section: body.section || "general",
          type: body.type || "text",
        },
      });
    }

    return NextResponse.json({ success: true, message: "Konten berhasil disimpan." });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
