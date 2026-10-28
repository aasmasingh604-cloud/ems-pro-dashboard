import connectDB from '@/lib/mongodb';
import Employee from '@/models/Employee';

export async function GET() {
  await connectDB();
  const data = await Employee.find({ isDeleted: false }).sort({ createdAt: -1 });
  return Response.json(data);
}
export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const emp = await Employee.create(body);
  return Response.json(emp);
}
export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  await Employee.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() });
  return Response.json({ ok: true });
}
export async function PUT(req) {
  await connectDB();
  const body = await req.json();
  const updated = await Employee.findByIdAndUpdate(body._id, body, { new: true });
  return Response.json(updated);
}
