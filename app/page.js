"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
const DEPARTMENTS = ["HR","Admin","Engineering","Sales","Marketing","Finance","Operations","IT Support","Design","Product","QA","Training","Internship","Management","Customer Support","Research","Others"];
const ROLES = ["HR Executive","HR Manager","Admin Officer","Recruiter","Java Developer","React Dev","Node Dev","Python Dev","Full Stack","UI Designer","Sales Executive","Marketing Executive","Accountant","Support Engineer","Team Lead","Project Manager","Intern","Other"];
const ADMIN_PASS = "TechForce@123";
export default function Page(){
  const [view,setView]=useState("front");
  const [form,setForm]=useState({name:"",email:"",phone:"",dept:"HR",role:"HR Executive",city:"",salary:"",photo:""});
  const [list,setList]=useState([]); const [preview,setPreview]=useState(""); const [isAdmin,setIsAdmin]=useState(false); const [adminInput,setAdminInput]=useState(""); const [loading,setLoading]=useState(true);
  const fetchData = async()=>{
    setLoading(true);
    const {data}= await supabase.from("employees").select("*").order("created_at",{ascending:false});
    if(data) setList(data);
    setLoading(false);
  };
  useEffect(()=>{ fetchData(); const a=localStorage.getItem("isAdmin"); if(a==="yes") setIsAdmin(true); },[]);
  const onPhoto=(e)=>{
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader(); r.onload=()=>{ setPreview(r.result); setForm({...form,photo:r.result}); }; r.readAsDataURL(file);
  };
  const handleSave=async(e)=>{
    e.preventDefault();
    const data={...form,salary:Number(form.salary)||0,id:Date.now()};
    const {error}= await supabase.from("employees").insert([data]);
    if(!error){ setList([data,...list]); setForm({name:"",email:"",phone:"",dept:"HR",role:"HR Executive",city:"",salary:"",photo:""}); setPreview(""); setView("front"); }
    else alert("Error: "+error.message);
  };
  const handleDelete=async(id)=>{
    if(!isAdmin) return alert("Only Admin can delete");
    if(!confirm("Delete?")) return;
    const {error}= await supabase.from("employees").delete().eq("id",id);
    if(!error) setList(list.filter(x=>x.id!==id));
  };
  const loginAdmin=()=>{
    if(adminInput===ADMIN_PASS){ setIsAdmin(true); localStorage.setItem("isAdmin","yes"); setAdminInput(""); alert("Admin Login Success"); }
    else alert("Wrong Password");
  };
  const logout=()=>{ setIsAdmin(false); localStorage.removeItem("isAdmin"); };
  const totalEmp=list.length; const totalSalary=list.reduce((s,a)=>s+(Number(a.salary)||0),0); const activeDepts=new Set(list.map(a=>a.dept)).size;
  if(view==="front"){
    return(
      <div style={{minHeight:"100vh",background:"rgb(5,7,10)",color:"#fff",padding:20}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <h2 style={{margin:0}}>TechForce HRMS - Permanent DB</h2>
            <div style={{display:"flex",gap:8,alignItems:"center"}}>
              {!isAdmin ? (
                <><input placeholder="Admin Pass" value={adminInput} onChange={e=>setAdminInput(e.target.value)} type="password" style={{padding:"8px",borderRadius:8,border:"none"}} />
                <button onClick={loginAdmin} style={{padding:"8px 12px",background:"#444",color:"#fff",borderRadius:8,border:"none"}}>Admin Login</button></>
              ) : <button onClick={logout} style={{padding:"8px 12px",background:"orange",color:"#000",borderRadius:8,border:"none"}}>Logout Admin</button>}
              <button onClick={()=>setView("form")} style={{padding:"12px 20px",background:"#fff",color:"#000",border:"none",borderRadius:20,fontWeight:"800"}}>+ Add Employee</button>
            </div>
          </div>
          <div style={{background:"rgb(16,26,45)",borderRadius:24,padding:24,marginTop:20,border:"1px solid rgb(26,42,68)"}}>
            <h3 style={{margin:0,fontSize:18,opacity:0.8}}>Professional management - Permanent DB</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:20}}>
              <div style={{background:"rgb(42,59,94)",padding:18,borderRadius:16}}>
                <div style={{fontSize:11,opacity:0.7}}>TOTAL EMPLOYEES</div>
                <div style={{fontSize:36,fontWeight:"900"}}>{loading?"...":totalEmp}</div>
              </div>
              <div style={{background:"rgb(42,59,94)",padding:18,borderRadius:16}}>
                <div style={{fontSize:11,opacity:0.7}}>TOTAL SALARY</div>
                <div style={{fontSize:28,fontWeight:"900"}}>Rs {totalSalary.toLocaleString("en-IN")}</div>
              </div>
              <div style={{background:"#fff",color:"#000",padding:18,borderRadius:16}}>
                <div style={{fontSize:11,opacity:0.7}}>DEPARTMENTS</div>
                <div style={{fontSize:36,fontWeight:"900"}}>{activeDepts}</div>
              </div>
            </div>
          </div>
          <h3 style={{marginTop:20}}>All Employees ({totalEmp}) {loading?"Loading...":""}</h3>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:10,marginTop:10}}>
            {list.map(a=>(
              <div key={a.id} style={{background:"rgb(17,26,42)",padding:12,borderRadius:12,display:"flex",gap:10,alignItems:"center",justifyContent:"space-between",border:"1px solid rgb(26,35,51)"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <img src={a.photo||"https://via.placeholder.com/50"} style={{width:48,height:48,borderRadius:10,objectFit:"cover"}} alt="emp" />
                  <div><b>{a.name}</b><div style={{fontSize:12,opacity:0.6}}>{a.dept} - Rs {a.salary}</div><div style={{fontSize:10,opacity:0.5}}>{a.city}</div></div>
                </div>
                {isAdmin && <button onClick={()=>handleDelete(a.id)} style={{background:"red",color:"#fff",border:"none",borderRadius:6,padding:"4px 8px",fontSize:11}}>Delete</button>}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return(
    <div style={{maxWidth:450,margin:"20px auto",background:"rgb(17,26,42)",padding:20,borderRadius:16,color:"#fff"}}>
      <button onClick={()=>setView("front")} style={{background:"none",border:"none",color:"rgb(122,168,255)",cursor:"pointer"}}>Back</button>
      <h3>Add Employee - Permanent Save</h3>
      <form onSubmit={handleSave} style={{display:"flex",flexDirection:"column",gap:10,marginTop:10}}>
        {preview ? <img src={preview} style={{width:70,height:70,borderRadius:10,objectFit:"cover"}} alt="preview" /> : null}
        <input type="file" accept="image/*" onChange={onPhoto} />
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required style={{padding:10,borderRadius:8,border:"1px solid gray",background:"rgb(10,15,26)",color:"#fff"}} />
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required style={{padding:10,borderRadius:8,border:"1px solid gray",background:"rgb(10,15,26)",color:"#fff"}} />
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required style={{padding:10,borderRadius:8,border:"1px solid gray",background:"rgb(10,15,26)",color:"#fff"}} />
        <input placeholder="Total Salary" type="number" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} required style={{padding:10,borderRadius:8,border:"1px solid gray",background:"rgb(10,15,26)",color:"#fff"}} />
        <select value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})} style={{padding:10,borderRadius:8,border:"1px solid gray",background:"rgb(10,15,26)",color:"#fff"}}>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select>
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={{padding:10,borderRadius:8,border:"1px solid gray",background:"rgb(10,15,26)",color:"#fff"}}>{ROLES.map(d=><option key={d}>{d}</option>)}</select>
        <input placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} required style={{padding:10,borderRadius:8,border:"1px solid gray",background:"rgb(10,15,26)",color:"#fff"}} />
        <button type="submit" style={{padding:12,background:"rgb(42,123,255)",border:"none",borderRadius:10,color:"#fff",fontWeight:"800"}}>Save Permanently</button>
      </form>
    </div>
  )
}