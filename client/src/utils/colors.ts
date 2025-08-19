import { useMemo } from 'react'

export const generateColor = (seed: string) => {
    seed = String(seed) // <-- принудительно превращаем в строку
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 50%, 60%)`
}

export const useColors = (data: { name: string }[] = []) => {
    return useMemo(() => {
        return data.map((item) => generateColor(item.name))
    }, [data])
}
