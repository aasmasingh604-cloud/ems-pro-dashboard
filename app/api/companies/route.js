import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import bcrypt from "bcryptjs";
export async function POST(req){
  await dbConnect();
  const { name, email, password, plan } = await req.json();
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const hashed = await bcrypt.hash(password, 10);
  const company = await Company.create({ name, slug, email, password: hashed, plan });
  return Response.json({ success: true, company });
}
export async function GET(){
  await dbConnect();
  const companies = await Company.find().sort({ createdAt: -1 });
  return Response.json(companies);
}
