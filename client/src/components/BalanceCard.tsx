type BalanceCardProps = {
    income: number
    expense: number
    month: number
    year: number
}

export const BalanceCard = ({ income, expense }: BalanceCardProps) => {
    const total = income - expense // вот здесь вычисляем баланс

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
                        {total >= 0 ? '+' : '-'} ₽
                        {Math.abs(total).toLocaleString()}
                    </h2>
                </div>
                <div>
                    <p className="text-gray-500">Income</p>
                    <h2 className="text-3xl font-bold text-green-600">
                        + ₽{income.toLocaleString()}
                    </h2>
                </div>
                <div>
                    <p className="text-gray-500">Expenses</p>
                    <h2 className="text-3xl font-bold text-red-500">
                        - ₽{expense.toLocaleString()}
                    </h2>
                </div>
            </div>
        </div>
    )
}
