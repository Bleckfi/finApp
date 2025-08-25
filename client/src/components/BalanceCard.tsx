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

    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500">Текущий баланс</p>
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
                    <p className="text-gray-500">Доход</p>
                    <h2 className="text-3xl font-bold text-green-600">
                        +{convert(income).toFixed(2)}
                        {symbol}
                    </h2>
                </div>
                <div>
                    <p className="text-gray-500">Расход</p>
                    <h2 className="text-3xl font-bold text-red-500">
                        -{convert(expense).toFixed(2)}
                        {symbol}
                    </h2>
                </div>
            </div>
        </div>
    )
}
