"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

// This is the Signup page
// Only students sign up here
// Domain admins are created by master admin
export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSignup() {
    // Send signup request to Go backend
    const res = await fetch("http://localhost:8080/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError("Email already exists or something went wrong")
      return
    }

    // After signup, go to login page
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Create Student Account
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 rounded mb-3"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
        >
          Sign Up
        </button>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}
