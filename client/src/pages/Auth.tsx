import { useState } from 'react'
import api from '../api/api.ts'

export default function AuthPage({ onLogin }: { onLogin: () => void }) {
    const [isRegister, setIsRegister] = useState(false)
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (
            !email.trim() ||
            !password.trim() ||
            (isRegister && !fullName.trim())
        ) {
            setError('Пожалуйста заполните корректно поля')
            return
        }
        try {
            if (isRegister) {
                const res = await api.post('/auth/register', {
                    fullName,
                    email,
                    password,
                })
                localStorage.setItem('token', res.data.token)
            } else {
                // Логин
                const res = await api.post('/auth/login', { email, password })
                localStorage.setItem('token', res.data.token)
            }
            onLogin()
        } catch (err: any) {
            setError(err.response?.data?.message || 'Action failed')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow w-full max-w-sm space-y-4">
                <h1 className="text-xl font-bold text-center">
                    {isRegister ? 'Register' : 'Login'}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <input
                            type="text"
                            placeholder="Имя"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full border p-2 rounded-md"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="email@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded-md"
                    />
                    <input
                        type="password"
                        placeholder="пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border p-2 rounded-md"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 cursor-pointer"
                    >
                        {isRegister ? 'Зарегистрироваться' : 'Войти'}
                    </button>
                </form>
                <p className="text-center text-sm">
                    {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    >
                        {isRegister ? 'Войти' : 'Регистрация'}
                    </button>
                </p>
            </div>
        </div>
    )
}
