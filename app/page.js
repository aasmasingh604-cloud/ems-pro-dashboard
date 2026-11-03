"use client"
import { useState, useEffect } from "react"

export default function Home() {
  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [customDept, setCustomDept] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [allDepts, setAllDepts] = useState(["IT","HR","Sales","Marketing","Finance","Operations","Legal","Support"])
  const [form, setForm] = useState({ name:"", email:"", phone:"", salary:"", address:"", location:"", role:"", departments:[], photo:"https://i.pravatar.cc/150?u=11", status:"Active" })

  useEffect(()=>{
    if(localStorage.getItem("isAdmin")==="true") setIsAdmin(true)
    const saved = JSON.parse(localStorage.getItem("ems-final-v5")||"[]")
    const savedDepts = JSON.parse(localStorage.getItem("ems-depts-v5")||"[]")
    if(savedDepts.length>0) setAllDepts(savedDepts)
    if(saved.length===0){
      const demo=[{id:1,name:"Neeraj Chopra",email:"neeraj@techforce.com",phone:"9876543210",salary:"75000",address:"Sector 44, Gurugram",location:"Gurugram",role:"Developer",departments:["IT","Support"],photo:"https://i.pravatar.cc/150?u=11",status:"Active"}]
      setEmployees(demo); localStorage.setItem("ems-final-v5",JSON.stringify(demo))
    } else setEmployees(saved)
  },[])

  const saveData=(data)=>{localStorage.setItem("ems-final-v5",JSON.stringify(data)); setEmployees(data)}
  const saveDepts=(d)=>{setAllDepts(d); localStorage.setItem("ems-depts-v5",JSON.stringify(d))}

  const handlePhoto=(e)=>{
    const file=e.target.files[0]; if(!file) return
    const r=new FileReader()
    r.onload=()=>{
      if(showDetail){
        const updated=employees.map(ev=>ev.id===showDetail.id?{...ev,photo:r.result}:ev)
        saveData(updated); setShowDetail({...showDetail,photo:r.result})
      } else setForm(p=>({...p,photo:r.result}))
    }
    r.readAsDataURL(file)
  }

  const handleSave=()=>{
    if(!form.name||!form.salary||form.departments.length===0) return alert("Name, Salary, Department required!")
    if(!form.email||!form.phone||!form.address) return alert("Email, Phone, Address bhi bharna hai!")
    let newList=editId?employees.map(ev=>ev.id===editId?{...ev,...form}:ev):[...employees,{...form,id:Date.now()}]
    saveData(newList); setShowForm(false); setEditId(null); setShowCustomInput(false); setCustomDept("")
    setForm({name:"",email:"",phone:"",salary:"",address:"",location:"",role:"",departments:[],photo:"https://i.pravatar.cc/150?u=11",status:"Active"})
  }

  const handleDelete=(id)=>{
    if(!isAdmin) return alert("Admin login karo!")
    if(confirm("Delete permanently?")){saveData(employees.filter(ev=>ev.id!==id)); setShowDetail(null)}
  }

  const toggleDept=(d)=>{
    if(d==="Others"){setShowCustomInput(!showCustomInput); return}
    setForm(p=>({...p,departments:p.departments.includes(d)?p.departments.filter(x=>x!==d):[...p.departments,d]}))
  }

  const addCustomDept=()=>{
    if(!customDept.trim()) return alert("Naam likho!")
    const nd=[...allDepts,customDept.trim()]
    saveDepts(nd)
    setForm(p=>({...p,departments:[...p.departments,customDept.trim()]}))
    setCustomDept(""); setShowCustomInput(false)
  }

  const totalSalary=employees.reduce((s,ev)=>s+(parseInt(ev.salary)||0),0)
  const allDeptsInUse=[...new Set(employees.flatMap(ev=>ev.departments))]
  const filtered=employees.filter(ev=>ev.name.toLowerCase().includes(search.toLowerCase())||ev.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl">TechForce HRMS</h1>
        <button onClick={()=>{localStorage.setItem("isAdmin","true");setIsAdmin(true)}} className="bg-[#0f172a] border border-gray-700 px-3 py-1.5 rounded-full text-xs">{isAdmin?"Admin ✓":"Admin Login"}</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800"><p className="text-gray-400 text-[11px]">Total Employees</p><p className="text-2xl font-bold">{employees.length}</p></div>
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800"><p className="text-gray-400 text-[11px]">Total Salary</p><p className="text-2xl font-bold">₹{totalSalary.toLocaleString()}</p></div>
      </div>

      <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800 mb-4">
        <p className="text-sm font-bold">Departments - {allDeptsInUse.length}</p>
        <div className="flex flex-wrap gap-2 mt-2">{allDeptsInUse.map(d=><span key={d} className="bg-gray-800 px-3 py-1 rounded-full text-xs">{d} ({employees.filter(e=>e.departments.includes(d)).length})</span>)}</div>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, email..." className="flex-1 bg-[#0f172a] border border-gray-800 p-3 rounded-xl text-sm" />
        {isAdmin && <button onClick={()=>setShowForm(true)} className="bg-blue-600 px-5 rounded-xl text-sm font-bold">+ Add</button>}
      </div>

      {filtered.map(emp=>(
        <div key={emp.id} className="bg-[#0f172a] p-4 rounded-2xl mb-3 flex justify-between items-center border border-gray-800">
          <div className="flex items-center gap-3 cursor-pointer" onClick={()=>setShowDetail(emp)}>
            <img src={emp.photo} className="w-12 h-12 rounded-full object-cover" />
            <div><p className="font-bold text-sm">{emp.name}</p><p className="text-gray-400 text-xs">{emp.departments.join(", ")} • {emp.email}</p><p className="text-gray-500 text-[11px]">{emp.phone} • {emp.address}</p></div>
          </div>
          <span className="text-gray-500">›</span>
        </div>
      ))}

      {showDetail && (
        <div className="fixed inset-0 bg-black z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <button onClick={()=>setShowDetail(null)} className="bg-gray-800 px-5 py-2.5 rounded-full text-sm">← Cancel</button>
            <button onClick={()=>saveData(employees)} className="bg-green-600 px-5 py-2.5 rounded-full text-sm font-bold">Save ✓</button>
          </div>
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
            <div className="flex flex-col items-center">
              <img src={showDetail.photo} className="w-28 h-28 rounded-full mx-auto mb-3 border-2 border-blue-600 object-cover" />
              <div className="flex gap-2 mb-4">
                <label className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold cursor-pointer">📸 Change Photo<input type="file" accept="image/*" onChange={handlePhoto} className="hidden" /></label>
                <label className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-full text-xs font-bold cursor-pointer">🔄 Update<input type="file" accept="image/*" onChange={handlePhoto} className="hidden" /></label>
              </div>
            </div>
            <h2 className="text-center text-xl font-bold">{showDetail.name}</h2>
            <p className="text-center text-gray-400 text-xs mb-4">{showDetail.role} • {showDetail.departments.join(", ")}</p>
            <div className="space-y-2 text-sm bg-black/50 p-4 rounded-xl">
              <p><b>Email:</b> {showDetail.email}</p>
              <p><b>Phone:</b> {showDetail.phone}</p>
              <p><b>Address:</b> {showDetail.address}</p>
              <p><b>Location:</b> {showDetail.location}</p>
              <p><b>Salary:</b> ₹{showDetail.salary}</p>
              <p><b>Status:</b> {showDetail.status}</p>
            </div>
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
            <div className="flex flex-col items-center mb-4">
              <img src={form.photo} className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 mb-2" />
              <label className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold cursor-pointer">Profile Upload / Change<input type="file" accept="image/*" onChange={handlePhoto} className="hidden" /></label>
            </div>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full Name" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email ID" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="Phone Number" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.address} onChange={e=>setForm({...form,address:e.target.value})} placeholder="Full Address" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.location} onChange={e=>setForm({...form,location:e.target.value})} placeholder="Location" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.role} onChange={e=>setForm({...form,role:e.target.value})} placeholder="Role - ex: Developer" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} placeholder="Salary" type="number" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <p className="text-xs text-gray-400 mb-2 mt-3">Departments - Multiple + Others:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {allDepts.map(d=><button key={d} onClick={()=>toggleDept(d)} className={`px-3 py-1.5 rounded-full text-xs border ${form.departments.includes(d)?"bg-blue-600 border-blue-600":"bg-gray-900 border-gray-700 text-gray-400"}`}>{d}</button>)}
              <button onClick={()=>toggleDept("Others")} className="px-3 py-1.5 rounded-full text-xs border bg-gray-900 border-yellow-700 text-yellow-400">+ Others</button>
            </div>
            {showCustomInput && (
              <div className="flex gap-2 mb-4 bg-black/50 p-2 rounded-xl border border-yellow-800">
                <input value={customDept} onChange={e=>setCustomDept(e.target.value)} placeholder="Naya department likho" className="flex-1 p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-sm" />
                <button onClick={addCustomDept} className="bg-yellow-600 px-4 rounded-lg text-sm font-bold">Add</button>
              </div>
            )}
            <div className="flex gap-3 mt-2">
              <button onClick={()=>{setShowForm(false);setEditId(null);setShowCustomInput(false)}} className="flex-1 bg-gray-800 py-3 rounded-xl text-sm font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-green-600 py-3 rounded-xl font-bold text-sm">{editId?"Update ✓":"Save ✓"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}