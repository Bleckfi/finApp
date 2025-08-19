import { useState, useEffect } from 'react'
import type { Transaction } from '../types/types.ts'

export const TransactionForm = ({
    onSubmit,
}: {
    onSubmit: (transaction: Transaction) => void
}) => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchCategories() {
            const token = localStorage.getItem('token')
            if (!token) {
                setError('User is not authenticated')
                setLoading(false)
                return
            }

            try {
                const res = await fetch('http://localhost:3000/categories', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                })
                if (!res.ok) throw new Error('Failed to fetch categories')
                const data = await res.json()
                setCategories(data)
            } catch (e: any) {
                setError(e.message)
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const [transaction, setTransaction] = useState<{
        type: 'income' | 'expense'
        amount: string
        categoryId: string
    }>({
        type: 'expense',
        amount: '',
        categoryId: '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!transaction.amount || !transaction.categoryId) return

        const amount = parseFloat(transaction.amount)
        if (isNaN(amount)) return

        const category = categories.find((c) => c.id === transaction.categoryId)
        if (!category) return

        onSubmit({
            amount, // оставляем как есть
            type: category.type,
            categoryId: transaction.categoryId,
            date: new Date(),
            name: category.name,
        })

        setTransaction({ type: 'expense', amount: '', categoryId: '' })
    }

    return (
        <form onSubmit={handleSubmit} className="flex space-x-4">
            <select
                value={transaction.type}
                onChange={(e) =>
                    setTransaction((prev) => ({
                        ...prev,
                        type: e.target.value as 'income' | 'expense',
                    }))
                }
                className="border border-gray-300 rounded px-3 py-2 shadow-sm"
            >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
            </select>

            {loading ? (
                <p className="text-gray-500 px-3 py-2">Loading...</p>
            ) : error ? (
                <p className="text-red-500 px-3 py-2">{error}</p>
            ) : (
                <select
                    value={transaction.categoryId}
                    onChange={(e) =>
                        setTransaction((prev) => ({
                            ...prev,
                            categoryId: e.target.value,
                        }))
                    }
                    className="border border-gray-300 rounded px-3 py-2 shadow-sm"
                >
                    <option value="">Select category</option>
                    {categories
                        .filter((cat) => cat.type === transaction.type)
                        .map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                </select>
            )}

            <input
                type="number"
                placeholder="Amount"
                value={transaction.amount}
                onChange={(e) =>
                    setTransaction((prev) => ({
                        ...prev,
                        amount: e.target.value,
                    }))
                }
                className="border border-gray-300 rounded px-3 py-2 shadow-sm"
            />

            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Add
            </button>
        </form>
    )
}
