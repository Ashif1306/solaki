import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ packages });
  } catch (error) {
    return NextResponse.json({ packages: [] });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();
    const created = await prisma.package.create({
      data: {
        order: Number(data.order) || 0,
        name: data.name,
        modelType: data.modelType || "retainer",
        subtitle: data.subtitle || "",
        description: data.description || "",
        price: data.price,
        period: data.period || "",
        badge: data.badge || "",
        features: Array.isArray(data.features) ? data.features : [],
        isHighlight: Boolean(data.isHighlight),
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, package: created });
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

    const updated = await prisma.package.update({
      where: { id },
      data: {
        order: Number(data.order) || 0,
        name: data.name,
        modelType: data.modelType || "retainer",
        subtitle: data.subtitle || "",
        description: data.description || "",
        price: data.price,
        period: data.period || "",
        badge: data.badge || "",
        features: Array.isArray(data.features) ? data.features : [],
        isHighlight: Boolean(data.isHighlight),
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, package: updated });
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

    await prisma.package.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Paket berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
