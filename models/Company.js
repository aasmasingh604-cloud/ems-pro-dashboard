import mongoose from "mongoose";
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  plan: { type: String, default: "basic" },
  status: { type: String, default: "active" },
  expiryDate: { type: Date, default: () => new Date(Date.now() + 30*24*60*60*1000) }
}, { timestamps: true });
export default mongoose.models.Company || mongoose.model("Company", CompanySchema);
