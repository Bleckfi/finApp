import { useEffect, useState } from 'react'

type Transaction = {
    id: string
    amount: number
    date: string
    category?: { name: string; type: 'income' | 'expense' }
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    const fetchTransactions = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await fetch('http://localhost:3000/transactions', {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setTransactions(data)
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    const deleteTransaction = async (id: string) => {
        const token = localStorage.getItem('token')
        if (!token) return

        await fetch(`http://localhost:3000/transactions/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        })

        // Обновляем локальный список после удаления
        setTransactions(transactions.filter((tx) => tx.id !== id))
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Transactions</h1>
            <div className="bg-white rounded-2xl shadow overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-2">Date & Time</th>
                            <th className="text-left px-4 py-2">Category</th>
                            <th className="text-left px-4 py-2">Amount</th>
                            <th className="text-left px-4 py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => (
                            <tr
                                key={tx.id}
                                className="border-t hover:bg-gray-50"
                            >
                                <td className="px-4 py-2">
                                    {new Date(tx.date).toLocaleString('ru-RU', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                    })}
                                </td>
                                <td className="px-4 py-2">
                                    {tx.category?.name || 'Uncategorized'}
                                </td>
                                <td
                                    className={`px-4 py-2 ${
                                        tx.amount < 0
                                            ? 'text-red-500'
                                            : 'text-green-500'
                                    }`}
                                >
                                    {tx.amount > 0 ? '+' : '-'} ₽
                                    {Math.abs(tx.amount).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        className="text-red-500 hover:underline"
                                        onClick={() => deleteTransaction(tx.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="text-gray-400 text-center py-4"
                                >
                                    No transactions yet
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
