import { BalanceCard } from './BalanceCard.tsx'
import { useTransactions } from '../hooks/useTransactions.ts'
import { useColors } from '../utils/colors.ts'
import { TransactionForm } from './TransactionForm.tsx'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useEffect, useState } from 'react'
import type { ChartItem, Transaction } from '../types/types.ts'

const months = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
]

export default function Dashboard() {
    const { data, selectedMonth, setSelectedMonth, addTransaction } =
        useTransactions()

    const incomeData = data[selectedMonth]?.income || []
    const expenseData = data[selectedMonth]?.expense || []

    const expenseColors = useColors(expenseData)
    const incomeColors = useColors(incomeData)

    // Диаграммы
    const incomeChart: ChartItem[] = incomeData.map((t) => ({
        name: t.name,
        value: Math.abs(Number(t.amount)),
    }))

    // Расходы остаются отрицательными, но диаграмма показывает положительные
    const expenseChart: ChartItem[] = expenseData.map((t) => ({
        name: t.name,
        value: Math.abs(Number(t.amount)),
    }))

    // Последние транзакции: объединяем доход и расход, сортируем по дате
    const latestTransactions = [...incomeData, ...expenseData]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)

    const handleAddTransaction = (transaction: Transaction) => {
        addTransaction(transaction)
    }

    const totalIncome = incomeData.reduce((sum, t) => sum + Number(t.amount), 0)
    const totalExpense = expenseData.reduce(
        (sum, t) => sum + Math.abs(Number(t.amount)), // обязательно берём модуль
        0
    )
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            {/* Баланс */}
            <BalanceCard
                income={totalIncome}
                expense={totalExpense} // теперь положительное число
                month={selectedMonth}
                year={new Date().getFullYear()}
            />

            {/* Форма и выбор месяца */}
            <div className="flex justify-between mb-4 flex-col md:flex-row gap-4">
                <TransactionForm onSubmit={handleAddTransaction} />

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

            {/* Диаграммы */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expenses */}
                <div className="bg-white rounded-2xl shadow p-4 h-[300px]">
                    <h3 className="text-lg font-semibold mb-2">Expenses</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={expenseChart}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {expenseChart.map((entry, index) => (
                                    <Cell
                                        key={`cell-expense-${index}`}
                                        fill={expenseColors[index]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Income */}
                <div className="bg-white rounded-2xl shadow p-4 h-[300px]">
                    <h3 className="text-lg font-semibold mb-2">Income</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={incomeChart}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {incomeChart.map((entry, index) => (
                                    <Cell
                                        key={`cell-income-${index}`}
                                        fill={incomeColors[index]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Последние транзакции */}
            <div className="bg-white rounded-2xl shadow p-4">
                <h3 className="text-lg font-semibold mb-4">
                    Latest Transactions
                </h3>
                <ul className="space-y-3">
                    {latestTransactions.map((t) => (
                        <li
                            key={t.id}
                            className="flex justify-between items-center"
                        >
                            <div className="flex flex-col">
                                <span>{t.name || 'Uncategorized'}</span>
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
                                {t.type === 'income' ? '+' : '-'} ₽
                                {Math.abs(Number(t.amount)).toLocaleString()}
                            </span>
                        </li>
                    ))}
                    {latestTransactions.length === 0 && (
                        <li className="text-gray-400">No transactions yet</li>
                    )}
                </ul>
            </div>
        </div>
    )
}
