import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ services });
  } catch (error) {
    return NextResponse.json({ services: [] });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    if (!data.slug) {
      data.slug = (data.title || "service").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();
    }

    const created = await prisma.service.create({
      data: {
        order: Number(data.order) || 0,
        slug: data.slug,
        title: data.title,
        subtitle: data.subtitle || "",
        description: data.description || "",
        features: Array.isArray(data.features) ? data.features : [],
        color: data.color || "#0D5C46",
        icon: data.icon || "PenTool",
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, service: created });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const id = data.id || data._id;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        order: Number(data.order) || 0,
        title: data.title,
        subtitle: data.subtitle || "",
        description: data.description || "",
        features: Array.isArray(data.features) ? data.features : [],
        color: data.color || "#0D5C46",
        icon: data.icon || "PenTool",
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, service: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Layanan berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
