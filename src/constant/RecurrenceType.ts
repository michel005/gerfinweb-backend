export const RecurrenceType = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
    YEARLY: 'YEARLY',
} as const

export type RecurrenceType = (typeof RecurrenceType)[keyof typeof RecurrenceType]
