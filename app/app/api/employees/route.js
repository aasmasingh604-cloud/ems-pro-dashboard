let store = globalThis._ems || [];
globalThis._ems = store;
export async function GET() { return Response.json(globalThis._ems); }
export async function POST(req) { const b = await req.json(); globalThis._ems.push(b); return Response.json(b); }
export async function DELETE(req) { const { s } = new URL(req.url); const id = new URL(req.url).searchParams.get('id'); globalThis._ems = globalThis._ems.filter(e=>e.id!==id); return Response.json({ok:true}); }
export async function PUT(req) { const b = await req.json(); globalThis._ems = globalThis._ems.map(e=> e.id===b.id ? b : e); return Response.json(b); }
