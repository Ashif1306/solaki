import { NextResponse } from "next/server";
import { runPrismaSeed } from "@/lib/seedPrisma";

export async function GET() {
  try {
    const res = await runPrismaSeed();
    return NextResponse.json(res);
  } catch (error) {
    console.error("Prisma seed error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
