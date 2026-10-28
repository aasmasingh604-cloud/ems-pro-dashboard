import mongoose from 'mongoose';
const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  companyId: { type: String, default: "default-company" },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
}, { timestamps: true });
export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
