export default function BudgetPage() {
    const budgets = [
        { category: 'Food', planned: 10000, spent: 8500 },
        { category: 'Entertainment', planned: 5000, spent: 1500 },
    ];

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Budget Planning</h1>
            <div className="space-y-4">
                {budgets.map((b, idx) => {
                    const percent = Math.round((b.spent / b.planned) * 100);
                    return (
                        <div key={idx} className="bg-white p-4 rounded-2xl shadow space-y-2">
                            <div className="flex justify-between">
                                <span>{b.category}</span>
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
                            <p className="text-sm text-gray-500">{percent}% used</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
