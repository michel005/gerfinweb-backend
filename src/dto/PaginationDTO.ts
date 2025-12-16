import { ApiProperty } from '@nestjs/swagger'
import { IsNumber } from 'class-validator'
import { ErrorCode } from 'src/constant/ErrorCode'

export class PaginationDTO {
    @IsNumber({}, { message: ErrorCode.GENERAL_INVALID_NUMBER_FIELD })
    @ApiProperty({ description: 'Número da página atual' })
    page: number

    @IsNumber({}, { message: ErrorCode.GENERAL_INVALID_NUMBER_FIELD })
    @ApiProperty({ description: 'Quantidade de registros a serem retornados' })
    size: number
}
