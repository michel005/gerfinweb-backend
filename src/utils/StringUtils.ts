export class StringUtils {
    static stringToBase64 = (text: string) => {
        return btoa(text)
    }

    static base64ToString = (base64: string) => {
        return atob(base64)
    }
}
