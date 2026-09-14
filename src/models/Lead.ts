import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILead extends Document {
  ownerName: string;
  businessName: string;
  whatsapp: string;
  serviceChoice: string;
  notes: string;
  status: "new" | "contacted" | "converted" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema: Schema<ILead> = new Schema(
  {
    ownerName: {
      type: String,
      required: [true, "Nama pemilik wajib diisi"],
      trim: true,
      maxlength: [100, "Nama tidak boleh lebih dari 100 karakter"],
    },
    businessName: {
      type: String,
      required: [true, "Nama bisnis/UMKM wajib diisi"],
      trim: true,
      maxlength: [150, "Nama bisnis tidak boleh lebih dari 150 karakter"],
    },
    whatsapp: {
      type: String,
      required: [true, "Nomor WhatsApp wajib diisi"],
      trim: true,
      match: [/^(\+62|62|0)[0-9]{8,13}$/, "Format nomor WhatsApp tidak valid"],
    },
    serviceChoice: {
      type: String,
      required: [true, "Pilihan layanan wajib diisi"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Catatan tidak boleh lebih dari 1000 karakter"],
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

// Index untuk sorting dan filtering
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
