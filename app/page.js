"use client";
import { useState, useEffect, useMemo, useRef } from "react";

export default function Page() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ id:"", empId:"", name:"", email:"", phone:"", dept:"HR", comp:"", sal:"", address:"", photo:"" });
  const [isEdit, setIsEdit] = useState(false);
  const loaded = useRef(false);

  // LOAD
  useEffect(()=>{
    const keys = ["ems-final-permanent-v6", "ems-permanent-24hr-v5", "ems-final-auto-v4", "ems-line-by-line-dp"];
    for(let k of keys){
      const s = localStorage.getItem(k);
      if(s){ try{ const d=JSON.parse(s); if(d?.length>0){ setList(d); break; } }catch(e){} }
    }
    setTimeout(()=>{ loaded.current = true; }, 600);
  },[]);

  // SAVE - sirf load ke baad
  useEffect(()=>{
    if(!loaded.current) return;
    localStorage.setItem("ems-final-permanent-v6", JSON.stringify(list));
  },[list]);

  const handlePhoto = (e)=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader(); r.onloadend=()=>setForm({...form, photo:r.result}); r.readAsDataURL(f);
  };

  const handleSubmit = ()=>{
    if(!form.name || !form.empId) return alert("Name & Emp ID required");
    if(isEdit){ setList(list.map(x=> x.id===form.id ? form : x)); setIsEdit(false); }
    else{ setList([...list, {...form, id:Date.now().toString()}]); }
    setForm({id:"", empId:"", name:"", email:"", phone:"", dept:"HR", comp:"", sal:"", address:"", photo:""});
  };

  const totalEmp = list.length;
  const totalDepts = new Set(list.map(x=>x.dept).filter(Boolean)).size;
  const totalPayroll = list.reduce((a,b)=> a + (Number(b.sal)||0), 0);

  const filtered = useMemo(()=>{
    if(!search) return list;
    const q=search.toLowerCase();
    return list.filter(e=> e.name?.toLowerCase().includes(q) || e.empId?.toLowerCase().includes(q) || e.dept?.toLowerCase().includes(q) || e.comp?.toLowerCase().includes(q));
  },[list, search]);

  return (
    <div style={{minHeight:"100vh", background:"#f6f6f7", fontFamily:"system-ui", padding:"14px"}}>
      <div style={{maxWidth:"1200px", margin:"auto"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"14px"}}>
          <div style={{background:"white", borderRadius:"12px", padding:"16px", borderLeft:"4px solid #3b82f6"}}><div style={{fontSize:"24px", fontWeight:"800"}}>{totalEmp}</div><div style={{fontSize:"13px", color:"#6b7280"}}>Total Employees</div></div>
          <div style={{background:"white", borderRadius:"12px", padding:"16px", borderLeft:"4px solid #22c55e"}}><div style={{fontSize:"24px", fontWeight:"800"}}>{totalDepts}</div><div style={{fontSize:"13px", color:"#6b7280"}}>Departments</div></div>
          <div style={{background:"white", borderRadius:"12px", padding:"16px", borderLeft:"4px solid #f97316"}}><div style={{fontSize:"24px", fontWeight:"800"}}>₹{totalPayroll.toLocaleString()}</div><div style={{fontSize:"13px", color:"#6b7280"}}>Total Payroll</div></div>
        </div>

        <div style={{background:"white", borderRadius:"12px", padding:"12px", marginBottom:"14px", display:"flex", gap:"10px"}}>
          <input style={{flex:1, padding:"10px 14px", border:"1.5px solid #e5e7eb", borderRadius:"8px"}} placeholder="Search: Name, Emp ID, Department, Company..." value={search} onChange={e=>setSearch(e.target.value)}/>
          <div style={{padding:"10px", fontSize:"12px"}}>{filtered.length} found</div>
        </div>

        <div style={{background:"white", borderRadius:"12px", padding:"18px", marginBottom:"16px"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
            <div><label style={lb}>Employee ID *</label><input style={inp} value={form.empId} onChange={e=>setForm({...form, empId:e.target.value})}/></div>
            <div><label style={lb}>Name + Sir Name *</label><input style={inp} value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
            <div><label style={lb}>Email ID</label><input style={inp} value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
            <div><label style={lb}>Contact</label><input style={inp} value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/></div>
            <div><label style={lb}>Department</label><select style={inp} value={form.dept} onChange={e=>setForm({...form, dept:e.target.value})}><option>HR</option><option>IT</option><option>Sales</option><option>Finance</option><option>Marketing</option></select></div>
            <div><label style={lb}>Company</label><input style={inp} value={form.comp} onChange={e=>setForm({...form, comp:e.target.value})} placeholder="TCS / Infosys etc"/></div>
            <div><label style={lb}>Salary</label><input type="number" style={inp} value={form.sal} onChange={e=>setForm({...form, sal:e.target.value})}/></div>
            <div><label style={lb}>Address</label><input style={inp} value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/></div>
            <div style={{gridColumn:"span 2"}}><label style={lb}>Photo</label><input type="file" accept="image/*" onChange={handlePhoto} style={{...inp, padding:"8px"}}/></div>
          </div>
          <button onClick={handleSubmit} style={btn}>{isEdit ? "Update" : "+ Add Employee"}</button>
          <div style={{marginTop:"8px", fontSize:"11px", color:"#22c55e", fontWeight:"600"}}>✓ FIXED: Refresh pe delete nahi hoga - sirf Delete button se hoga</div>
        </div>

        <div style={{background:"white", borderRadius:"12px", overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%", borderCollapse:"collapse", minWidth:"950px"}}>
              <thead><tr style={{background:"#fafafa", borderTop:"1px solid #e5e7eb", borderBottom:"1.5px solid #111", fontSize:"13px", color:"#6b7280", textAlign:"left"}}><th style={th}>Photo</th><th style={th}>Name / ID / Email</th><th style={th}>Dept</th><th style={th}>Company</th><th style={th}>Contact</th><th style={th}>Address</th><th style={th}>Salary</th><th style={th}>Action</th></tr></thead>
              <tbody>
                {filtered.map(emp=>(
                  <tr key={emp.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                    <td style={{padding:"12px 10px"}}>{emp.photo ? <img src={emp.photo} style={{width:"40px", height:"40px", borderRadius:"50%", objectFit:"cover"}}/> : <div style={{width:"40px", height:"40px", borderRadius:"50%", background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px"}}>DP</div>}</td>
                    <td style={{padding:"12px 10px"}}><div style={{fontWeight:"600"}}>{emp.name}</div><div style={{fontSize:"11px", color:"#6b7280"}}>{emp.empId} • {emp.email}</div></td>
                    <td style={{padding:"12px 10px", color:"#3b82f6"}}>{emp.dept}</td>
                    <td style={{padding:"12px 10px"}}>{emp.comp}</td>
                    <td style={{padding:"12px 10px"}}>{emp.phone}</td>
                    <td style={{padding:"12px 10px", fontSize:"12px"}}>{emp.address}</td>
                    <td style={{padding:"12px 10px"}}>₹{emp.sal}</td>
                    <td style={{padding:"12px 10px"}}><span onClick={()=>{setForm(emp); setIsEdit(true); window.scrollTo({top:0})}} style={{color:"#2563eb", cursor:"pointer", marginRight:"8px"}}>Edit</span><span onClick={()=>{ if(confirm("Delete?")) setList(list.filter(x=>x.id!==emp.id))}} style={{color:"#ef4444", cursor:"pointer"}}>Delete</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
const lb = {display:"block", fontSize:"12px", color:"#6b7280", marginBottom:"4px"};
const inp = {width:"100%", padding:"9px 12px", border:"1.5px solid #e5e7eb", borderRadius:"8px", outline:"none", fontSize:"14px", boxSizing:"border-box"};
const th = {padding:"12px 10px", fontWeight:"500", whiteSpace:"nowrap"};
const btn = {marginTop:"14px", background:"#3b82f6", color:"white", padding:"10px 20px", border:"none", borderRadius:"8px", fontWeight:"600", cursor:"pointer"};