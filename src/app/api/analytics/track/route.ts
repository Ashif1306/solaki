import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
    }

    const {
      type = "pageview",
      path = "/",
      referrer = "Direct",
      device = "desktop",
      browser = "Other",
      visitorId = "",
      metadata = "",
    } = body as {
      type?: string;
      path?: string;
      referrer?: string;
      device?: string;
      browser?: string;
      visitorId?: string;
      metadata?: string;
    };

    // Filter out admin routes from visitor analytics
    const cleanPath = String(path).trim() || "/";
    if (cleanPath.startsWith("/solaki/dashboard") || cleanPath.startsWith("/admin") || cleanPath.startsWith("/api")) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const cleanVisitorId = String(visitorId).trim().substring(0, 64) || "anon";
    const cleanType = String(type).trim().substring(0, 32) || "pageview";
    const cleanReferrer = String(referrer).trim().substring(0, 100) || "Direct";
    const cleanDevice = ["mobile", "tablet", "desktop"].includes(String(device).toLowerCase())
      ? String(device).toLowerCase()
      : "desktop";
    const cleanBrowser = String(browser).trim().substring(0, 50) || "Other";
    const cleanMetadata = String(metadata).trim().substring(0, 255);

    // Save event asynchronously
    await prisma.analyticsEvent.create({
      data: {
        type: cleanType,
        path: cleanPath.substring(0, 255),
        referrer: cleanReferrer,
        device: cleanDevice,
        browser: cleanBrowser,
        visitorId: cleanVisitorId,
        metadata: cleanMetadata,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to record analytics event:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
