'use client'
import { useState, useEffect } from 'react'
const DEPTS = ["HR","Engineering","Sales","Marketing","Finance"]
const ROLES = ["Intern","Executive","Manager","Lead","Director"]

export default function Page(){
  const [list,setList]=useState([])
  const [view,setView]=useState("front")
  const [profile,setProfile]=useState(null)
  const [editingId,setEditingId]=useState(null)
  const [f,setF]=useState({name:"",email:"",phone:"",dept:[],role:"Executive",city:"",salary:""})
  const [prev,setPrev]=useState("")
  const [photo,setPhoto]=useState("")

  const load=()=>{ fetch('/api/employees').then(r=>r.json()).then(d=>setList(d||[])) }
  useEffect(()=>{ load() },[])

  const activeDepts = DEPTS.filter(d=> list.some(e=> (e.dept||[]).includes(d)))
  const totalSalary = list.reduce((a,b)=>a+(Number(b.salary)||0),0)

  const del=async(id)=>{
    if(!confirm("Delete karna hai?")) return
    await fetch(`/api/employees?id=${id}`,{method:'DELETE'})
    setProfile(null); load()
  }
  const toggleDept=(d)=>{ setF(p=>{const has=p.dept.includes(d); return {...p,dept:has?p.dept.filter(x=>x!==d):[...p.dept,d]}})}
  const startEdit=(emp)=>{
    setEditingId(emp.id)
    setF({name:emp.name,email:emp.email,phone:emp.phone,dept:emp.dept||[],role:emp.role,city:emp.city,salary:emp.salary})
    setPhoto(emp.photo||""); setPrev(emp.photo||""); setProfile(null); setView("add")
  }
  const startAdd=()=>{ setEditingId(null); setF({name:"",email:"",phone:"",dept:[],role:"Executive",city:"",salary:""}); setPrev(""); setPhoto(""); setView("add") }
  const save=async(e)=>{
    e.preventDefault()
    if(f.dept.length===0){ alert("1 Dept select kar"); return }
    const payload={name:f.name,email:f.email,phone:f.phone,dept:f.dept,role:f.role,city:f.city,salary:f.salary,photo:photo||`https://i.pravatar.cc/150?u=${f.email}`}
    if(editingId){
      await fetch('/api/employees',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,id:editingId})})
    }else{
      await fetch('/api/employees',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
    }
    setView("front"); setEditingId(null); load()
  }
  const handlePhoto=(e)=>{const file=e.target.files[0]; if(file){ setPrev(URL.createObjectURL(file)); const r=new FileReader(); r.onload=(ev)=>setPhoto(ev.target.result); r.readAsDataURL(file)}}

  if(view==="front"){
    return(
      <div style={{maxWidth:980,margin:"20px auto",padding:16,fontFamily:"sans-serif"}}>
        <div style={{background:"linear-gradient(180deg,#0b1220,#0a0f1e)",padding:20,borderRadius:24,border:"1px solid #1e293b"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h2 style={{color:"#fff",margin:0}}>EMS PRO - Official</h2>
            <button onClick={startAdd} style={{padding:"10px 18px",background:"#3b82f6",border:"none",borderRadius:12,color:"#fff",fontWeight:700,cursor:"pointer"}}>+ Add Employee</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
            <div style={{background:"#1e3a5f",padding:20,borderRadius:18,color:"#fff"}}>
              <div style={{opacity:.8,fontSize:12,fontWeight:600}}>TOTAL EMPLOYEES</div>
              <div style={{fontSize:42,fontWeight:800,margin:"8px 0"}}>{list.length}</div>
              <div style={{opacity:.7,fontSize:12}}>Working - {activeDepts.length} Active</div>
            </div>
            <div style={{background:"#1e3a5f",padding:20,borderRadius:18,color:"#fff"}}>
              <div style={{opacity:.8,fontSize:12,fontWeight:600}}>TOTAL SALARY PAYOUT</div>
              <div style={{fontSize:28,fontWeight:800,margin:"8px 0"}}>Rs {totalSalary.toLocaleString('en-IN')}</div>
              <div style={{opacity:.7,fontSize:12}}>Auto Monthly</div>
            </div>
            <div style={{background:"#f8fafc",padding:20,borderRadius:18,color:"#0f172a"}}>
              <div style={{opacity:.6,fontSize:12,fontWeight:600}}>DEPARTMENTS</div>
              <div style={{fontSize:42,fontWeight:800,margin:"8px 0"}}>{activeDepts.length}</div>
              <div style={{opacity:.6,fontSize:12}}>Active - From 0</div>
            </div>
          </div>
          <div style={{color:"#fff",fontWeight:700,marginBottom:10}}>All Employees ({list.length}) - {activeDepts.length} Depts Active</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {list.map(a=>(
              <div key={a.id} onClick={()=>setProfile(a)} style={{display:"flex",gap:14,alignItems:"center",background:"#0f172a",padding:14,borderRadius:14,border:"1px solid #1e293b",cursor:"pointer"}}>
                <img src={a.photo} style={{width:52,height:52,borderRadius:12,objectFit:"cover"}} alt=""/>
                <div style={{flex:1}}><div style={{color:"#fff",fontWeight:700}}>{a.name}</div><div style={{color:"#94a3b8",fontSize:12}}> {(a.dept||[]).join(", ")} - Rs {a.salary}</div></div>
                <div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
                  <button onClick={()=>startEdit(a)} style={{background:"#22c55e",border:"none",color:"#fff",padding:"6px 12px",borderRadius:8,cursor:"pointer"}}>Edit</button>
                  <button onClick={()=>del(a.id)} style={{background:"#ef4444",border:"none",color:"#fff",padding:"6px 12px",borderRadius:8,cursor:"pointer"}}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {profile && (
          <div onClick={()=>setProfile(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:20}}>
            <div onClick={e=>e.stopPropagation()} style={{background:"#0f172a",border:"1px solid #334155",borderRadius:22,padding:22,width:"100%",maxWidth:420,textAlign:"center"}}>
              <img src={profile.photo} style={{width:110,height:110,borderRadius:22,objectFit:"cover",border:"3px solid #3b82f6",marginBottom:12}} alt=""/>
              <h2 style={{margin:"0 0 4px",color:"#fff"}}>{profile.name}</h2><div style={{color:"#94a3b8",fontSize:13,marginBottom:14}}>{profile.role}</div>
              <div style={{textAlign:"left",background:"#020617",borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:10,fontSize:14,color:"#e2e8f0"}}>
                <div><b>Email:</b> {profile.email}</div><div><b>Phone:</b> {profile.phone}</div><div><b>Dept:</b> {(profile.dept||[]).join(", ")}</div><div><b>Salary:</b> Rs {profile.salary}</div>
              </div>
              <div style={{display:"flex",gap:10,marginTop:16}}>
                <button onClick={()=>startEdit(profile)} style={{flex:1,padding:12,background:"#22c55e",border:"none",borderRadius:10,color:"#fff",fontWeight:700}}>Edit</button>
                <button onClick={()=>del(profile.id)} style={{flex:1,padding:12,background:"#ef4444",border:"none",borderRadius:10,color:"#fff",fontWeight:700}}>Delete</button>
                <button onClick={()=>setProfile(null)} style={{flex:1,padding:12,background:"#334155",border:"none",borderRadius:10,color:"#fff"}}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  return(
    <div style={{maxWidth:520,margin:"20px auto",background:"#0f172a",padding:20,borderRadius:18,color:"#fff"}}>
      <button onClick={()=>{setView("front");setEditingId(null)}} style={{background:"none",border:"none",color:"#60a5fa",cursor:"pointer"}}>← Back</button>
      <h3>{editingId?"Update":"Add"} Employee</h3>
      <form onSubmit={save} style={{display:"flex",flexDirection:"column",gap:12}}>
        {prev?<img src={prev} style={{width:84,height:84,borderRadius:14}} alt=""/>:null}
        <input type="file" accept="image/*" onChange={handlePhoto}/>
        <input placeholder="Name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required style={{padding:12,borderRadius:8,background:"#020617",color:"#fff"}}/>
        <input placeholder="Email" type="email" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required style={{padding:12,borderRadius:8,background:"#020617",color:"#fff"}}/>
        <input placeholder="Phone" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} required style={{padding:12,borderRadius:8,background:"#020617",color:"#fff"}}/>
        <div style={{background:"#020617",border:"1px solid #334155",borderRadius:8,padding:12}}>
          <div style={{fontSize:12,opacity:.7,marginBottom:8}}>Select Multiple Departments:</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{DEPTS.map(d=>{const s=f.dept.includes(d);return(<button type="button" key={d} onClick={()=>toggleDept(d)} style={{padding:"6px 12px",borderRadius:20,border:"1px solid",borderColor:s?"#3b82f6":"#334155",background:s?"#3b82f6":"transparent",color:"#fff",fontSize:12}}>{s?"✓ ":""}{d}</button>)})}</div>
        </div>
        <select value={f.role} onChange={e=>setF({...f,role:e.target.value})} style={{padding:12,borderRadius:8,background:"#020617",color:"#fff"}}>{ROLES.map(d=><option key={d}>{d}</option>)}</select>
        <input placeholder="City" value={f.city} onChange={e=>setF({...f,city:e.target.value})} required style={{padding:12,borderRadius:8,background:"#020617",color:"#fff"}}/>
        <input placeholder="Salary" type="number" value={f.salary} onChange={e=>setF({...f,salary:e.target.value})} required style={{padding:12,borderRadius:8,background:"#020617",color:"#fff"}}/>
        <button type="submit" style={{padding:12,background:editingId?"#22c55e":"#3b82f6",border:"none",borderRadius:10,color:"#fff",fontWeight:800}}>{editingId?"Update":"Save"}</button>
      </form>
    </div>
  )
}