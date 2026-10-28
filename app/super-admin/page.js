"use client";
import { useEffect, useState } from "react";
export default function SuperAdmin(){
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name:"", email:"", password:"", plan:"basic" });
  const fetchCompanies = async () => {
    const res = await fetch("/api/companies"); const data = await res.json(); setCompanies(data);
  };
  useEffect(()=>{ fetchCompanies(); }, []);
  const createCompany = async (e) => {
    e.preventDefault();
    await fetch("/api/companies", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    setForm({ name:"", email:"", password:"", plan:"basic" }); fetchCompanies();
  };
  return (
    <div style={{padding:20, fontFamily:"sans-serif"}}>
      <h1>Super Admin - 10 Companies SaaS</h1>
      <form onSubmit={createCompany} style={{border:"1px solid #ccc", padding:15, marginBottom:20}}>
        <h3>Nayi Company Banao</h3>
        <input placeholder="Company Name (TCS)" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <input placeholder="Admin Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        <button type="submit">Create Company</button>
      </form>
      <h3>Total Companies: {companies.length} / 10</h3>
      {companies.map(c=>(
        <div key={c._id} style={{border:"1px solid #ddd", padding:10, margin:5}}>
          <b>{c.name}</b> - {c.email} - Expiry: {new Date(c.expiryDate).toLocaleDateString()} - {c.status}
        </div>
      ))}
    </div>
  );
}
