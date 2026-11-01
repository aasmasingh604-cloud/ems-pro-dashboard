"use client";
import { useState, useEffect } from "react";
const DEPARTMENTS = ["HR","Admin","Engineering","Sales","Marketing","Finance","Operations","IT Support","Design","Product","QA","Training","Internship","Management","Customer Support","Research","Others"];
const ROLES = ["HR Executive","HR Manager","Admin Officer","Recruiter","Java Developer","React Dev","Node Dev","Python Dev","Full Stack","UI Designer","Sales Executive","Marketing Executive","Accountant","Support Engineer","Team Lead","Project Manager","Intern","Other"];
export default function Page(){
  const [view,setView]=useState("front");
  const [form,setForm]=useState({name:"",email:"",phone:"",dept:"HR",role:"HR Executive",city:"",salary:"",photo:""});
  const [list,setList]=useState([]);
  const [preview,setPreview]=useState("");
  const [companyName,setCompanyName]=useState("TechForce HRMS");
  useEffect(()=>{
    try{
      const s=localStorage.getItem("ems_employees");
      if(s) setList(JSON.parse(s));
      const cn=localStorage.getItem("ems_company_name");
      if(cn) setCompanyName(cn);
    }catch(e){}
  },[]);
  const save=(newList)=>{
    setList(newList);
    localStorage.setItem("ems_employees",JSON.stringify(newList));
  };
  const onPhoto=(e)=>{
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=()=>{
      setPreview(r.result);
      setForm({...form,photo:r.result});
    };
    r.readAsDataURL(file);
  };
  const handleSave=(e)=>{
    e.preventDefault();
    const data={...form,salary:Number(form.salary)||0,id:Date.now()};
    save([...list,data]);
    setForm({name:"",email:"",phone:"",dept:"HR",role:"HR Executive",city:"",salary:"",photo:""});
    setPreview("");
    setView("front");
  };
  const totalEmp=list.length;
  const totalSalary=list.reduce((s,a)=>s+(Number(a.salary)||0),0);
  const activeDepts=new Set(list.map(a=>a.dept)).size;
  if(view==="front"){
    return(
      <div style={{minHeight:"100vh",background:"rgb(5,7,10)",color:"rgb(255,255,255)",padding:20}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <input value={companyName} onChange={(e)=>{setCompanyName(e.target.value); localStorage.setItem("ems_company_name",e.target.value)}} style={{background:"transparent",border:"none",color:"rgb(255,255,255)",fontSize:22,fontWeight:"900",outline:"none",width:250}} />
            <button onClick={()=>setView("form")} style={{padding:"12px 20px",background:"rgb(255,255,255)",color:"rgb(0,0,0)",border:"none",borderRadius:20,fontWeight:"800",cursor:"pointer"}}>+ Add Employee</button>
          </div>
          <div style={{background:"rgb(16,26,45)",borderRadius:24,padding:24,marginTop:20,border:"1px solid rgb(26,42,68)"}}>
            <h2 style={{margin:0,fontSize:18,opacity:0.8}}>Professional management for unlimited employees</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginTop:20}}>
              <div style={{background:"rgb(42,59,94)",padding:18,borderRadius:16}}>
                <div style={{fontSize:11,opacity:0.7}}>TOTAL EMPLOYEES</div>
                <div style={{fontSize:36,fontWeight:"900"}}>{totalEmp}</div>
                <div style={{fontSize:11,opacity:0.6}}>Working - {activeDepts} Active</div>
              </div>
              <div style={{background:"rgb(42,59,94)",padding:18,borderRadius:16}}>
                <div style={{fontSize:11,opacity:0.7}}>TOTAL SALARY PAYOUT</div>
                <div style={{fontSize:28,fontWeight:"900"}}>Rs {totalSalary.toLocaleString("en-IN")}</div>
                <div style={{fontSize:11,opacity:0.6}}>Auto Monthly</div>
              </div>
              <div style={{background:"rgb(255,255,255)",color:"rgb(0,0,0)",padding:18,borderRadius:16}}>
                <div style={{fontSize:11,opacity:0.7}}>DEPARTMENTS</div>
                <div style={{fontSize:36,fontWeight:"900"}}>{activeDepts}</div>
                <div style={{fontSize:11,opacity:0.6}}>Active - From 0</div>
              </div>
            </div>
          </div>
          <h3 style={{marginTop:20}}>All Employees ({totalEmp}) - {activeDepts} Depts Active</h3>
          {totalEmp===0 ? <div style={{padding:20,textAlign:"center",opacity:0.5,border:"1px dashed gray",borderRadius:12}}>0 Employees - Start from 0</div> : null}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",gap:10,marginTop:10}}>
            {list.map(a=>(
              <div key={a.id} style={{background:"rgb(17,26,42)",padding:12,borderRadius:12,display:"flex",gap:10,alignItems:"center",border:"1px solid rgb(26,35,51)"}}>
                <img src={a.photo||"https://via.placeholder.com/50"} style={{width:48,height:48,borderRadius:10,objectFit:"cover"}} alt="emp" />
                <div><b>{a.name}</b><div style={{fontSize:12,opacity:0.6}}>{a.dept} - Rs {a.salary}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return(
    <div style={{maxWidth:450,margin:"20px auto",background:"rgb(17,26,42)",padding:20,borderRadius:16,color:"rgb(255,255,255)"}}>
      <button onClick={()=>setView("front")} style={{background:"none",border:"none",color:"rgb(122,168,255)",cursor:"pointer"}}>Back</button>
      <h3>Add Employee</h3>
      <form onSubmit={handleSave} style={{display:"flex",flexDirection:"column",gap:10,marginTop:10}}>
        {preview ? <img src={preview} style={{width:70,height:70,borderRadius:10,objectFit:"cover"}} alt="preview" /> : null}
        <input type="file" accept="image/*" onChange={onPhoto} />
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required style={inp} />
        <input placeholder="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required style={inp} />
        <input placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required style={inp} />
        <input placeholder="Total Salary" type="number" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} required style={inp} />
        <select value={form.dept} onChange={e=>setForm({...form,dept:e.target.value})} style={inp}>{DEPARTMENTS.map(d=><option key={d} value={d}>{d}</option>)}</select>
        <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})} style={inp}>{ROLES.map(d=><option key={d}>{d}</option>)}</select>
        <input placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} required style={inp} />
        <button type="submit" style={{padding:12,background:"rgb(42,123,255)",border:"none",borderRadius:10,color:"rgb(255,255,255)",fontWeight:"800",cursor:"pointer"}}>Save Employee</button>
      </form>
    </div>
  )
}
const inp={padding:10,borderRadius:8,border:"1px solid gray",background:"rgb(10,15,26)",color:"rgb(255,255,255)",width:"100%"};