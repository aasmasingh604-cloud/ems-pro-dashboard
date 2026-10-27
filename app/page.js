"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    id:"", empId:"", name:"", email:"", phone:"", dept:"HR", comp:"", sal:"", address:"", photo:""
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(()=>{
    const s = localStorage.getItem("ems-final-auto-v4");
    if(s) setList(JSON.parse(s));
  },[]);
  useEffect(()=>{
    localStorage.setItem("ems-final-auto-v4", JSON.stringify(list));
  },[list]);

  const handlePhoto = (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const r = new FileReader();
    r.onloadend = ()=> setForm({...form, photo:r.result});
    r.readAsDataURL(file);
  };

  const handleSubmit = ()=>{
    if(!form.name || !form.empId) return alert("Emp ID & Name required");
    if(isEdit){
      setList(list.map(x=> x.id===form.id ? form : x));
      setIsEdit(false);
    } else {
      setList([...list, {...form, id:Date.now().toString()}]);
    }
    setForm({id:"", empId:"", name:"", email:"", phone:"", dept:"HR", comp:"", sal:"", address:"", photo:""});
  };

  // Auto Calculations
  const totalEmp = list.length;
  const totalDepts = new Set(list.map(x=>x.dept)).size;
  const totalPayroll = list.reduce((a,b)=> a + (Number(b.sal)||0), 0);

  const updateDP = (id, file)=>{
    if(!file) return;
    const r = new FileReader();
    r.onloadend = ()=> setList(list.map(x=> x.id===id ? {...x, photo:r.result} : x));
    r.readAsDataURL(file);
  };

  return (
    <div style={{minHeight:"100vh", background:"#f5f5f7", fontFamily:"system-ui", padding:"14px"}}>
      <div style={{maxWidth:"1100px", margin:"auto"}}>

        {/* TOP 3 CARDS - Auto Count */}
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"16px"}}>
          <div style={{background:"white", borderRadius:"12px", padding:"14px 18px", borderLeft:"4px solid #3b82f6", boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:"22px", fontWeight:"800"}}>{totalEmp}</div>
            <div style={{fontSize:"13px", color:"#6b7280"}}>Total Employees</div>
          </div>
          <div style={{background:"white", borderRadius:"12px", padding:"14px 18px", borderLeft:"4px solid #22c55e", boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:"22px", fontWeight:"800"}}>{totalDepts}</div>
            <div style={{fontSize:"13px", color:"#6b7280"}}>Departments</div>
          </div>
          <div style={{background:"white", borderRadius:"12px", padding:"14px 18px", borderLeft:"4px solid #f97316", boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:"22px", fontWeight:"800"}}>₹ {totalPayroll}</div>
            <div style={{fontSize:"13px", color:"#6b7280"}}>Total Payroll</div>
          </div>
        </div>

        {/* FORM - All fields line by line */}
        <div style={{background:"white", borderRadius:"12px", padding:"18px", marginBottom:"16px", boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
            <div><label style={lb}>Employee ID *</label><input style={inp} placeholder="EMP001" value={form.empId} onChange={e=>setForm({...form, empId:e.target.value})}/></div>
            <div><label style={lb}>Name + Sir Name *</label><input style={inp} placeholder="Rahul Singh" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></div>
            <div><label style={lb}>Email ID</label><input style={inp} placeholder="rahul@tcs.com" value={form.email} onChange={e=>setForm({...form, email:e.target.value})}/></div>
            <div><label style={lb}>Contact Number</label><input style={inp} placeholder="98XXXXXXXX" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/></div>
            <div><label style={lb}>Department</label><select style={inp} value={form.dept} onChange={e=>setForm({...form, dept:e.target.value})}><option>HR</option><option>IT</option><option>Sales</option><option>Finance</option><option>Marketing</option></select></div>
            <div><label style={lb}>Company</label><input style={inp} placeholder="TCS" value={form.comp} onChange={e=>setForm({...form, comp:e.target.value})}/></div>
            <div><label style={lb}>Salary</label><input type="number" style={inp} placeholder="50000" value={form.sal} onChange={e=>setForm({...form, sal:e.target.value})}/></div>
            <div><label style={lb}>Address</label><input style={inp} placeholder="Delhi, India" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/></div>
            <div style={{gridColumn:"span 2"}}><label style={lb}>Employee DP / Photo</label><input type="file" accept="image/*" onChange={handlePhoto} style={{...inp, padding:"8px"}}/>{form.photo && <img src={form.photo} style={{width:"50px", height:"50px", borderRadius:"50%", marginTop:"8px", objectFit:"cover"}}/>}</div>
          </div>
          <button onClick={handleSubmit} style={btn}>{isEdit ? "Update Employee" : "+ Add"}</button>
          {isEdit && <button onClick={()=>{setIsEdit(false); setForm({id:"", empId:"", name:"", email:"", phone:"", dept:"HR", comp:"", sal:"", address:"", photo:""})}} style={{marginLeft:"8px", background:"#f1f5f9", padding:"10px 16px", borderRadius:"8px", border:"none"}}>Cancel</button>}
        </div>

        {/* TABLE - Screenshot jaisa + all fields front */}
        <div style={{background:"white", borderRadius:"12px", padding:"0", overflow:"hidden", boxShadow:"0 1px 2px rgba(0,0,0,0.05)"}}>
          <div style={{padding:"10px 14px", fontSize:"12px", color:"#9ca3af"}}>← Scroll to see Contact, Address, Action → • Click Photo to change DP • Permanent Save</div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%", borderCollapse:"collapse", minWidth:"900px"}}>
              <thead>
                <tr style={{color:"#6b7280", fontSize:"13px", textAlign:"left", background:"#fafafa", borderBottom:"1px solid #e5e7eb", borderTop:"1px solid #e5e7eb"}}>
                  <th style={th}>Photo</th>
                  <th style={th}>Name / ID / Email</th>
                  <th style={th}>Dept</th>
                  <th style={th}>Company</th>
                  <th style={th}>Contact</th>
                  <th style={th}>Address</th>
                  <th style={th}>Salary</th>
                  <th style={th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map(emp=>(
                  <tr key={emp.id} style={{borderBottom:"1px solid #f0f0f0"}}>
                    <td style={{padding:"12px 10px"}}>
                      <label style={{cursor:"pointer"}}>
                        {emp.photo ? <img src={emp.photo} style={{width:"40px", height:"40px", borderRadius:"50%", objectFit:"cover"}}/> : <div style={{width:"40px", height:"40px", borderRadius:"50%", background:"#f3f4f6", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px"}}>DP</div>}
                        <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>updateDP(emp.id, e.target.files[0])}/>
                      </label>
                    </td>
                    <td style={{padding:"12px 10px"}}>
                      <div style={{fontWeight:"600", fontSize:"14px"}}>{emp.name}</div>
                      <div style={{fontSize:"11px", color:"#6b7280"}}>{emp.empId} • {emp.email}</div>
                    </td>
                    <td style={{padding:"12px 10px", color:"#3b82f6", fontSize:"13px"}}>{emp.dept}</td>
                    <td style={{padding:"12px 10px", fontSize:"13px"}}>{emp.comp}</td>
                    <td style={{padding:"12px 10px", fontSize:"13px", fontWeight:"500"}}>{emp.phone || "-"}</td>
                    <td style={{padding:"12px 10px", fontSize:"12px", maxWidth:"120px"}}>{emp.address || "-"}</td>
                    <td style={{padding:"12px 10px", fontSize:"13px"}}>₹ {emp.sal}</td>
                    <td style={{padding:"12px 10px"}}>
                      <span onClick={()=>{setForm(emp); setIsEdit(true); window.scrollTo({top:0, behavior:"smooth"})}} style={{color:"#2563eb", cursor:"pointer", fontSize:"12px", marginRight:"8px"}}>Edit</span>
                      <span onClick={()=>{ if(confirm("Delete employee?")) setList(list.filter(x=>x.id!==emp.id))}} style={{color:"#ef4444", cursor:"pointer", fontSize:"12px"}}>Delete</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length===0 && <div style={{padding:"24px", textAlign:"center", color:"#9ca3af"}}>No employees yet</div>}
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