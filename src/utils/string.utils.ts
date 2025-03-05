export class StringUtils {
    static hexToRgbA = (hex: string, opacity: number) => {
        let r = parseInt(hex.slice(1, 3), 16)
        let g = parseInt(hex.slice(3, 5), 16)
        let b = parseInt(hex.slice(5, 7), 16)

        return `rgba(${r}, ${g}, ${b}, ${opacity})`
    }

    static comparePaths = (path1: string, path2: string) => {
        const escapedPath2 = path2.replace(/\[id\]/g, '.*')
        const regex = new RegExp('^' + escapedPath2.replace(/\//g, '\\/') + '$')
        return regex.test(path1)
    }

    static numberToMoney = (value: number) => {
        if (!value) {
            return `R$ 0,00`
        } else {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 2,
            }).format(value / 100)
        }
    }
}
