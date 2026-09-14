import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signSession, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = null;

    try {
      user = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (dbError) {
      console.warn("PostgreSQL not reachable, falling back to default admin check:", (dbError as Error).message);
      // Fallback check if DB server is temporarily down
      if (cleanEmail === "admin@solaki.id" && password === "solaki2025!") {
        user = {
          id: "default-admin-id",
          email: "admin@solaki.id",
          password: await bcrypt.hash("solaki2025!", 10),
          name: "Admin SOLAKI",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Kredensial tidak valid." },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Kredensial tidak valid." },
        { status: 401 }
      );
    }

    const token = signSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
