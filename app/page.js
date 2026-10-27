"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    id:"", name:"", dept:"HR", comp:"", sal:"", email:"", phone:"", empId:"", address:"", photo:""
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(()=>{
    const saved = localStorage.getItem("ems-line-by-line-dp");
    if(saved) setList(JSON.parse(saved));
  },[]);
  useEffect(()=>{
    localStorage.setItem("ems-line-by-line-dp", JSON.stringify(list));
  },[list]);

  const handlePhoto = (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const r = new FileReader();
    r.onloadend = ()=> setForm({...form, photo:r.result});
    r.readAsDataURL(file);
  };

  const handleSubmit = ()=>{
    if(!form.name) return alert("Name required");
    if(isEdit){
      setList(list.map(x=> x.id===form.id ? form : x));
      setIsEdit(false);
    } else {
      setList([...list, {...form, id:Date.now().toString()}]);
    }
    setForm({id:"", name:"", dept:"HR", comp:"", sal:"", email:"", phone:"", empId:"", address:"", photo:""});
  };

  // Front line par hi DP change karne ke liye
  const updateDPInline = (id, file)=>{
    if(!file) return;
    const r = new FileReader();
    r.onloadend = ()=>{
      setList(list.map(x=> x.id===id ? {...x, photo:r.result} : x));
    };
    r.readAsDataURL(file);
  };

  return (
    <div style={{minHeight:"100vh", background:"#f6f6f7", fontFamily:"system-ui", padding:"20px"}}>
      <div style={{maxWidth:"900px", margin:"auto"}}>
        
        {/* FORM - Line by line with labels */}
        <div style={{background:"white", borderRadius:"12px", padding:"20px", marginBottom:"20px"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
            <div><label style={lb}>Employee ID</label><input style={inp} placeholder="EMP001" value={form.empId} onChange={e=>setForm({...form, empId:e.target.value})}/></div>
            <div><label style={lb}>Name (with Sir Name)</label><input style={inp} placeholder="Rahul Singh" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
            <div><label style={lb}>Email ID</label><input style={inp} placeholder="rahul@tcs.com" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
            <div><label style={lb}>Contact Number</label><input style={inp} placeholder="98XXXXXXXX" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/></div>
            <div><label style={lb}>Department</label><select style={inp} value={form.dept} onChange={e=>setForm({...form, dept:e.target.value})}><option>HR</option><option>IT</option><option>Sales</option><option>Finance</option></select></div>
            <div><label style={lb}>Company</label><input style={inp} placeholder="TCS" value={form.comp} onChange={e=>setForm({...form, comp:e.target.value})}/></div>
            <div><label style={lb}>Salary</label><input style={inp} placeholder="50000" value={form.sal} onChange={e=>setForm({...form, sal:e.target.value})}/></div>
            <div><label style={lb}>Address</label><input style={inp} placeholder="Delhi" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/></div>
            <div style={{gridColumn:"span 2"}}><label style={lb}>Employee DP / Photo</label><input type="file" accept="image/*" onChange={handlePhoto} style={{...inp, padding:"8px"}}/>{form.photo && <img src={form.photo} style={{width:"50px", height:"50px", borderRadius:"50%", marginTop:"8px", objectFit:"cover"}}/>}</div>
          </div>
          <button onClick={handleSubmit} style={{marginTop:"14px", background:"#3b82f6", color:"white", padding:"10px 20px", border:"none", borderRadius:"8px", fontWeight:"600", cursor:"pointer"}}>{isEdit ? "Update" : "+ Add"}</button>
        </div>

        {/* TABLE - EXACT Screenshot jaisa line by line */}
        <div style={{background:"white", borderRadius:"12px", padding:"12px 18px"}}>
          <table style={{width:"100%", borderCollapse:"collapse"}}>
            <thead>
              <tr style={{color:"#9ca3af", fontSize:"14px", textAlign:"left"}}>
                <th style={{padding:"10px 8px", fontWeight:"400", width:"60px"}}>Photo</th>
                <th style={{padding:"10px 8px", fontWeight:"400"}}>Name</th>
                <th style={{padding:"10px 8px", fontWeight:"400"}}>Dept</th>
                <th style={{padding:"10px 8px", fontWeight:"400"}}>Company</th>
                <th style={{padding:"10px 8px", fontWeight:"400"}}>Salary</th>
                <th style={{padding:"10px 8px", fontWeight:"400"}}>Action</th>
              </tr>
              <tr><td colSpan="6" style={{borderBottom:"1.5px solid #111", padding:0}}></td></tr>
            </thead>
            <tbody>
              {list.map(emp=>(
                <>
                <tr key={emp.id} style={{borderBottom:"1px solid #e5e7eb"}}>
                  <td style={{padding:"12px 8px"}}>
                    <label style={{cursor:"pointer"}}>
                      {emp.photo ? <img src={emp.photo} style={{width:"38px", height:"38px", borderRadius:"50%", objectFit:"cover", border:"1px solid #e5e7eb"}}/> : <div style={{width:"38px", height:"38px", borderRadius:"50%", background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"11px"}}>UPLOAD</div>}
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>updateDPInline(emp.id, e.target.files[0])}/>
                    </label>
                  </td>
                  <td style={{padding:"12px 8px", fontSize:"15px", color:"#111827"}}>
                    {emp.name}
                    <div style={{fontSize:"10px", color:"#6b7280"}}>{emp.empId} {emp.email ? `• ${emp.email}` : ""}</div>
                  </td>
                  <td style={{padding:"12px 8px", color:"#3b82f6", fontSize:"14px"}}>{emp.dept}</td>
                  <td style={{padding:"12px 8px", fontSize:"14px"}}>{emp.comp}</td>
                  <td style={{padding:"12px 8px", fontSize:"14px"}}>₹ {emp.sal}</td>
                  <td style={{padding:"12px 8px"}}>
                    <span onClick={()=>{setForm(emp); setIsEdit(true); window.scrollTo({top:0})}} style={{color:"#2563eb", cursor:"pointer", fontSize:"13px", marginRight:"10px"}}>Edit</span>
                    <span onClick={()=>{ if(confirm("Delete?")) setList(list.filter(x=>x.id!==emp.id))}} style={{color:"#d11a2a", cursor:"pointer", fontSize:"14px"}}>Delete</span>
                  </td>
                </tr>
                <tr><td colSpan="6" style={{borderBottom:"1px solid #e5e7eb", padding:0}}></td></tr>
                </>
              ))}
            </tbody>
          </table>
          {list.length===0 && <div style={{padding:"20px", textAlign:"center", color:"#9ca3af"}}>No data</div>}
        </div>

        <div style={{textAlign:"center", fontSize:"11px", color:"#9ca3af", marginTop:"10px"}}>Tip: Photo par click karke front line se hi DP change kar sakte ho • Permanent Save</div>
      </div>
    </div>
  );
}

const lb = {display:"block", fontSize:"12px", color:"#6b7280", marginBottom:"4px"};
const inp = {width:"100%", padding:"9px 10px", border:"1px solid #e5e7eb", borderRadius:"6px", outline:"none", fontSize:"14px", boxSizing:"border-box"};