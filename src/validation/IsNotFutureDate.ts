import { registerDecorator, ValidationOptions } from 'class-validator'

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'isNotFutureDate',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any) {
                    if (!value) return true

                    const inputDate = new Date(value as string)
                    const today = new Date()

                    today.setHours(23, 59, 59, 999)

                    return inputDate <= today
                },
                defaultMessage() {
                    return 'Invalid future date'
                },
            },
        })
    }
}
