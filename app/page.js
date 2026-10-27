"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [list, setList] = useState([]);
  const [photo, setPhoto] = useState("");
  const [form, setForm] = useState({ id:"", name:"", email:"", phone:"", dept:"HR", comp:"", sal:"", loc:"", addr:"", note:"" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ems_vercel_final");
    if (saved) setList(JSON.parse(saved));
  }, []);
  useEffect(() => {
    localStorage.setItem("ems_vercel_final", JSON.stringify(list));
  }, [list]);

  const handlePhoto = (e) => {
    const f = e.target.files[0]; if(!f) return;
    const r = new FileReader(); r.onload = (ev) => setPhoto(ev.target.result); r.readAsDataURL(f);
  };

  const addEmp = () => {
    if(!form.name || !form.email || !form.sal) return alert("Name, Email, Salary bharo");
    setList([...list, { ...form, photo, id: form.id || "EMP"+Date.now().toString().slice(-4) }]);
    setForm({ id:"", name:"", email:"", phone:"", dept:"HR", comp:"", sal:"", loc:"", addr:"", note:"" }); setPhoto("");
  };

  const removeEmp = (i) => {
    if(!confirm("Delete "+list[i].name+"?")) return;
    const p = prompt("DELETE likho tabhi delete hoga:"); if(p!=="DELETE") return;
    setList(list.filter((_, idx)=> idx!==i));
  };

  const filtered = list.filter(x => (x.name+x.email+x.id+x.comp).toLowerCase().includes(search.toLowerCase()));
  const total = list.reduce((a,b)=>a+Number(b.sal||0),0);

  return (
    <div style={{background:"#0a0a0a", minHeight:"100vh", color:"#fff", padding:12, fontFamily:"system-ui"}}>
      <h3>⚡ EMS Dashboard 🔒 Auto-Save ON</h3>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, margin:"14px 0"}}>
        <div style={{background:"#171717", padding:14, borderRadius:14, borderTop:"3px solid #3b82f6"}}><h2>{list.length}</h2><p style={{fontSize:11, color:"#888"}}>Total</p></div>
        <div style={{background:"#171717", padding:14, borderRadius:14, borderTop:"3px solid #22c55e"}}><h2>{new Set(list.map(x=>x.dept)).size}</h2><p style={{fontSize:11, color:"#888"}}>Depts</p></div>
        <div style={{background:"#171717", padding:14, borderRadius:14, borderTop:"3px solid #f97316"}}><h2>₹ {total.toLocaleString("en-IN")}</h2><p style={{fontSize:11, color:"#888"}}>Payroll</p></div>
      </div>

      <div style={{background:"#171717", padding:16, borderRadius:16, border:"1px solid #262626"}}>
        <label style={{fontSize:10, color:"#777"}}>Profile Photo</label><input type="file" accept="image/*" onChange={handlePhoto} style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9, marginTop:4}} />
        {photo && <img src={photo} style={{width:60, height:60, borderRadius:"50%", marginTop:8}} />}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:8}}>
          <div><label style={{fontSize:10, color:"#777"}}>Employee ID</label><input value={form.id} onChange={e=>setForm({...form,id:e.target.value})} placeholder="EMP001" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} /></div>
          <div><label style={{fontSize:10, color:"#777"}}>Full Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} /></div>
          <div><label style={{fontSize:10, color:"#777"}}>Email ID *</label><input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} /></div>
          <div><label style={{fontSize:10, color:"#777"}}>Phone Number *</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} /></div>
          <div><label style={{fontSize:10, color:"#777"}}>Department</label><select value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})} style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}}><option>HR</option><option>IT</option><option>Finance</option><option>Marketing</option></select></div>
          <div><label style={{fontSize:10, color:"#777"}}>Company</label><input value={form.comp} onChange={e=>setForm({...form,comp:e.target.value})} placeholder="Company" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} /></div>
          <div><label style={{fontSize:10, color:"#777"}}>Salary *</label><input type="number" value={form.sal} onChange={e=>setForm({...form,sal:e.target.value})} placeholder="50000" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} /></div>
          <div><label style={{fontSize:10, color:"#777"}}>Location</label><input value={form.loc} onChange={e=>setForm({...form,loc:e.target.value})} placeholder="Delhi" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} /></div>
        </div>
        <label style={{fontSize:10, color:"#777", marginTop:8, display:"block"}}>Full Address</label><textarea value={form.addr} onChange={e=>setForm({...form,addr:e.target.value})} placeholder="Address" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} rows={2}></textarea>
        <label style={{fontSize:10, color:"#777", marginTop:8, display:"block"}}>Comment</label><textarea value={form.note} onChange={e=>setForm({...form,note:e.target.value})} placeholder="Note" style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9}} rows={1}></textarea>
        <button onClick={addEmp} style={{width:"100%", padding:13, background:"#3b82f6", border:"none", borderRadius:10, color:"#fff", fontWeight:700, marginTop:12, cursor:"pointer"}}>+ Add Employee</button>
      </div>

      <div style={{background:"#171717", padding:10, borderRadius:16, border:"1px solid #262626", marginTop:16}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Search..." style={{width:"100%", padding:11, background:"#1f1f1f", border:"1px solid #2a2a2a", color:"#fff", borderRadius:9, marginBottom:10}} />
        {filtered.map((e,i)=>(
          <div key={i} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 8px", borderBottom:"1px solid #1f1f1f"}}>
            <div style={{display:"flex", gap:10, alignItems:"center"}}><img src={e.photo||"https://i.pravatar.cc/100?u="+e.id} style={{width:42, height:42, borderRadius:"50%"}} /><div><b>{e.name}</b><br/><small style={{color:"#888"}}>{e.id} • {e.email}<br/>{e.phone} • {e.addr}</small></div></div>
            <div><small style={{background:"#0f172a", color:"#60a5fa", padding:"3px 8px", borderRadius:20}}>{e.dept}</small><br/><b>{e.comp}</b><br/>₹ {Number(e.sal).toLocaleString("en-IN")}</div>
            <button onClick={()=>removeEmp(list.indexOf(e))} style={{background:"#2a1515", color:"#ff5a5a", border:"1px solid #3a1a1a", padding:"6px 12px", borderRadius:8, cursor:"pointer"}}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
