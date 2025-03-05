import { HttpException, HttpStatus } from '@nestjs/common'

export class ValidateException extends HttpException {
    constructor(list: { [key: string]: string }) {
        super(list, HttpStatus.BAD_REQUEST)
    }
}

export class ErrorCollection {
    private list: { [key: string]: string } = {}

    public hasField = (field: string): boolean => {
        return !!this.list[field]
    }

    public add = (field: string, key: string, validation?: boolean) => {
        if (validation) {
            this.list[field] = key
        }
    }

    public addNullValidation = (field: string, value: string) => {
        if (!value || value === '') {
            this.list[field] = 'VALIDATE-001'
        }
    }

    public throw = () => {
        if (Object.keys(this.list).length > 0) {
            throw new ValidateException(this.list)
        }
    }
}
