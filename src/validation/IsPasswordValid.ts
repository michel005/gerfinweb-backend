import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator'

export interface PasswordValidationOptions {
    minLength?: number
    hasUpperCase?: boolean
    hasLowerCase?: boolean
    hasNumber?: boolean
    hasSpecialChar?: boolean
}

@ValidatorConstraint({ name: 'isPasswordValid', async: false })
export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
    validate(value: string, args: any): boolean {
        const options: PasswordValidationOptions = args.constraints[0] || {}
        const {
            minLength = 8,
            hasUpperCase = true,
            hasLowerCase = true,
            hasNumber = true,
            hasSpecialChar = true,
        } = options

        if (minLength && (value || '').length < minLength) return false
        if (hasUpperCase && !/[A-Z]/.test(value)) return false
        if (hasLowerCase && !/[a-z]/.test(value)) return false
        if (hasNumber && !/\d/.test(value)) return false
        if (hasSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) return false

        return true
    }

    defaultMessage(args: any): string {
        return 'A senha não atende aos requisitos de segurança'
    }
}

export function IsPasswordValid(options?: PasswordValidationOptions, validationOptions?: ValidationOptions) {
    return function (target: object, propertyName: string) {
        registerDecorator({
            target: target.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsStrongPasswordConstraint,
        })
    }
}
