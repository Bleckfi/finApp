import axios from 'axios'
import { useEffect, useState } from 'react'

type Budget = {
    id: string
    category: { name: string }
    planned: number
    spent: number
    month: number
    year: number
}

export default function BudgetPage() {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [newBudget, setNewBudget] = useState({
        categoryName: '',
        planned: 0,
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
    })

    const fetchBudgets = async () => {
        try {
            const res = await axios.get('/api/budget-plan')
            const budgetsArray = Array.isArray(res.data) ? res.data : []
            setBudgets(budgetsArray)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchBudgets()
    }, [])

    const addBudget = async () => {
        if (!newBudget.categoryName || newBudget.planned <= 0) return

        try {
            await axios.post('/api/budget-plan', newBudget)
            setNewBudget({ ...newBudget, categoryName: '', planned: 0 })
            fetchBudgets()
        } catch (err) {
            console.error(err)
        }
    }

    const deleteBudget = async (id: string) => {
        try {
            await axios.delete(`/api/budget-plan/${id}`)
            fetchBudgets()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Budget Planning</h1>

            {/* Форма добавления */}
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    placeholder="Category"
                    value={newBudget.categoryName}
                    onChange={(e) =>
                        setNewBudget({
                            ...newBudget,
                            categoryName: e.target.value,
                        })
                    }
                    className="border border-gray-300 rounded px-3 py-2 shadow-sm flex-1"
                />
                <input
                    type="number"
                    placeholder="Planned"
                    value={newBudget.planned}
                    onChange={(e) =>
                        setNewBudget({
                            ...newBudget,
                            planned: Number(e.target.value),
                        })
                    }
                    className="border border-gray-300 rounded px-3 py-2 shadow-sm w-32"
                />
                <button
                    onClick={addBudget}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add
                </button>
            </div>

            {/* Список бюджетов */}
            <div className="space-y-4">
                {budgets.map((b) => {
                    const percent = Math.round((b.spent / b.planned) * 100)
                    return (
                        <div
                            key={b.id}
                            className="bg-white p-4 rounded-2xl shadow space-y-2"
                        >
                            <div className="flex justify-between">
                                <span>{b.category.name}</span>
                                <span>
                                    ₽{b.spent} / ₽{b.planned}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 h-2 rounded">
                                <div
                                    className="h-2 rounded bg-blue-500"
                                    style={{ width: `${percent}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500">
                                {percent}% used
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => deleteBudget(b.id)}
                                    className="text-red-500"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
