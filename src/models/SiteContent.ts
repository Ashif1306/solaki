import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISiteContent extends Document {
  key: string;
  value: string;
  label: string;
  section: string;
  type: "text" | "textarea";
  updatedAt: Date;
}

const SiteContentSchema: Schema<ISiteContent> = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      default: "general",
    },
    type: {
      type: String,
      enum: ["text", "textarea"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

SiteContentSchema.index({ section: 1 });

const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent || mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);

export default SiteContent;
