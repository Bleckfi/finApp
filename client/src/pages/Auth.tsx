import { useState } from 'react'
import api from '../api/api.ts'

export default function AuthPage({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        try {
            const res = await api.post('/auth/login', { email, password })
            localStorage.setItem('token', res.data.token)
            onLogin()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">
                <h1 className="text-xl font-bold text-center">
                    Login to Finance Tracker
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded-md"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 rounded-md"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}
