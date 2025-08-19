export type Transaction = {
    id?: number
    name: string
    amount: number
    type: 'income' | 'expense'
    date?: string
    category?: { name: string; type: 'income' | 'expense' }
}

export type MonthData = {
    income: Transaction[]
    expense: Transaction[]
}

// данные для диаграммы
export type ChartItem = {
    name: string
    value: number
}
