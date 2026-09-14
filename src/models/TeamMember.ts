import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITeamMember extends Document {
  order: number;
  name: string;
  role: string;
  description: string;
  skills: string[];
  initials: string;
  color: string;
  instagram: string;
  linkedin: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeamMemberSchema: Schema<ITeamMember> = new Schema(
  {
    order: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    initials: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#0D5C46",
    },
    instagram: {
      type: String,
      default: "#",
    },
    linkedin: {
      type: String,
      default: "#",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

TeamMemberSchema.index({ order: 1 });

const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", TeamMemberSchema);

export default TeamMember;
