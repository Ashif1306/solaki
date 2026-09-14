import mongoose, { Document, Model, Schema } from "mongoose";

export interface IPackage extends Document {
  order: number;
  name: string;
  modelType: "retainer" | "project_fee" | "ad_fee" | "custom";
  subtitle: string;
  description: string;
  price: string;
  period: string;
  badge?: string;
  features: string[];
  isHighlight: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema: Schema<IPackage> = new Schema(
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
    modelType: {
      type: String,
      enum: ["retainer", "project_fee", "ad_fee", "custom"],
      default: "retainer",
    },
    subtitle: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      default: "",
    },
    features: {
      type: [String],
      default: [],
    },
    isHighlight: {
      type: Boolean,
      default: false,
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

PackageSchema.index({ order: 1 });

const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);

export default Package;
