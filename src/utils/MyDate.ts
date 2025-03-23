import { DateUtils } from './date.utils'

export class MyDate {
    public day: number
    public month: number
    public year: number

    constructor(
        day: number = new Date().getDate(),
        month: number = new Date().getMonth() + 1,
        year: number = new Date().getFullYear()
    ) {
        this.day = day
        this.month = month
        this.year = year
    }

    addDays(day: number) {
        const maxDays = DateUtils.lastDay(this.month, this.year)

        this.day = this.day + day
        if (this.day > maxDays) {
            this.day = 1
            this.month = this.month + 1
        }
        if (this.month > 12) {
            this.month = 1
            this.year = this.year + 1
        }
    }

    compare(other: MyDate): number {
        const me = this.toDays()

        return me - other.toDays()
    }

    toDays(): number {
        let days =
            this.year * 365 +
            Math.floor(this.year / 4) -
            Math.floor(this.year / 100) +
            Math.floor(this.year / 400)

        for (let m = 1; m < this.month; m++) {
            days += DateUtils.lastDay(m, this.year)
        }

        days += this.day

        return days
    }

    toMonths(): number {
        return this.year * 12 + this.month
    }

    toString() {
        return `${this.day.toString().padStart(2, '0')}/${this.month.toString().padStart(2, '0')}/${this.year.toString().padStart(4, '0')}`
    }

    static fromDate(date: Date) {
        return new MyDate(
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear()
        )
    }

    static fromString(date: String) {
        const day = parseInt(date.split('/')[0])
        const month = parseInt(date.split('/')[1])
        const year = parseInt(date.split('/')[2])
        return new MyDate(day, month, year)
    }
}
