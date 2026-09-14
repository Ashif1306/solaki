import mongoose, { Document, Model, Schema } from "mongoose";

export type Platform = "instagram" | "tiktok";
export type MetricKey =
  | "reach"
  | "engagementRate"
  | "saveRate"
  | "shareRate"
  | "videoViews"
  | "avgWatchTime"
  | "completionRate"
  | "followers"
  | "impressions";

export interface IWeeklyMetric {
  week: string; // Format: "YYYY-WW" e.g. "2024-01"
  value: number;
}

export interface IMetricEntry {
  key: MetricKey;
  label: string;
  value: number;
  unit: string; // "%", "K", "detik", etc.
  trend: number; // persentase perubahan dari minggu lalu
  weeklyData: IWeeklyMetric[];
}

export interface IMetricLog extends Document {
  platform: Platform;
  partnerName: string; // Nama UMKM mitra
  periodLabel: string; // e.g. "September 2024"
  periodStart: Date;
  periodEnd: Date;
  metrics: IMetricEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const WeeklyMetricSchema = new Schema<IWeeklyMetric>(
  {
    week: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { _id: false }
);

const MetricEntrySchema = new Schema<IMetricEntry>(
  {
    key: {
      type: String,
      required: true,
      enum: [
        "reach",
        "engagementRate",
        "saveRate",
        "shareRate",
        "videoViews",
        "avgWatchTime",
        "completionRate",
        "followers",
        "impressions",
      ],
    },
    label: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String, required: true },
    trend: { type: Number, default: 0 },
    weeklyData: { type: [WeeklyMetricSchema], default: [] },
  },
  { _id: false }
);

const MetricLogSchema: Schema<IMetricLog> = new Schema(
  {
    platform: {
      type: String,
      required: true,
      enum: ["instagram", "tiktok"],
    },
    partnerName: {
      type: String,
      required: true,
      trim: true,
    },
    periodLabel: {
      type: String,
      required: true,
    },
    periodStart: {
      type: Date,
      required: true,
    },
    periodEnd: {
      type: Date,
      required: true,
    },
    metrics: {
      type: [MetricEntrySchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

MetricLogSchema.index({ platform: 1, periodStart: -1 });
MetricLogSchema.index({ partnerName: 1 });

const MetricLog: Model<IMetricLog> =
  mongoose.models.MetricLog ||
  mongoose.model<IMetricLog>("MetricLog", MetricLogSchema);

export default MetricLog;
