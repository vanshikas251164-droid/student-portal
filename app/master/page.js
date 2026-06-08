"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MasterDashboard() {
  const [students, setStudents] = useState([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminDomainId, setAdminDomainId] = useState("")
  const router = useRouter()

  const domains = [
    { id: 1, name: "GnS" },
    { id: 2, name: "AnC" },
    { id: 3, name: "SnT" },
    { id: 4, name: "MnC" }
  ]

  useEffect(() => {
    const role = localStorage.getItem("role")
    const masterName = localStorage.getItem("name")
    if (role !== "master_admin") { router.push("/login"); return }
    setName(masterName)
    fetchStudents()
  }, [])

  async function fetchStudents() {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/master/students", {
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    setStudents(data || [])
  }

  async function handleCreateAdmin() {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/master/create-admin", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ name: adminName, email: adminEmail, password: adminPassword, domain_id: parseInt(adminDomainId) })
    })
    if (res.ok) {
      setMessage("Domain admin created!")
      setShowCreateAdmin(false)
    } else {
      setMessage("Error creating admin")
    }
  }

  async function handleGeneratePDF(studentId, studentName) {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/master/student/" + studentId + "/pdf", {
      headers: { Authorization: "Bearer " + token }
    })
    if (res.ok) {
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = studentName + "-report.pdf"
      a.click()
    }
  }

  function handleLogout() { localStorage.clear(); router.push("/login") }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">Master Admin Panel</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {name}</span>
          <button onClick={handleLogout} className="bg-white text-blue-900 px-3 py-1 rounded text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        {message && <p className="text-green-600 mb-4 bg-white p-3 rounded shadow">{message}</p>}

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-blue-900">Domain Admins</h2>
            <button onClick={() => setShowCreateAdmin(!showCreateAdmin)} className="bg-blue-900 text-white px-4 py-2 rounded text-sm">
              + Create Domain Admin
            </button>
          </div>

          {showCreateAdmin && (
            <div className="border rounded p-4 mt-3">
              <h3 className="font-bold mb-3">New Domain Admin</h3>
              <input type="text" placeholder="Full Name" className="w-full border p-2 rounded mb-3" value={adminName} onChange={e => setAdminName(e.target.value)} />
              <input type="email" placeholder="Email" className="w-full border p-2 rounded mb-3" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full border p-2 rounded mb-3" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
              <select className="w-full border p-2 rounded mb-4" value={adminDomainId} onChange={e => setAdminDomainId(e.target.value)}>
                <option value="">Select Domain</option>
                {domains.map(d => (<option key={d.id} value={d.id}>{d.name}</option>))}
              </select>
              <button onClick={handleCreateAdmin} className="bg-blue-900 text-white px-6 py-2 rounded">Create Admin</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">All Students</h2>
          {students.length === 0 ? (
            <p className="text-gray-500">No students yet!</p>
          ) : (
            students.map((student, i) => (
              <div key={i} className="border rounded p-4 mb-3 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <div className="flex gap-2">
                  <a href={"/student/" + student.id + "/card"} target="_blank" rel="noreferrer" className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">View Card</a>
                  <button onClick={() => handleGeneratePDF(student.id, student.name)} className="bg-blue-900 text-white px-3 py-1 rounded text-sm">Download PDF</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
