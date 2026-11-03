"use client"
import { useState, useEffect } from "react"

export default function Home() {
  const [employees, setEmployees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  
  const [form, setForm] = useState({
    name: "", salary: "", email: "", phone: "", photo: "https://i.pravatar.cc/150?u=", departments: []
  })

  const allDepts = ["IT", "HR", "Sales", "Marketing", "Finance", "Operations"]

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") setIsAdmin(true)
    const saved = JSON.parse(localStorage.getItem("ems-employees") || "[]")
    // Agar pehli baar hai toh demo data daal de
    if (saved.length === 0) {
      const demo = [
        { id: 1, name: "Neeraj Chopra", salary: "75000", email: "neeraj@techforce.com", phone: "9876543210", photo: "https://i.pravatar.cc/150?u=1", departments: ["IT"], status: "Active" }
      ]
      setEmployees(demo)
      localStorage.setItem("ems-employees", JSON.stringify(demo))
    } else {
      setEmployees(saved)
    }
  }, [])

  const saveToStorage = (data) => {
    setEmployees(data)
    localStorage.setItem("ems-employees", JSON.stringify(data))
  }

  const toggleDept = (d) => {
    setForm(p => ({ ...p, departments: p.departments.includes(d) ? p.departments.filter(x => x !== d) : [...p.departments, d] }))
  }

  const handleSave = () => {
    if (!form.name || !form.salary || form.departments.length === 0) return alert("Name, Salary, Department bharna zaruri hai!")
    
    let newList
    if (editId) {
      newList = employees.map(e => e.id === editId ? { ...e, ...form } : e)
    } else {
      newList = [...employees, { ...form, id: Date.now(), status: "Active", photo: form.photo + Date.now() }]
    }
    saveToStorage(newList)
    setShowForm(false)
    setEditId(null)
    setForm({ name: "", salary: "", email: "", phone: "", photo: "https://i.pravatar.cc/150?u=", departments: [] })
  }

  const handleDelete = (id) => {
    if (!isAdmin) return alert("Only Admin can delete! Admin Login karo")
    if (confirm("Delete karna hai? Ye permanent hai!")) {
      saveToStorage(employees.filter(e => e.id !== id))
      setShowDetail(null)
    }
  }

  const totalSalary = employees.reduce((sum, e) => sum + (parseInt(e.salary) || 0), 0)
  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      {/* Header - Wahi purana design */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">TechForce HRMS</h1>
        <button onClick={() => { localStorage.setItem("isAdmin", "true"); setIsAdmin(true); alert("Admin Login Done!") }} className="bg-[#0f172a] border border-gray-700 px-3 py-1.5 rounded-full text-xs">{isAdmin ? "Admin ✓" : "Admin Login"}</button>
      </div>

      {/* Stats - Total Employee & Salary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-xs">Total Employees</p>
          <p className="text-2xl font-bold">{employees.length}</p>
        </div>
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800">
          <p className="text-gray-400 text-xs">Total Salary</p>
          <p className="text-2xl font-bold">₹{totalSalary.toLocaleString()}</p>
        </div>
      </div>

      {/* Department Auto Show */}
      <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800 mb-4">
        <p className="text-sm font-bold mb-2">Departments ({[...new Set(employees.flatMap(e => e.departments))].length})</p>
        <div className="flex flex-wrap gap-2">
          {[...new Set(employees.flatMap(e => e.departments))].map(d => (
            <span key={d} className="bg-gray-800 px-3 py-1 rounded-full text-xs">{d}</span>
          ))}
          {employees.length === 0 && <span className="text-gray-500 text-xs">Koi department nahi, employee add karo</span>}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employee..." className="flex-1 bg-[#0f172a] border border-gray-800 p-3 rounded-xl text-sm" />
        {isAdmin && <button onClick={() => setShowForm(true)} className="bg-blue-600 px-5 rounded-xl text-sm font-bold">+ Add</button>}
      </div>

      {/* Employee List */}
      {filtered.map(emp => (
        <div key={emp.id} onClick={() => setShowDetail(emp)} className="bg-[#0f172a] p-4 rounded-2xl mb-3 flex justify-between items-center border border-gray-800 cursor-pointer active:scale-[0.98] transition">
          <div className="flex items-center gap-3">
            <img src={emp.photo} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-bold text-sm">{emp.name}</p>
              <p className="text-gray-400 text-xs">{emp.departments.join(", ")} - Rs {emp.salary}</p>
            </div>
          </div>
          <span className="text-gray-500">›</span>
        </div>
      ))}

      {/* Detail Page - Profile open */}
      {showDetail && (
        <div className="fixed inset-0 bg-black z-50 p-4 overflow-y-auto">
          <button onClick={() => setShowDetail(null)} className="mb-4 text-sm">← Back</button>
          <div className="bg-[#0f172a] rounded-2xl p-6 border border-gray-800">
            <img src={showDetail.photo} className="w-28 h-28 rounded-full mx-auto mb-4" />
            <h2 className="text-center text-xl font-bold">{showDetail.name}</h2>
            <p className="text-center text-gray-400 text-sm mb-6">{showDetail.departments.join(", ")}</p>
            
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-400">Salary:</span> ₹{showDetail.salary}</p>
              <p><span className="text-gray-400">Email:</span> {showDetail.email || "N/A"}</p>
              <p><span className="text-gray-400">Phone:</span> {showDetail.phone || "N/A"}</p>
              <p><span className="text-gray-400">Status:</span> {showDetail.status}</p>
              <p><span className="text-gray-400">Departments:</span> {showDetail.departments.join(", ")}</p>
            </div>

            {isAdmin && (
              <div className="flex gap-3 mt-8">
                <button onClick={() => { setForm(showDetail); setEditId(showDetail.id); setShowDetail(null); setShowForm(true) }} className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-sm">Edit</button>
                <button onClick={() => handleDelete(showDetail.id)} className="flex-1 bg-red-600 py-3 rounded-xl font-bold text-sm">Delete</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Form Inside Main */}
      {showForm && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] p-6 rounded-2xl w-full max-w-md border border-gray-700">
            <h2 className="font-bold mb-4">{editId ? "Edit Employee" : "Add Employee"}</h2>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Name" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-3 text-sm" />
            <input value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} placeholder="Salary" type="number" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-3 text-sm" />
            <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-3 text-sm" />
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" className="w-full p-3 rounded-xl bg-gray-900 border border-gray-800 mb-3 text-sm" />
            
            <p className="text-xs text-gray-400 mb-2">Select Departments (Multiple):</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {allDepts.map(d => (
                <button key={d} onClick={() => toggleDept(d)} className={`px-3 py-1.5 rounded-full text-xs border ${form.departments.includes(d) ? "bg-blue-600 border-blue-600" : "bg-gray-900 border-gray-700 text-gray-400"}`}>{d}</button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setShowForm(false); setEditId(null) }} className="flex-1 bg-gray-800 py-3 rounded-xl text-sm">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-blue-600 py-3 rounded-xl font-bold text-sm">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}