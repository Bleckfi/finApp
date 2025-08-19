import { jwtDecode } from 'jwt-decode'

interface TokenPayload {
    sub: number
    email: string
    fullName: string
    iat?: number
    exp?: number
}

export function getCurrentUser() {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
        const decoded = jwtDecode<TokenPayload>(token)
        return decoded
    } catch {
        return null
    }
}
