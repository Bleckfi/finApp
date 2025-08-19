import { useEffect, useState } from 'react'
import type { Category } from '../types/types.ts'

export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            const res = await fetch('http://localhost:3000/categories', {
                headers: {
                    Authorization: `Bearer ${token}`, // передаем токен
                },
            })

            if (!res.ok) return // обработка ошибок
            const data = await res.json()
            setCategories(data)
        }

        fetchCategories()
    }, [])

    return categories
}
