export interface ShowcaseItem {
  id: string;
  order: number;
  platform: "instagram" | "tiktok";
  title: string;
  caption: string;
  mediaUrl: string;
  postUrl?: string;
  format: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  engagementRate: string;
  reachMultiplier: string;
  hookStrategy: string;
  contentPillar: string;
  targetAudience: string;
  keyTakeaway: string;
  sentimentScore: string;
  isActive: boolean;
  isFeatured: boolean;
}

export interface PublicTeamMember {
  id: string;
  order: number;
  name: string;
  role: string;
  description: string;
  skills: string[];
  initials: string;
  color: string;
  photo: string;
  instagram: string;
  linkedin: string;
  isActive: boolean;
}
