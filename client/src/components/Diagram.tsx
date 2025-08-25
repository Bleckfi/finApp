import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { ChartItem, Transaction } from '../types/types.ts'
import { useColors } from '../utils/colors.ts'
import { useCurrency } from '../hooks/useCurrency.ts'

type DiagramProps = {
    incomeData: Transaction[]
    expenseData: Transaction[]
}

export default function Diagram({ incomeData, expenseData }: DiagramProps) {
    const { currency, convert } = useCurrency()

    function groupByCategory(transactions: Transaction[]): ChartItem[] {
        const map: Record<string, number> = {}
        transactions.forEach((t) => {
            const name = t.category?.name || 'Uncategorized'
            const amount = Math.abs(Number(t.amount))
            map[name] = (map[name] || 0) + amount // суммируем в исходной валюте
        })
        // конвертируем только в конце
        return Object.entries(map).map(([name, value]) => ({
            name,
            value: convert(value),
        }))
    }

    const incomeChart: ChartItem[] = groupByCategory(incomeData)
    const incomeColors = useColors(incomeChart)
    const expenseChart: ChartItem[] = groupByCategory(expenseData)
    const expenseColors = useColors(expenseChart)

    const formatLabel = (value: number) => `${value.toFixed(2)}${currency}`

    const renderPie = (chart: ChartItem[], colors: Record<string, string>) => {
        if (chart.length === 0) {
            return (
                <div className="flex items-center justify-center h-full text-gray-400">
                    Нет данных на данный месяц
                </div>
            )
        }

        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chart}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) =>
                            `${name}: ${formatLabel(value)}`
                        }
                    >
                        {chart.map((entry) => (
                            <Cell key={entry.name} fill={colors[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => formatLabel(value)}
                    />
                </PieChart>
            </ResponsiveContainer>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Expenses */}
            <div className="bg-white rounded-2xl shadow p-4 h-[300px]">
                <h3 className="text-lg font-semibold mb-2">Расходы</h3>
                {renderPie(expenseChart, expenseColors)}
            </div>

            {/* Income */}
            <div className="bg-white rounded-2xl shadow p-4 h-[300px]">
                <h3 className="text-lg font-semibold mb-2">Доходы</h3>
                {renderPie(incomeChart, incomeColors)}
            </div>
        </div>
    )
}
