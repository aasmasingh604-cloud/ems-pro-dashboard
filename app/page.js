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
  const [allDepts, setAllDepts] = useState(["IT", "HR", "Sales", "Marketing", "Finance", "Operations"])
  const [form, setForm] = useState({
    name: "", email: "", phone: "", salary: "", location: "", role: "", departments: [], photo: "https://i.pravatar.cc/150?u=11", status: "Active"
  })

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") setIsAdmin(true)
    const saved = JSON.parse(localStorage.getItem("ems-final-v3") || "[]")
    const savedDepts = JSON.parse(localStorage.getItem("ems-depts") || "[]")
    if (savedDepts.length > 0) setAllDepts(savedDepts)
    if (saved.length === 0) {
      const demo = [{ id: 1, name: "Neeraj Chopra", email: "neeraj@techforce.com", phone: "9876543210", salary: "75000", location: "Gurugram", role: "Developer", departments: ["IT"], photo: "https://i.pravatar.cc/150?u=11", status: "Active" }]
      setEmployees(demo)
      localStorage.setItem("ems-final-v3", JSON.stringify(demo))
    } else setEmployees(saved)
  }, [])

  const saveData = (data) => {
    localStorage.setItem("ems-final-v3", JSON.stringify(data))
    setEmployees(data)
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setForm(p => ({ ...p, photo: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    if (!form.name || !form.salary || form.departments.length === 0) return alert("Name, Salary, Department required!")
    let newList
    if (editId) {
      newList = employees.map(ev => ev.id === editId ? { ...ev, ...form } : ev)
    } else {
      newList = [...employees, { ...form, id: Date.now() }]
    }
    saveData(newList)
    setShowForm(false); setEditId(null); setShowCustomInput(false); setCustomDept("")
    setForm({ name: "", email: "", phone: "", salary: "", location: "", role: "", departments: [], photo: "https://i.pravatar.cc/150?u=11", status: "Active" })
  }

  const handleDelete = (id) => {
    if (!isAdmin) return alert("Admin login karo!")
    if (confirm("Delete permanently?")) {
      saveData(employees.filter(ev => ev.id !== id))
      setShowDetail(null)
    }
  }

  const toggleDept = (d) => {
    if (d === "Others") { setShowCustomInput(!showCustomInput); return }
    setForm(p => ({ ...p, departments: p.departments.includes(d) ? p.departments.filter(x => x !== d) : [...p.departments, d] }))
  }

  const addCustomDept = () => {
    if (!customDept.trim()) return alert("Naam likho!")
    const newDept = customDept.trim()
    const newDepts = [...allDepts, newDept]
    setAllDepts(newDepts)
    localStorage.setItem("ems-depts", JSON.stringify(newDepts))
    setForm(p => ({ ...p, departments: [...p.departments, newDept] }))
    setCustomDept(""); setShowCustomInput(false)
  }

  const totalSalary = employees.reduce((s, ev) => s + (parseInt(ev.salary) || 0), 0)
  const allDeptsInUse = [...new Set(employees.flatMap(ev => ev.departments))]
  const filtered = employees.filter(ev => ev.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-xl">TechForce HRMS</h1>
        <button onClick={() => { localStorage.setItem("isAdmin", "true"); setIsAdmin(true) }} className="bg-[#0f172a] border border-gray-700 px-3 py-1.5 rounded-full text-xs">{isAdmin ? "Admin ✓" : "Admin Login"}</button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800"><p className="text-gray-400 text-[11px]">Total Employees</p><p className="text-2xl font-bold">{employees.length}</p></div>
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800"><p className="text-gray-400 text-[11px]">Total Salary</p><p className="text-2xl font-bold">₹{totalSalary.toLocaleString()}</p></div>
      </div>

      <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800 mb-4">
        <p className="text-sm font-bold">Departments - {allDeptsInUse.length}</p>
        <div className="flex flex-wrap gap-2 mt-2">{allDeptsInUse.map(d => <span key={d} className="bg-gray-800 px-3 py-1 rounded-full text-xs">{d}</span>)}</div>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 bg-[#0f172a] border border-gray-800 p-3 rounded-xl text-sm" />
        {isAdmin && <button onClick={() => setShowForm(true)} className="bg-blue-600 px-5 rounded-xl text-sm font-bold">+ Add</button>}
      </div>

      {filtered.map(emp => (
        <div key={emp.id} className="bg-[#0f172a] p-4 rounded-2xl mb-3 flex justify-between items-center border border-gray-800">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowDetail(emp)}>
            <img src={emp.photo} className="w-12 h-12 rounded-full object-cover" />
            <div><p className="font-bold text-sm">{emp.name}</p><p className="text-gray-400 text-xs">{emp.departments.join(", ")} - Rs {emp.salary}</p></div>
          </div>
          {isAdmin && <div className="flex gap-2"><button onClick={() => { setForm(emp); setEditId(emp.id); setShowForm(true) }} className="bg-blue-600 px-3 py-1.5 rounded text-xs">Edit</button><button onClick={() => handleDelete(emp.id)} className="bg-red-600 px-3 py-1.5 rounded text-xs">Delete</button></div>}
        </div>
      ))}

      {showDetail && (
        <div className="fixed inset-0 bg-black z-50 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setShowDetail(null)} className="bg-gray-800 px-5 py-2.5 rounded-full text-sm">← Cancel</button>
            <button onClick={() => { saveData(employees); setShowDetail(null) }} className="bg-green-600 px-5 py-2.5 rounded-full text-sm font-bold">Save ✓</button>
          </div>
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
            <img src={showDetail.photo} className="w-28 h-28 rounded-full mx-auto mb-4" />
            <h2 className="text-center text-xl font-bold">{showDetail.name}</h2>
            <p className="text-center text-gray-400 text-xs mb-6">{showDetail.departments.join(", ")}</p>
            <div className="grid grid-cols-3 gap-3 mt-6">
              <button onClick={() => setShowDetail(null)} className="bg-gray-700 py-3 rounded-xl font-bold text-sm">Cancel</button>
              <button onClick={() => { setForm(showDetail); setEditId(showDetail.id); setShowDetail(null); setShowForm(true) }} className="bg-blue-600 py-3 rounded-xl font-bold text-sm">Edit</button>
              <button onClick={() => handleDelete(showDetail.id)} className="bg-red-600 py-3 rounded-xl font-bold text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f172a] p-6 rounded-2xl w-full max-w-md border border-gray-700 my-8">
            <h2 className="font-bold mb-4">{editId ? "Edit Employee" : "Add Employee"}</h2>
            
            {/* PROFILE PHOTO UPLOAD OPTION */}
            <div className="flex flex-col items-center mb-4">
              <img src={form.photo} className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 mb-2" />
              <label className="bg-blue-600 px-4 py-2 rounded-full text-xs font-bold cursor-pointer">
                + Profile Photo Add / Upload
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <p className="text-[10px] text-gray-500 mt-1">Gallery se photo select karo</p>
            </div>

            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full Name" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="Role" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="Salary" type="number" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-2 text-sm" />
            
            <p className="text-xs text-gray-400 mb-2 mt-2">Select Departments (Multiple):</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {allDepts.map(d => <button key={d} onClick={() => toggleDept(d)} className={`px-3 py-1.5 rounded-full text-xs border ${form.departments.includes(d) ? "bg-blue-600 border-blue-600" : "bg-gray-900 border-gray-700 text-gray-400"}`}>{d}</button>)}
              <button onClick={() => toggleDept("Others")} className={`px-3 py-1.5 rounded-full text-xs border ${showCustomInput ? "bg-yellow-600 border-yellow-600" : "bg-gray-900 border-yellow-700 text-yellow-400"}`}>+ Others</button>
            </div>

            {showCustomInput && (
              <div className="flex gap-2 mb-4">
                <input value={customDept} onChange={e => setCustomDept(e.target.value)} placeholder="Naya department likho" className="flex-1 p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-sm" />
                <button onClick={addCustomDept} className="bg-yellow-600 px-4 rounded-lg text-sm font-bold">Add</button>
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button onClick={() => { setShowForm(false); setEditId(null); setShowCustomInput(false) }} className="flex-1 bg-gray-800 py-3 rounded-xl text-sm font-bold">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-green-600 py-3 rounded-xl font-bold text-sm">Save ✓</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}