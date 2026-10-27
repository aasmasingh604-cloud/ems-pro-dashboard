 "use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    id: "", empId: "", name: "", email: "", phone: "", 
    dept: "HR", comp: "TCS", sal: "", address: "", photo: ""
  });
  const [isEdit, setIsEdit] = useState(false);

  // Load - permanent save
  useEffect(() => {
    const saved = localStorage.getItem("ems-final-permanent");
    if (saved) {
      try { setList(JSON.parse(saved)); } catch(e){}
    }
  }, []);

  // Save - auto permanent
  useEffect(() => {
    localStorage.setItem("ems-final-permanent", JSON.stringify(list));
  }, [list]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, photo: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.name || !form.empId || !form.email) {
      alert("Employee ID, Name, Email compulsory hai!");
      return;
    }
    if (isEdit) {
      setList(list.map((x) => (x.id === form.id ? form : x)));
      setIsEdit(false);
    } else {
      setList([...list, { ...form, id: Date.now().toString() }]);
    }
    setForm({ id: "", empId: "", name: "", email: "", phone: "", dept: "HR", comp: "TCS", sal: "", address: "", photo: "" });
  };

  const editEmp = (item) => {
    setForm(item);
    setIsEdit(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeEmp = (id) => {
    if (confirm("Delete karna hai?")) {
      setList(list.filter((x) => x.id !== id));
    }
  };

  const filtered = list.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.empId.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalSal = list.reduce((a, b) => a + (Number(b.sal) || 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "system-ui" }}>
      <div style={{ background: "#0f172a", color: "white", padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <b>⚡ EMS PRO - Permanent Storage</b>
        <input placeholder="🔍 Search ID / Name / Email" value={search} onChange={e=>setSearch(e.target.value)} style={{ padding: "8px 14px", borderRadius: "20px", border: "none", width: "250px" }} />
      </div>

      <div style={{ padding: "20px", maxWidth: "1100px", margin: "auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", borderLeft: "5px solid #3b82f6" }}><h2 style={{ margin: 0 }}>{list.length}</h2><small style={{ color: "#64748b" }}>Total Employees</small></div>
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", borderLeft: "5px solid #10b981" }}><h2 style={{ margin: 0 }}>{new Set(list.map(x => x.dept)).size}</h2><small style={{ color: "#64748b" }}>Departments</small></div>
          <div style={{ background: "white", padding: "16px", borderRadius: "12px", borderLeft: "5px solid #f59e0b" }}><h2 style={{ margin: 0 }}>₹{totalSal}</h2><small style={{ color: "#64748b" }}>Total Payroll</small></div>
        </div>

        {/* Form */}
        <div style={{ background: "white", padding: "20px", borderRadius: "16px", marginBottom: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginTop: 0 }}>{isEdit ? "Edit Employee" : "Add New Employee (Permanent Save)"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <input placeholder="Employee ID (e.g. EMP001)" value={form.empId} onChange={e => setForm({ ...form, empId: e.target.value })} style={inputStyle} />
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input placeholder="Email ID" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input placeholder="Contact Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            <select value={form.dept} onChange={e => setForm({ ...form, dept: e.target.value })} style={inputStyle}>
              <option>HR</option><option>IT</option><option>Sales</option><option>Finance</option><option>Marketing</option>
            </select>
            <input placeholder="Company" value={form.comp} onChange={e => setForm({ ...form, comp: e.target.value })} style={inputStyle} />
            <input placeholder="Salary" type="number" value={form.sal} onChange={e => setForm({ ...form, sal: e.target.value })} style={inputStyle} />
            <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} style={{...inputStyle, gridColumn:"span 2"}} />
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: "13px", fontWeight: "bold" }}>Employee Photo:</label>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ ...inputStyle, marginTop: "5px" }} />
            </div>
          </div>
          {form.photo && <img src={form.photo} style={{ width: "90px", height: "90px", borderRadius: "50%", marginTop: "12px", objectFit: "cover", border: "3px solid #3b82f6" }} />}
          <div style={{ marginTop: "15px" }}>
            <button onClick={handleSubmit} style={btnPrimary}>{isEdit ? "Update (Permanent)" : "+ Add & Save Permanently"}</button>
            {isEdit && <button onClick={() => { setForm({ id: "", empId: "", name: "", email: "", phone: "", dept: "HR", comp: "TCS", sal: "", address: "", photo: "" }); setIsEdit(false); }} style={btnCancel}>Cancel</button>}
          </div>
          <p style={{ fontSize: "12px", color: "green", marginTop: "10px" }}>✓ Data browser me permanent save hoga. Refresh karne par bhi delete nahi hoga. Sirf Delete button se delete hoga.</p>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: "16px", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
            <thead style={{ background: "#f8fafc", textAlign: "left", fontSize: "13px", color: "#64748b" }}><tr><th style={thStyle}>Photo</th><th style={thStyle}>Emp ID</th><th style={thStyle}>Name & Contact</th><th style={thStyle}>Email</th><th style={thStyle}>Address</th><th style={thStyle}>Salary</th><th style={thStyle}>Action</th></tr></thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={tdStyle}>{emp.photo ? <img src={emp.photo} style={{ width: "45px", height: "45px", borderRadius: "50%", objectFit: "cover" }} /> : <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>👤</div>}</td>
                  <td style={tdStyle}><b>{emp.empId}</b><div style={{ fontSize: "11px", color: "#64748b" }}>{emp.dept} | {emp.comp}</div></td>
                  <td style={tdStyle}>{emp.name}<div style={{ fontSize: "12px", color: "#64748b" }}>{emp.phone}</div></td>
                  <td style={tdStyle}><span style={{ fontSize: "13px" }}>{emp.email}</span></td>
                  <td style={{ ...tdStyle, maxWidth: "150px", fontSize: "12px" }}>{emp.address || "—"}</td>
                  <td style={tdStyle}>₹{emp.sal}</td>
                  <td style={tdStyle}><button onClick={() => editEmp(emp)} style={editBtn}>Edit</button><button onClick={() => removeEmp(emp.id)} style={delBtn}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: "30px", textAlign: "center", color: "gray" }}>No data. Add employee upar se.</div>}
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: "12px", border: "1px solid #cbd5e1", borderRadius: "8px", outline: "none" };
const thStyle = { padding: "12px" };
const tdStyle = { padding: "12px", fontSize: "14px" };
const btnPrimary = { background: "#2563eb", color: "white", padding: "12px 24px", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" };
const btnCancel = { marginLeft: "10px", padding: "12px 18px", borderRadius: "8px", border: "1px solid #cbd5e1", background: "white", cursor: "pointer" };
const editBtn = { color: "#2563eb", background: "none", border: "none", cursor: "pointer", marginRight: "10px", fontWeight: "bold" };
const delBtn = { color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: "bold" };