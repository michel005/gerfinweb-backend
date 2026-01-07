export function ParseDateToDateString(date: any) {
    return new Date(date).toISOString().split('T')[0]
}
