import { useCurrency } from '../hooks/useCurrency'

type BalanceCardProps = {
    income: number
    expense: number
    month: number
    year: number
}

export const BalanceCard = ({ income, expense }: BalanceCardProps) => {
    const { symbol, convert } = useCurrency()
    const total = income - expense
    console.log(income, expense, total)

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500">Total Balance</p>
                    <h2
                        className={`text-3xl font-bold ${
                            total >= 0 ? 'text-green-600' : 'text-red-500'
                        }`}
                    >
                        {total >= 0 ? '+' : '-'}
                        {convert(Math.abs(total)).toFixed(2)}
                        {symbol}
                    </h2>
                </div>
                <div>
                    <p className="text-gray-500">Income</p>
                    <h2 className="text-3xl font-bold text-green-600">
                        +{convert(income).toFixed(2)}
                        {symbol}
                    </h2>
                </div>
                <div>
                    <p className="text-gray-500">Expenses</p>
                    <h2 className="text-3xl font-bold text-red-500">
                        -{convert(expense).toFixed(2)}
                        {symbol}
                    </h2>
                </div>
            </div>
        </div>
    )
}
