import { useState, useEffect } from 'react'
import axios from 'axios'

type Category = {
    id: string
    name: string
    type: 'income' | 'expense'
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [newCategory, setNewCategory] = useState({
        name: '',
        type: 'expense' as 'income' | 'expense',
    })

    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token')
            if (!token) return

            try {
                const response = await axios.get(
                    'http://localhost:3000/categories',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                setCategories(response.data)
            } catch (error) {
                console.error('Failed to fetch categories', error)
            }
        }

        fetchCategories()
    }, [])

    const handleAdd = async () => {
        if (newCategory.name.trim() === '') return

        const token = localStorage.getItem('token')
        if (!token) {
            alert('You must be logged in')
            return
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/categories',
                {
                    name: newCategory.name,
                    type: newCategory.type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            setCategories([...categories, response.data])
            setNewCategory({ name: '', type: 'expense' })
        } catch (error) {
            console.error('Error adding category', error)
        }
    }

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token')
        if (!token) {
            alert('You must be logged in')
            return
        }

        try {
            await axios.delete(`http://localhost:3000/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setCategories(categories.filter((c) => c.id !== id))
        } catch (error) {
            console.error('Error deleting category', error)
        }
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Categories</h2>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Category name"
                    className="border px-3 py-2 mr-2 rounded w-1/2"
                    value={newCategory.name}
                    onChange={(e) =>
                        setNewCategory({ ...newCategory, name: e.target.value })
                    }
                />

                <select
                    className="border px-3 py-2 mr-2 rounded"
                    value={newCategory.type}
                    onChange={(e) =>
                        setNewCategory({
                            ...newCategory,
                            type: e.target.value as 'income' | 'expense',
                        })
                    }
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Add
                </button>
            </div>

            <ul>
                {categories.map((category) => (
                    <li
                        key={category.id}
                        className="flex justify-between items-center border-b py-2"
                    >
                        <div>
                            <span className="font-medium">{category.name}</span>{' '}
                            <span className="text-sm text-gray-500">
                                ({category.type})
                            </span>
                        </div>
                        <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:underline"
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
