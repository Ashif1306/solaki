import "server-only";

import prisma from "@/lib/prisma";
import { defaultBrand, publicBrandKeys, resolveSiteBrand } from "@/lib/site-brand";
import type { PublicTeamMember, ShowcaseItem } from "@/lib/public-content-types";

export async function getPublicBrand() {
  try {
    const contents = await prisma.siteContent.findMany({
      where: { key: { in: publicBrandKeys } },
      select: { key: true, value: true },
    });
    return resolveSiteBrand(contents);
  } catch {
    console.error("Unable to load public site branding; using default branding.");
    return defaultBrand;
  }
}

export async function getPublicTeam(): Promise<PublicTeamMember[]> {
  try {
    const team = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true, order: true, name: true, role: true, description: true,
        skills: true, initials: true, color: true, photo: true,
        instagram: true, linkedin: true, isActive: true,
      },
    });
    return team.map((member) => ({
      ...member,
      photo: member.photo ?? "",
      instagram: member.instagram ?? "",
      linkedin: member.linkedin ?? "",
    }));
  } catch {
    console.error("Unable to load the public team.");
    return [];
  }
}

export async function getPublicShowcase(): Promise<{ items: ShowcaseItem[]; loadError: boolean }> {
  try {
    const items = await prisma.socialShowcase.findMany({
      where: { isActive: true, platform: { in: ["instagram", "tiktok"] } },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      select: {
        id: true, order: true, platform: true, title: true, caption: true,
        mediaUrl: true, postUrl: true, format: true, views: true, likes: true,
        comments: true, shares: true, saves: true, engagementRate: true,
        reachMultiplier: true, hookStrategy: true, contentPillar: true,
        targetAudience: true, keyTakeaway: true, sentimentScore: true,
        isActive: true, isFeatured: true,
      },
    });
    return {
      items: items.map((item) => ({
        ...item,
        platform: item.platform === "tiktok" ? "tiktok" : "instagram",
        postUrl: item.postUrl ?? "",
      })),
      loadError: false,
    };
  } catch {
    console.error("Unable to load the public portfolio.");
    return { items: [], loadError: true };
  }
}
