import { useEffect, useState } from 'react'
import { useCurrency, symbols } from '../hooks/useCurrency.ts'

type Transaction = {
    id: string
    amount: number
    date: string
    category?: { name: string; type: 'income' | 'expense' }
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const { currency, convert } = useCurrency()

    // Получение транзакций с сортировкой по убыванию даты
    const fetchTransactions = async () => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
            const res = await fetch('http://localhost:3000/transactions', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data: Transaction[] = await res.json()

            const sorted = data.sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            setTransactions(sorted)
        } catch (err) {
            console.error('Failed to fetch transactions', err)
        }
    }

    useEffect(() => {
        fetchTransactions()
    }, [])

    // Удаление транзакции
    const deleteTransaction = async (id: string) => {
        const token = localStorage.getItem('token')
        if (!token) return

        try {
            const res = await fetch(
                `http://localhost:3000/transactions/${id}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            if (!res.ok) throw new Error('Failed to delete transaction')

            setTransactions((prev) => prev.filter((tx) => tx.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Транзакции</h1>
            <div className="bg-white rounded-2xl shadow overflow-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                        <tr>
                            <th className="text-left px-4 py-2">
                                Дата и время
                            </th>
                            <th className="text-left px-4 py-2">Категория</th>
                            <th className="text-left px-4 py-2">Сумма</th>
                            <th className="text-left px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((tx) => {
                            const date = new Date(tx.date)
                            const formattedDate = `${date
                                .getDate()
                                .toString()
                                .padStart(2, '0')}.${(date.getMonth() + 1)
                                .toString()
                                .padStart(2, '0')}.${date.getFullYear()} ${date
                                .getHours()
                                .toString()
                                .padStart(2, '0')}:${date
                                .getMinutes()
                                .toString()
                                .padStart(2, '0')}:${date
                                .getSeconds()
                                .toString()
                                .padStart(2, '0')}`

                            return (
                                <tr
                                    key={tx.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2">
                                        {formattedDate}
                                    </td>
                                    <td className="px-4 py-2">
                                        {tx.category?.name || 'Uncategorized'}
                                    </td>
                                    <td
                                        className={`px-4 py-2 ${
                                            tx.category?.type === 'expense'
                                                ? 'text-red-500'
                                                : 'text-green-500'
                                        }`}
                                    >
                                        {tx.category?.type === 'expense'
                                            ? '-'
                                            : '+'}
                                        {convert(Math.abs(tx.amount)).toFixed(
                                            2
                                        )}
                                        {symbols[currency]}
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            className="text-red-500 hover:underline"
                                            onClick={() =>
                                                deleteTransaction(tx.id)
                                            }
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
