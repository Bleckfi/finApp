import axios from 'axios'
import { useEffect, useState } from 'react'
import { useCurrency } from '../hooks/useCurrency'

type Budget = {
    id: string
    name: string
    target: number
    current: number
    createdAt: string
    updatedAt: string
}

export default function BudgetPage() {
    const url = 'http://localhost:3000'
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [newBudget, setNewBudget] = useState({ name: '', target: 0 })
    const [addAmountValue, setAddAmountValue] = useState<
        Record<string, number>
    >({})
    const { convert, symbol } = useCurrency()
    const token = localStorage.getItem('token')

    const fetchBudgets = async () => {
        try {
            const res = await axios.get(`${url}/budget-plan`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const budgetsArray: Budget[] = Array.isArray(res.data)
                ? res.data.map((b: any) => ({
                      ...b,
                      target: Number(b.target),
                      current: Number(b.current),
                  }))
                : []
            setBudgets(budgetsArray)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchBudgets()
    }, [])

    const addBudget = async () => {
        if (!newBudget.name || newBudget.target <= 0) return
        try {
            await axios.post(
                `${url}/budget-plan`,
                { name: newBudget.name, target: newBudget.target },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setNewBudget({ name: '', target: 0 })
            fetchBudgets()
        } catch (err) {
            console.error(err)
        }
    }

    const addAmount = async (id: string) => {
        const amount = addAmountValue[id]
        if (!amount || amount <= 0) return
        try {
            await axios.put(
                `${url}/budget-plan/${id}/add`,
                { amount },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            setAddAmountValue((prev) => ({ ...prev, [id]: 0 }))
            fetchBudgets()
        } catch (err) {
            console.error(err)
        }
    }

    const deleteBudget = async (id: string) => {
        try {
            await axios.delete(`${url}/budget-plan/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchBudgets()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Планирование бюджета</h1>

            {/* Форма добавления новой цели */}
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Название"
                    value={newBudget.name}
                    onChange={(e) =>
                        setNewBudget({ ...newBudget, name: e.target.value })
                    }
                    className="border border-gray-300 rounded px-3 py-2 shadow-sm flex-1"
                />
                <input
                    type="number"
                    placeholder="Цель"
                    value={newBudget.target}
                    onChange={(e) =>
                        setNewBudget({
                            ...newBudget,
                            target: Number(e.target.value),
                        })
                    }
                    className="border border-gray-300 rounded px-3 py-2 shadow-sm w-32"
                />
                <button
                    onClick={addBudget}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Добавить
                </button>
            </div>

            {/* Список целей */}
            <div className="space-y-4">
                {budgets.map((b) => {
                    const percent = Math.round((b.current / b.target) * 100)
                    return (
                        <div
                            key={b.id}
                            className="bg-white p-4 rounded-2xl shadow space-y-2"
                        >
                            <div className="flex justify-between">
                                <span>{b.name}</span>
                                <span>
                                    {symbol}
                                    {convert(b.current).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}{' '}
                                    / {symbol}
                                    {convert(b.target).toLocaleString(
                                        undefined,
                                        {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        }
                                    )}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded">
                                <div
                                    className="h-2 rounded bg-blue-500"
                                    style={{
                                        width: `${Math.min(percent, 100)}%`,
                                    }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500">
                                {percent}% заполнено
                            </p>

                            <div className="flex gap-2 items-center">
                                <input
                                    type="number"
                                    placeholder="добавить сумму"
                                    value={addAmountValue[b.id] || 0}
                                    onChange={(e) =>
                                        setAddAmountValue((prev) => ({
                                            ...prev,
                                            [b.id]: Number(e.target.value),
                                        }))
                                    }
                                    className="border border-gray-300 rounded px-3 py-1 shadow-sm w-32"
                                />
                                <button
                                    onClick={() => addAmount(b.id)}
                                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                >
                                    Добавить
                                </button>
                                <button
                                    onClick={() => deleteBudget(b.id)}
                                    className="text-red-500 px-2 py-1"
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
