"use client"
import { useState } from "react"

export default function Home() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Rahul Singh", dept: "HR", company: "TCS", salary: 50000 },
    { id: 2, name: "Sancta", dept: "IT", company: "Infosys", salary: 60000 }
  ])
  const [name, setName] = useState("")
  const [dept, setDept] = useState("")
  const [company, setCompany] = useState("")
  const [salary, setSalary] = useState("")

  const addEmployee = () => {
    if (!name || !dept || !company || !salary) return
    setEmployees([...employees, { id: Date.now(), name, dept, company, salary: Number(salary) }])
    setName(""); setDept(""); setCompany(""); setSalary("")
  }
  const deleteEmployee = (id) => setEmployees(employees.filter(e => e.id !== id))
  const totalPayroll = employees.reduce((s, e) => s + e.salary, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-black text-white p-4 font-bold">⚡ EMS Dashboard - PRO</div>
      <div className="p-4 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-blue-500"><h2 className="text-xl font-bold">{employees.length}</h2><p className="text-sm text-gray-500">Total Employees</p></div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-green-500"><h2 className="text-xl font-bold">2</h2><p className="text-sm text-gray-500">Departments</p></div>
        <div className="bg-white p-4 rounded-xl shadow border-l-4 border-orange-400"><h2 className="text-xl font-bold">₹ {totalPayroll}</h2><p className="text-sm text-gray-500">Total Payroll</p></div>
      </div>
      <div className="px-4">
        <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-2">
          <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Name" className="border rounded-lg px-4 py-2 flex-1" />
          <input value={dept} onChange={(e)=>setDept(e.target.value)} placeholder="HR / IT" className="border rounded-lg px-4 py-2 flex-1" />
          <input value={company} onChange={(e)=>setCompany(e.target.value)} placeholder="Company" className="border rounded-lg px-4 py-2 flex-1" />
          <input value={salary} onChange={(e)=>setSalary(e.target.value)} placeholder="Salary" type="number" className="border rounded-lg px-4 py-2 flex-1" />
          <button onClick={addEmployee} className="bg-blue-500 text-white px-6 py-2 rounded-lg">+ Add</button>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="grid grid-cols-5 text-xs text-gray-400 mb-2 px-2 gap-2">
            <span>Name</span><span>Dept</span><span>Company</span><span>Salary</span><span>Action</span>
          </div>
          {employees.map(emp => (
            <div key={emp.id} className="grid grid-cols-5 items-center py-3 border-t text-sm px-2 gap-2">
              <span className="font-medium">{emp.name}</span>
              <span><span className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs">{emp.dept}</span></span>
              <span className="font-medium">{emp.company}</span>
              <span>₹ {emp.salary}</span>
              <span onClick={()=>deleteEmployee(emp.id)} className="text-red-500 cursor-pointer font-medium">Delete</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}