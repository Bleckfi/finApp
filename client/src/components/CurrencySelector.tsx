import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store'
import { setCurrency } from '../store/currencySlice'

export const CurrencySelector = () => {
    const currency = useSelector((state: RootState) => state.currency.currency)
    const dispatch = useDispatch<AppDispatch>()

    return (
        <select
            value={currency}
            onChange={(e) => dispatch(setCurrency(e.target.value as any))}
            className="border rounded px-3 py-1"
        >
            <option value="BYN">BYN</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="RUB">RUB</option>
        </select>
    )
}
