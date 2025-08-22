import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store'
import { setCurrency as setCurrencyAction } from '../store/currencySlice'

type Currency = 'BYN' | 'USD' | 'EUR' | 'RUB'

const rates: Record<Currency, number> = {
    BYN: 1,
    RUB: 27.0753,
    USD: 0.34,
    EUR: 0.2875,
}

export const symbols: Record<Currency, string> = {
    BYN: 'BYN',
    USD: '$',
    EUR: '€',
    RUB: '₽',
}

export const useCurrency = () => {
    const dispatch = useDispatch()
    const currency = useSelector((state: RootState) => state.currency.currency)

    const setCurrency = (newCurrency: Currency) => {
        dispatch(setCurrencyAction(newCurrency))
    }

    const convert = (amount: number) => {
        return amount * rates[currency]
    }

    const symbol = symbols[currency]

    return { currency, setCurrency, convert, symbol }
}
