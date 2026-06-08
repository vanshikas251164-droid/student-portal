"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [records, setRecords] = useState([])
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem("role")
    const adminName = localStorage.getItem("name")
    if (role !== "domain_admin") { router.push("/login"); return }
    setName(adminName)
    fetchRecords()
  }, [])

  async function fetchRecords() {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/admin/records", {
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    setRecords(data || [])
  }

  async function handleUpdate(recordId, status, remarks) {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/admin/records/" + recordId + "/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ status, remarks })
    })
    if (res.ok) {
      setMessage("Record " + status + " successfully!")
      fetchRecords()
    } else {
      setMessage("Error updating record")
    }
  }

  function handleLogout() { localStorage.clear(); router.push("/login") }

  function statusColor(status) {
    if (status === "approved") return "text-green-600 bg-green-100"
    if (status === "rejected") return "text-red-600 bg-red-100"
    return "text-yellow-600 bg-yellow-100"
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">Domain Admin Panel</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {name}</span>
          <button onClick={handleLogout} className="bg-white text-blue-900 px-3 py-1 rounded text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Verification Requests</h2>
          {message && <p className="text-green-600 mb-4">{message}</p>}
          {records.length === 0 ? (
            <p className="text-gray-500">No requests yet!</p>
          ) : (
            records.map((record, i) => (
              <div key={i} className="border rounded p-4 mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold">{record.title}</h3>
                    <p className="text-sm text-gray-500">{"Student: " + record.student_name + " | " + record.date}</p>
                    <p className="text-sm mt-1">{record.description}</p>
                    {record.proof_link && (
                      <a href={record.proof_link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm">
                        View Proof
                      </a>
                    )}
                  </div>
                  <span className={"text-xs px-2 py-1 rounded-full font-medium " + statusColor(record.status)}>
                    {record.status}
                  </span>
                </div>
                {record.status === "pending" && (
                  <RemarkBox
                    onApprove={(remarks) => handleUpdate(record.id, "approved", remarks)}
                    onReject={(remarks) => handleUpdate(record.id, "rejected", remarks)}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function RemarkBox({ onApprove, onReject }) {
  const [remarks, setRemarks] = useState("")
  return (
    <div className="mt-2">
      <input
        type="text"
        placeholder="Add remarks (optional)"
        className="border p-2 rounded w-full mb-2 text-sm"
        value={remarks}
        onChange={e => setRemarks(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={() => onApprove(remarks)} className="bg-green-600 text-white px-4 py-1 rounded text-sm">Approve</button>
        <button onClick={() => onReject(remarks)} className="bg-red-600 text-white px-4 py-1 rounded text-sm">Reject</button>
      </div>
    </div>
  )
}