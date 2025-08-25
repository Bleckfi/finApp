import { useEffect, useState } from 'react'
import type { MonthData, Transaction } from '../types/types.ts'
import type { Category } from 'prisma-client-18e4db9eb2d1dde5a57d2b5befb6b0caf5dc7687c3f66acde26a3d3fef74da47'

export const useTransactions = () => {
    const [data, setData] = useState<Record<number, MonthData>>({})
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
    const [categories, setCategories] = useState<Category[]>([])

    // Загрузка категорий с сервера
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const res = await fetch('http://localhost:3000/categories', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) throw new Error('Failed to fetch categories')
                const cats: Category[] = await res.json()
                setCategories(cats)
            } catch (err) {
                console.error(err)
            }
        }

        fetchCategories()
    }, [])

    // Загрузка транзакций с сервера
    useEffect(() => {
        const fetchTransactions = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const res = await fetch('http://localhost:3000/transactions', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                if (!res.ok) throw new Error('Failed to fetch transactions')
                const transactions: Transaction[] = await res.json()

                const grouped: Record<number, MonthData> = {}
                for (let i = 0; i < 12; i++)
                    grouped[i] = { income: [], expense: [] }

                transactions.forEach((t) => {
                    const month = new Date(t.date).getMonth()
                    const category = categories.find(
                        (c) => c.id === t.categoryId
                    )
                    const tWithCategory = { ...t, category }

                    if (category?.type === 'income')
                        grouped[month].income.push(tWithCategory)
                    else grouped[month].expense.push(tWithCategory)
                })

                setData(grouped)
            } catch (err) {
                console.error(err)
            }
        }

        if (categories.length > 0) fetchTransactions() // ждем, пока категории загрузятся
    }, [categories])

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
            const category = categories.find(
                (c) => c.id === newTransaction.categoryId
            )
            const newTransactionWithCategory = { ...newTransaction, category }

            const month = new Date(newTransactionWithCategory.date).getMonth()
            const isIncome = category?.type === 'income'
            const prevMonth = data[month] || { income: [], expense: [] }

            setData((prev) => ({
                ...prev,
                [month]: {
                    income: isIncome
                        ? [newTransactionWithCategory, ...prevMonth.income]
                        : [...prevMonth.income],
                    expense: !isIncome
                        ? [newTransactionWithCategory, ...prevMonth.expense]
                        : [...prevMonth.expense],
                },
            }))
        } catch (err) {
            console.error(err)
        }
    }

    return { data, selectedMonth, setSelectedMonth, addTransaction, categories }
}
