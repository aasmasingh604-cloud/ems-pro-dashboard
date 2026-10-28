import mongoose from "mongoose";
const EmployeeSchema = new mongoose.Schema({
  name: String, email: String, position: String, department: String, salary: Number,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: false },
}, { timestamps: true });
export default mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);
