"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

// This is the Login page
// It sends email and password to Go backend
// and redirects user based on their role
export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin() {
    // Send login request to Go backend
    const res = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      setError("Wrong email or password")
      return
    }

    // Save token and role in browser so we stay logged in
    localStorage.setItem("token", data.token)
    localStorage.setItem("role", data.role)
    localStorage.setItem("name", data.name)

    // Send user to correct page based on role
    if (data.role === "master_admin") router.push("/master")
    else if (data.role === "domain_admin") router.push("/admin")
    else router.push("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-900">
          Student Portal Login
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

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
          onClick={handleLogin}
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          No account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}
