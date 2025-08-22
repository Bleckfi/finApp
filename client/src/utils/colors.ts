import { useMemo } from 'react'

export const generateColor = (seed: string) => {
    seed = String(seed)
    let hash = 0
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    }
    const hue = Math.abs(hash) % 360
    return `hsl(${hue}, 50%, 60%)`
}

// возвращает маппинг name → color
export const useColors = (data: { name: string }[] = []) => {
    return useMemo(() => {
        if (!Array.isArray(data)) return {}
        return data.reduce(
            (acc, item) => {
                acc[item.name] = generateColor(item.name)
                return acc
            },
            {} as Record<string, string>
        )
    }, [data])
}
