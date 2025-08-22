import { useEffect, useState } from 'react'
import type { MonthData, Transaction } from '../types/types.ts'

export const useTransactions = () => {
    const [data, setData] = useState<Record<number, MonthData>>({})
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

    // Загрузка всех транзакций с сервера при монтировании
    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            const res = await fetch('http://localhost:3000/transactions', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const transactions: Transaction[] = await res.json()

            const grouped: Record<number, MonthData> = {}
            for (let i = 0; i < 12; i++)
                grouped[i] = { income: [], expense: [] }

            transactions.forEach((t) => {
                const month = new Date(t.date).getMonth()
                if (t.category?.type === 'income') grouped[month].income.push(t)
                else grouped[month].expense.push(t)
            })

            setData(grouped)
        }

        fetchTransactions()
    }, [])

    // Добавление новой транзакции на сервер и локально
    const addTransaction = async (transaction: Transaction) => {
        const token = localStorage.getItem('token')
        if (!token) return

        const body = {
            ...transaction,
            amount: Number(transaction.amount),
            date: transaction.date
                ? new Date(transaction.date).toISOString()
                : new Date().toISOString(),
        }

        try {
            const res = await fetch('http://localhost:3000/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            })

            if (!res.ok) throw new Error('Failed to add transaction')

            const newTransaction: Transaction = await res.json()

            // Иммутабельное обновление state
            setData((prev) => {
                const month = new Date(newTransaction.date).getMonth()
                const prevMonth = prev[month] || { income: [], expense: [] }

                return {
                    ...prev,
                    [month]: {
                        income:
                            newTransaction.type === 'income'
                                ? [newTransaction, ...prevMonth.income]
                                : [...prevMonth.income],
                        expense:
                            newTransaction.type === 'expense'
                                ? [newTransaction, ...prevMonth.expense]
                                : [...prevMonth.expense],
                    },
                }
            })
        } catch (err) {
            console.error(err)
        }
    }

    return { data, selectedMonth, setSelectedMonth, addTransaction }
}
