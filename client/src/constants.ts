import type { Category, MonthData } from './types/types.ts'

export const months = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    // ... остальные месяцы
]

export const categories: Category[] = [
    { name: 'Food', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    // ... остальные категории
]

export const initialData: Record<number, MonthData> = {
    0: {
        income: [
            { name: 'Salary', value: 30000, type: 'income' },
            // ... остальные данные
        ],
        expense: [
            { name: 'Food', value: 6000, type: 'expense' },
            // ... остальные данные
        ],
    },
    // ... остальные месяцы
}
