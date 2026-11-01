import dbConnect from "../../../lib/dbConnect";
import Company from "../../../models/Company";
import bcrypt from "bcryptjs";
export async function POST(req){
  await dbConnect();
  const { name, email, password } = await req.json();
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now();
  const hashed = await bcrypt.hash(password, 10);
  const company = await Company.create({ name, slug, email, password: hashed });
  return Response.json({ success: true, company });
}
export async function GET(){
  await dbConnect();
  const companies = await Company.find().sort({ createdAt: -1 });
  return Response.json(companies);
}
