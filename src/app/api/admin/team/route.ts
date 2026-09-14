import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ team });
  } catch (error) {
    return NextResponse.json({ team: [] });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const data = await req.json();

    if (!data.initials && data.name) {
      data.initials = data.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 4);
    }

    const created = await prisma.teamMember.create({
      data: {
        order: Number(data.order) || 0,
        name: data.name,
        role: data.role,
        description: data.description || "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        initials: data.initials || "SOL",
        color: data.color || "#0D5C46",
        photo: typeof data.photo === "string" ? data.photo : "",
        instagram: data.instagram || "#",
        linkedin: data.linkedin || "#",
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
    return NextResponse.json({ success: true, member: created });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const data = await req.json();
    const id = data.id || data._id;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const updated = await prisma.teamMember.update({
      where: { id },
      data: {
        order: Number(data.order) || 0,
        name: data.name,
        role: data.role,
        description: data.description || "",
        skills: Array.isArray(data.skills) ? data.skills : [],
        initials: data.initials || "SOL",
        color: data.color || "#0D5C46",
        photo: typeof data.photo === "string" ? data.photo : "",
        instagram: data.instagram || "#",
        linkedin: data.linkedin || "#",
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Sesi admin berakhir, silakan login kembali." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Anggota tim berhasil dihapus." });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

