import React, { useState } from 'react'
import { BalanceCard } from './BalanceCard.tsx'
import { useTransactions } from '../hooks/useTransactions.ts'
import { TransactionForm } from './TransactionForm.tsx'
import type { Transaction } from '../types/types.ts'
import Diagram from './Diagram.tsx'
import { useCurrency, symbols } from '../hooks/useCurrency.ts'

const months = [
    { label: 'Январь', value: 0 },
    { label: 'Февраль', value: 1 },
    { label: 'Март', value: 2 },
    { label: 'Апрель', value: 3 },
    { label: 'Май', value: 4 },
    { label: 'Июнь', value: 5 },
    { label: 'Июль', value: 6 },
    { label: 'Август', value: 7 },
    { label: 'Сентябрь', value: 8 },
    { label: 'Октябрь', value: 9 },
    { label: 'Ноябрь', value: 10 },
    { label: 'Декабрь', value: 11 },
]

export default function Dashboard() {
    const { data, selectedMonth, setSelectedMonth, addTransaction } =
        useTransactions()
    const { currency, setCurrency, convert } = useCurrency()
    const [latestCategories, setLatestCategories] = useState<
        {
            id: string
            name: string
            date: string
            amount: number
            type?: string
        }[]
    >([])

    const incomeData = data[selectedMonth]?.income || []
    const expenseData = data[selectedMonth]?.expense || []

    const totalIncome = incomeData.reduce((sum, t) => sum + Number(t.amount), 0)
    const totalExpense = expenseData.reduce(
        (sum, t) => sum + Math.abs(Number(t.amount)),
        0
    )

    React.useEffect(() => {
        const incomeData = data[selectedMonth]?.income || []
        const expenseData = data[selectedMonth]?.expense || []

        const latest = [...incomeData, ...expenseData]
            .sort(
                (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 5)
            .map((t) => ({
                id: t.id,
                name: t.category?.name || t.name || 'Uncategorized',
                date: t.date,
                amount: t.amount,
                type: t.category?.type,
            }))

        setLatestCategories(latest)
    }, [data, selectedMonth])

    const handleAddTransaction = (transaction: Transaction) => {
        addTransaction(transaction)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Главная</h1>
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="border border-gray-300 rounded px-3 py-2 shadow-sm"
                >
                    <option value="BYN">BYN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="RUB">RUB</option>
                </select>
            </div>

            <BalanceCard
                income={totalIncome}
                expense={totalExpense}
                month={selectedMonth}
                year={new Date().getFullYear()}
                currencySymbol={symbols[currency]}
                convert={convert}
            />

            <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                <TransactionForm
                    onSubmit={handleAddTransaction}
                    selectedMonth={selectedMonth}
                />
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                    className="border border-gray-300 rounded px-3 py-2 shadow-sm"
                >
                    {months.map((month) => (
                        <option key={month.value} value={month.value}>
                            {month.label}
                        </option>
                    ))}
                </select>
            </div>

            <Diagram
                incomeData={incomeData.map((t) => ({
                    ...t,
                    amount: Number(t.amount),
                }))}
                expenseData={expenseData.map((t) => ({
                    ...t,
                    amount: Math.abs(Number(t.amount)),
                }))}
                currencySymbol={symbols[currency]}
            />
            <div className="bg-white rounded-2xl shadow p-4">
                <h3 className="text-lg font-semibold mb-4">
                    Последние транзакции
                </h3>
                <ul className="space-y-3">
                    {latestCategories.length > 0 ? (
                        latestCategories.map((t) => (
                            <li
                                key={t.id}
                                className="flex justify-between items-center"
                            >
                                <div className="flex flex-col">
                                    <span>{t.name}</span>
                                    <span className="text-gray-400 text-sm">
                                        {new Date(t.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <span
                                    className={
                                        t.type === 'income'
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                    }
                                >
                                    {t.type === 'income' ? '+' : '-'}
                                    {symbols[currency]}
                                    {convert(
                                        Math.abs(Number(t.amount))
                                    ).toFixed(2)}
                                </span>
                            </li>
                        ))
                    ) : (
                        <li className="text-gray-400">Нет транзакций</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
