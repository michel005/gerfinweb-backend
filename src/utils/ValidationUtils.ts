export class ValidationUtils {
    static validDateString = (dateString: string) => {
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/
        if (!regex.test(dateString)) {
            return false
        }

        const [_, day, month, year] = dateString.match(regex) as any

        const dayInt = parseInt(day, 10)
        const monthInt = parseInt(month, 10)
        const yearInt = parseInt(year, 10)

        if (monthInt < 1 || monthInt > 12) {
            return false
        }

        const daysInMonth = [
            31,
            this.isLeapYear(yearInt) ? 29 : 28,
            31,
            30,
            31,
            30,
            31,
            31,
            30,
            31,
            30,
            31,
        ]
        if (dayInt < 1 || dayInt > daysInMonth[monthInt - 1]) {
            return false
        }

        return true
    }

    static validTimeString = (timeString: string) => {
        const regex = /^(\d{2}):(\d{2}):(\d{2})$/
        if (!regex.test(timeString)) {
            return false
        }

        const [_, hours, minutes, seconds] = timeString.match(regex) as any
        const hoursInt = parseInt(hours, 10)
        const minutesInt = parseInt(minutes, 10)
        const secondsInt = parseInt(seconds, 10)

        if (hoursInt < 0 || hoursInt > 23) {
            return false
        }
        if (minutesInt < 0 || minutesInt > 59) {
            return false
        }
        if (secondsInt < 0 || secondsInt > 59) {
            return false
        }

        return true
    }

    static validDateTimeString = (dateTimeString: string) => {
        return (
            this.validDateString(dateTimeString.split(' ')?.[0] || '') &&
            this.validTimeString(dateTimeString.split(' ')?.[1] || '')
        )
    }

    static isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
    }
}
