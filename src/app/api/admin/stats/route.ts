import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [totalLeads, newLeads, servicesCount, teamCount, packagesCount, recentLeads] =
      await Promise.all([
        prisma.lead.count().catch(() => 0),
        prisma.lead.count({ where: { status: "new" } }).catch(() => 0),
        prisma.service.count().catch(() => 3),
        prisma.teamMember.count().catch(() => 3),
        prisma.package.count().catch(() => 3),
        prisma.lead.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
        }).catch(() => []),
      ]);

    return NextResponse.json({
      totalLeads,
      newLeads,
      servicesCount,
      teamCount,
      packagesCount,
      recentLeads,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({
      totalLeads: 0,
      newLeads: 0,
      servicesCount: 3,
      teamCount: 3,
      packagesCount: 3,
      recentLeads: [],
    });
  }
}
