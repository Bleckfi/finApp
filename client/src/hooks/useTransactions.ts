import { useState, useEffect } from 'react'
import type { MonthData, Transaction } from '../types/types.ts'

export const useTransactions = () => {
    const [data, setData] = useState<Record<number, MonthData>>({})
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            const res = await fetch('http://localhost:3000/transactions', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const transactions: Transaction[] = await res.json()

            const grouped: Record<number, MonthData> = {}
            transactions.forEach((t) => {
                const month = new Date(t.date).getMonth()
                if (!grouped[month])
                    grouped[month] = { income: [], expense: [] }

                if (t.type === 'income') grouped[month].income.push(t)
                else grouped[month].expense.push(t)
            })

            setData(grouped)
        }

        fetchTransactions()
    }, [])

    const addTransaction = async (transaction: Transaction) => {
        const token = localStorage.getItem('token')
        if (!token) return

        const body = { ...transaction, amount: Number(transaction.amount) }

        const res = await fetch('http://localhost:3000/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        })

        if (!res.ok) {
            console.error('Failed to add transaction')
            return
        }

        // добавляем локально
        setData((prev) => ({
            ...prev,
            [selectedMonth]: {
                income:
                    body.type === 'income'
                        ? [...(prev[selectedMonth]?.income || []), body]
                        : prev[selectedMonth]?.income || [],
                expense:
                    body.type === 'expense'
                        ? [...(prev[selectedMonth]?.expense || []), body]
                        : prev[selectedMonth]?.expense || [],
            },
        }))
    }

    return {
        data,
        selectedMonth,
        setSelectedMonth,
        addTransaction,
    }
}
