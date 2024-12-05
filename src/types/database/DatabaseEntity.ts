export type DatabaseEntity<T = any> = {
    id?: string
    save_date?: string
} & T
