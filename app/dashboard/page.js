"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const [records, setRecords] = useState([])
  const [name, setName] = useState("")
  const [title, setTitle] = useState("")
  const [domainId, setDomainId] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [proofLink, setProofLink] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const domains = [
    { id: 1, name: "GnS" },
    { id: 2, name: "AnC" },
    { id: 3, name: "SnT" },
    { id: 4, name: "MnC" }
  ]

  useEffect(() => {
    const role = localStorage.getItem("role")
    const studentName = localStorage.getItem("name")
    if (!role) { router.push("/login"); return }
    setName(studentName)
    fetchRecords()
  }, [])

  async function fetchRecords() {
    const token = localStorage.getItem("token")
    const res = await fetch("http://localhost:8080/api/student/records", {
      headers: { Authorization: "Bearer " + token }
    })
    const data = await res.json()
    setRecords(data || [])
  }

  async function handleSubmit() {
    const token = localStorage.getItem("token")

    // date is already in YYYY-MM-DD format from input type=date
    const body = {
      title,
      domain_id: parseInt(domainId),
      description,
      proof_link: proofLink
    }

    // only add date if it's filled
    if (date) {
      body.date = date
    }

    const res = await fetch("http://localhost:8080/api/student/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify(body)
    })

    if (res.ok) {
      setMessage("Record submitted successfully!")
      setTitle("")
      setDomainId("")
      setDescription("")
      setDate("")
      setProofLink("")
      fetchRecords()
    } else {
      const err = await res.text()
      setMessage("Error: " + err)
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
        <h1 className="text-xl font-bold">Student Portal</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {name}</span>
          <button onClick={handleLogout} className="bg-white text-blue-900 px-3 py-1 rounded text-sm">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">Submit New Record</h2>
          {message && <p className="text-green-600 mb-3">{message}</p>}

          <input
            type="text"
            placeholder="Title (e.g. Won coding competition)"
            className="w-full border p-2 rounded mb-3"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <select
            className="w-full border p-2 rounded mb-3"
            value={domainId}
            onChange={e => setDomainId(e.target.value)}
          >
            <option value="">Select Domain</option>
            {domains.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <textarea
            placeholder="Description"
            className="w-full border p-2 rounded mb-3"
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <input
            type="date"
            className="w-full border p-2 rounded mb-3"
            value={date}
            onChange={e => setDate(e.target.value)}
          />

          <input
            type="url"
            placeholder="Proof Link (optional)"
            className="w-full border p-2 rounded mb-4"
            value={proofLink}
            onChange={e => setProofLink(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800"
          >
            Submit Record
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-900">My Records</h2>
          {records.length === 0 ? (
            <p className="text-gray-500">No records yet. Submit one above!</p>
          ) : (
            records.map((record, i) => (
              <div key={i} className="border rounded p-4 mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{record.title}</h3>
                    <p className="text-sm text-gray-500">{record.domain} | {record.date}</p>
                    <p className="text-sm mt-1">{record.description}</p>
                    {record.remarks && (
                      <p className="text-sm text-gray-600 mt-1">Remarks: {record.remarks}</p>
                    )}
                  </div>
                  <span className={"text-xs px-2 py-1 rounded-full font-medium " + statusColor(record.status)}>
                    {record.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
