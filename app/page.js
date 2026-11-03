"use client"
import { useEffect, useState } from "react"

export default function Home() {
  const [employees, setEmployees] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  
  const [formData, setFormData] = useState({
    name: "", department: [], salary: "", email: "", phone: "", photo: "https://i.pravatar.cc/150"
  })

  const departments = ["IT", "HR", "Sales", "Marketing", "Finance", "Operations"]

  useEffect(() => {
    if (localStorage.getItem("isAdmin") === "true") setIsAdmin(true)
    const data = JSON.parse(localStorage.getItem("employees") || "[]")
    setEmployees(data)
  }, [])

  const toggleDept = (dept) => {
    setFormData(prev => ({
      ...prev,
      department: prev.department.includes(dept) 
        ? prev.department.filter(d => d !== dept)
        : [...prev.department, dept]
    }))
  }

  const handleSave = () => {
    if (!formData.name || formData.department.length === 0) return alert("Name aur Department toh bharo!")

    let updated;
    if (editingId) {
      updated = employees.map(e => e.id === editingId ? { ...e, ...formData } : e)
    } else {
      const newEmp = { ...formData, id: Date.now(), department: formData.department.join(", ") }
      // Fix: department array ko string me convert for display
      updated = [...employees, { ...newEmp, department: Array.isArray(formData.department) ? formData.department.join(", ") : formData.department }]
      // But save as array
      const saveEmp = { ...formData, id: Date.now() }
      updated = [...employees, saveEmp]
    }
    
    // Final correct save logic
    let finalData;
    if (editingId) {
      finalData = employees.map(e => e.id === editingId ? { ...e, ...formData, department: formData.department.join ? formData.department.join(", ") : formData.department } : e)
    } else {
      finalData = [...employees, { ...formData, id: Date.now(), department: formData.department.join(", ") }]
    }

    localStorage.setItem("employees", JSON.stringify(finalData))
    setEmployees(finalData)
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: "", department: [], salary: "", email: "", phone: "", photo: "https://i.pravatar.cc/150" })
    alert(editingId ? "Updated!" : "Saved! Ab kabhi delete nahi hoga")
  }

  const handleEdit = (emp) => {
    const deptArray = typeof emp.department === 'string' ? emp.department.split(", ").map(s=>s.trim()) : emp.department
    setFormData({ ...emp, department: deptArray })
    setEditingId(emp.id)
    setShowForm(true)
  }

  const handleDelete = (id, name) => {
    if (!isAdmin) return alert("Only Admin can delete!")
    if (!confirm(`${name} ko delete karna hai?`)) return
    const updated = employees.filter(e => e.id != id)
    localStorage.setItem("employees", JSON.stringify(updated))
    setEmployees(updated)
  }

  return (
    <div className="min-h-screen bg-black p-4 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-2xl font-bold">TechForce HRMS</h1>
        <div className="flex gap-2">
          {isAdmin ? (
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-4 py-2 rounded-full">+ Add</button>
          ) : (
            <button onClick={() => {localStorage.setItem("isAdmin","true"); setIsAdmin(true)}} className="bg-gray-800 text-white px-3 py-2 rounded-full text-sm">Admin Login</button>
          )}
        </div>
      </div>

      {/* Employee List */}
      {employees.map((emp) => (
        <div key={emp.id} className="bg-[#0f172a] p-4 rounded-xl mb-3 flex justify-between items-center border border-gray-800">
          <div className="flex items-center gap-3">
            <img src={emp.photo} className="w-12 h-12 rounded-full" />
            <div>
              <p className="text-white font-bold">{emp.name}</p>
              <p className="text-gray-400 text-sm">{Array.isArray(emp.department) ? emp.department.join(", ") : emp.department} - Rs {emp.salary}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <button onClick={() => handleEdit(emp)} className="bg-blue-600 px-3 py-1.5 rounded text-white text-sm">Edit</button>
                <button onClick={() => handleDelete(emp.id, emp.name)} className="bg-red-600 px-3 py-1.5 rounded text-white text-sm">Delete</button>
              </>
            )}
          </div>
        </div>
      ))}

      {/* FORM INSIDE MAIN PAGE - Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] p-6 rounded-2xl w-full max-w-md border border-gray-700">
            <h2 className="text-white text-xl font-bold mb-4">{editingId ? "Edit Employee" : "Add Employee"}</h2>
            
            <input placeholder="Name" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full p-3 rounded bg-gray-800 text-white mb-3" />
            <input placeholder="Salary" value={formData.salary} onChange={e=>setFormData({...formData, salary:e.target.value})} className="w-full p-3 rounded bg-gray-800 text-white mb-3" />
            <input placeholder="Email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full p-3 rounded bg-gray-800 text-white mb-3" />
            
            <p className="text-white text-sm mb-2">Department (Multiple select kar sakti ho):</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {departments.map(dept => (
                <button key={dept} onClick={()=>toggleDept(dept)} className={`px-3 py-1 rounded-full text-sm border ${formData.department.includes(dept) ? "bg-blue-600 border-blue-600 text-white" : "bg-gray-800 border-gray-600 text-gray-300"}`}>{dept}</button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={()=>{setShowForm(false); setEditingId(null)}} className="flex-1 bg-gray-700 text-white py-3 rounded-xl">Cancel</button>
              <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}