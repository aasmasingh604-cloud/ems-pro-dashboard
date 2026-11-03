"use client"
import { useState, useEffect } from "react"
import { db } from "../lib/firebase"
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore"

export default function Home() {
  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [allDepts, setAllDepts] = useState(["IT","HR","Sales","Marketing","Finance","Operations"])
  const [customDept, setCustomDept] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [form, setForm] = useState({ name:"", email:"", phone:"", salary:"", address:"", location:"", role:"", departments:[], photo:"https://i.pravatar.cc/150?u=11", status:"Active" })

  useEffect(()=>{
    if(localStorage.getItem("isAdmin")==="true") setIsAdmin(true)
    const unsub = onSnapshot(collection(db, "employees"), (snap)=>{
      setEmployees(snap.docs.map(d=>({id:d.id, ...d.data()})))
    })
    return ()=>unsub()
  },[])

  const handlePhoto=(e)=>{
    const file=e.target.files[0]; if(!file) return
    const r=new FileReader()
    r.onload=async ()=>{
      if(showDetail){
        await updateDoc(doc(db,"employees",showDetail.id), {photo:r.result})
        setShowDetail({...showDetail, photo:r.result})
      } else {
        setForm(p=>({...p,photo:r.result}))
      }
    }
    r.readAsDataURL(file)
  }

  const handleSave= async ()=>{
    if(!form.name||!form.salary||form.departments.length===0) return alert("Name, Salary, Dept required!")
    if(editId){ await updateDoc(doc(db,"employees",editId), form) }
    else { await addDoc(collection(db,"employees"), form) }
    setShowForm(false); setEditId(null); setShowCustomInput(false)
    setForm({name:"",email:"",phone:"",salary:"",address:"",location:"",role:"",departments:[],photo:"https://i.pravatar.cc/150?u=11",status:"Active"})
  }

  const handleDelete= async (id)=>{
    if(!isAdmin) return alert("Admin login karo!")
    if(confirm("Permanently delete?")){ await deleteDoc(doc(db,"employees",id)); setShowDetail(null) }
  }

  const totalSalary=employees.reduce((s,ev)=>s+(parseInt(ev.salary)||0),0)
  const filtered=employees.filter(ev=>ev.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl">TechForce HRMS - LIVE SYNC</h1>
        <button onClick={()=>{localStorage.setItem("isAdmin","true");setIsAdmin(true)}} className="bg-[#0f172a] border border-gray-700 px-3 py-1.5 rounded-full text-xs">{isAdmin?"Admin ✓":"Admin Login"}</button>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800"><p className="text-gray-400 text-[11px]">Total Employees - Unlimited</p><p className="text-2xl font-bold">{employees.length}</p></div>
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800"><p className="text-gray-400 text-[11px]">Total Salary</p><p className="text-2xl font-bold">₹{totalSalary.toLocaleString()}</p></div>
      </div>
      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="flex-1 bg-[#0f172a] border border-gray-800 p-3 rounded-xl text-sm" />
        {isAdmin && <button onClick={()=>setShowForm(true)} className="bg-blue-600 px-5 rounded-xl text-sm font-bold">+ Add</button>}
      </div>
      {filtered.map(emp=>(
        <div key={emp.id} className="bg-[#0f172a] p-4 rounded-2xl mb-3 flex justify-between items-center border border-gray-800">
          <div className="flex items-center gap-3 cursor-pointer" onClick={()=>setShowDetail(emp)}>
            <img src={emp.photo} className="w-12 h-12 rounded-full object-cover" />
            <div><p className="font-bold text-sm">{emp.name}</p><p className="text-gray-400 text-xs">{emp.departments?.join(", ")} - ₹{emp.salary}</p><p className="text-gray-500 text-[11px]">{emp.email} • {emp.phone}</p></div>
          </div>
          <span>›</span>
        </div>
      ))}

      {showDetail && (
        <div className="fixed inset-0 bg-black z-50 p-4 overflow-y-auto">
          <div className="flex justify-between mb-4"><button onClick={()=>setShowDetail(null)} className="bg-gray-800 px-5 py-2.5 rounded-full text-sm">← Cancel</button><button onClick={()=>setShowDetail(null)} className="bg-green-600 px-5 py-2.5 rounded-full text-sm font-bold">Save ✓</button></div>
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800 text-center">
            <img src={showDetail.photo} className="w-28 h-28 rounded-full mx-auto border-2 border-blue-600 object-cover" />
            <div className="flex gap-2 justify-center mt-3">
              <label className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold cursor-pointer">📸 Change Photo<input type="file" accept="image/*" onChange={handlePhoto} className="hidden"/></label>
              <label className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-full text-xs font-bold cursor-pointer">🔄 Update<input type="file" accept="image/*" onChange={handlePhoto} className="hidden"/></label>
            </div>
            <h2 className="text-xl font-bold mt-4">{showDetail.name}</h2>
            <p className="text-gray-400 text-xs mb-4">{showDetail.email} | {showDetail.phone} | {showDetail.address}</p>
            <div className="grid grid-cols-3 gap-2 mt-6">
              <button onClick={()=>setShowDetail(null)} className="bg-gray-700 py-3 rounded-xl text-sm font-bold">Cancel</button>
              <button onClick={()=>{setForm(showDetail);setEditId(showDetail.id);setShowDetail(null);setShowForm(true)}} className="bg-blue-600 py-3 rounded-xl text-sm font-bold">Update Profile</button>
              <button onClick={()=>handleDelete(showDetail.id)} className="bg-red-600 py-3 rounded-xl text-sm font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f172a] p-6 rounded-2xl w-full max-w-md border border-gray-700 my-8">
            <h2 className="font-bold mb-4">{editId?"Update Profile":"Add Employee"}</h2>
            <div className="flex flex-col items-center mb-3">
              <img src={form.photo} className="w-20 h-20 rounded-full object-cover border-2 border-blue-600"/>
              <label className="mt-2 bg-blue-600 px-4 py-2 rounded-full text-xs font-bold cursor-pointer">Profile Upload / Change / Update<input type="file" accept="image/*" onChange={handlePhoto} className="hidden"/></label>
            </div>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm"/>
            <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm"/>
            <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm"/>
            <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Full Address" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm"/>
            <input value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} placeholder="Salary" type="number" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm"/>
            <div className="flex flex-wrap gap-2 mb-3 mt-3">
              {allDepts.map(d=><button key={d} onClick={()=>setForm(p=>({...p,departments:p.departments.includes(d)?p.departments.filter(x=>x!==d):[...p.departments,d]}))} className={`px-3 py-1.5 rounded-full text-xs border ${form.departments.includes(d)?"bg-blue-600 border-blue-600":"bg-gray-900 border-gray-700 text-gray-400"}`}>{d}</button>)}
              <button onClick={()=>setShowCustomInput(!showCustomInput)} className="px-3 py-1.5 rounded-full text-xs border bg-gray-900 border-yellow-700 text-yellow-400">+ Others</button>
            </div>
            {showCustomInput && <div className="flex gap-2 mb-3"><input value={customDept} onChange={e=>setCustomDept(e.target.value)} placeholder="New department" className="flex-1 p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-sm"/><button onClick={()=>{if(!customDept.trim())return; setAllDepts([...allDepts,customDept.trim()]); setForm(p=>({...p,departments:[...p.departments,customDept.trim()]})); setCustomDept(""); setShowCustomInput(false)}} className="bg-yellow-600 px-4 rounded-lg text-sm font-bold">Add</button></div>}
            <div className="flex gap-3 mt-4">
              <button onClick={()=>setShowForm(false)} className="flex-1 bg-gray-800 py-3 rounded-xl text-sm font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-green-600 py-3 rounded-xl font-bold text-sm">{editId?"Update ✓":"Save ✓"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}