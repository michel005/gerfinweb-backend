export class FileUtils {
    static fileToBase64 = (file: File, callback: (value: string) => void) => {
        const FR = new FileReader()

        FR.addEventListener('load', (evt) => {
            callback(evt?.target?.result?.toString() || '')
        })

        FR.readAsDataURL(file)
    }

    static saveContent = (content: string, fileName: string) => {
        const blob = new Blob([content], { type: 'text/json' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
    }

    static friendlySize = (size: number) => {
        if (size < 1024) {
            return `${size} b`
        } else if (size === 1024) {
            return `1 kb`
        } else {
            if (size > 1024 * 1024) {
                return `${Math.round((size / (1024 * 1024)) * 100) / 100} mb`
            } else {
                return `${Math.round((size / 1024) * 100) / 100} kb`
            }
        }
    }

    static base64Size = (base64String?: string) => {
        const cleanedBase64 = (base64String || '').split(',').pop() || ''
        const length = cleanedBase64.length
        const padding = (cleanedBase64.match(/=/g) || []).length
        return Math.floor((length * 3) / 4) - padding
    }
}
