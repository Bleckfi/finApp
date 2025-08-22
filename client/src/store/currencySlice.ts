// src/store/currencySlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

type CurrencyState = {
    currency: 'BYN' | 'USD' | 'EUR' | 'RUB'
}

const initialState: CurrencyState = {
    currency: (localStorage.getItem('currency') as CurrencyState['currency']) || 'BYN',
}

const currencySlice = createSlice({
    name: 'currency',
    initialState,
    reducers: {
        setCurrency(state, action: PayloadAction<CurrencyState['currency']>) {
            state.currency = action.payload
            localStorage.setItem('currency', action.payload)
        },
    },
})

export const { setCurrency } = currencySlice.actions
export default currencySlice.reducer
