"use client"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"

export default function StudentCard() {
  const [student, setStudent] = useState("")
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const params = useParams()

  useEffect(() => {
    fetchCard()
  }, [])

  async function fetchCard() {
    const res = await fetch("http://localhost:8080/api/student/" + params.id + "/card")
    const data = await res.json()
    setStudent(data.student)
    setRecords(data.records || [])
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-blue-900 text-white rounded-t-lg p-6">
          <h1 className="text-2xl font-bold">{student}</h1>
          <p className="text-blue-200 mt-1">Verified Student Profile</p>
          <p className="text-blue-200 text-sm">IIT Kanpur Student Portal</p>
        </div>

        <div className="bg-white rounded-b-lg shadow p-6">
          <h2 className="text-lg font-bold mb-4 text-blue-900">✓ Verified Records</h2>

          {records.length === 0 ? (
            <p className="text-gray-500">No verified records yet.</p>
          ) : (
            records.map((record, i) => (
              <div key={i} className="border-l-4 border-green-500 pl-4 mb-4">
                <div className="flex justify-between">
                  <h3 className="font-bold">{record.title}</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {record.domain}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{record.date}</p>
                <p className="text-sm mt-1">{record.description}</p>
                {record.proof_link && (
                  <a href={record.proof_link} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                    View Proof
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          Officially verified profile from IIT Kanpur Student Portal
        </p>
      </div>
    </div>
  )
}
