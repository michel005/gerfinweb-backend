import { ApiProperty } from '@nestjs/swagger'
import { IsHexColor, IsOptional, IsString } from 'class-validator'
import { ErrorCode } from '@/constant/ErrorCode'

export class CreateCategoryDTO {
    @ApiProperty({
        description: 'Nome da categoria',
        example: 'Alimentação',
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    name: string

    @ApiProperty({
        description: 'Descrição da categoria',
        example: 'Despesas com alimentação e restaurantes',
        required: false,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    @IsOptional()
    description?: string

    @ApiProperty({
        description: 'Cor da categoria em formato hexadecimal',
        example: '#FF5733',
        required: false,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    @IsOptional()
    @IsHexColor({ message: ErrorCode.GENERAL_INVALID_HEX_COLOR_FIELD })
    color?: string

    @ApiProperty({
        description: 'Ícone da categoria (Google Material Icons)',
        example: 'restaurant',
        required: false,
    })
    @IsString({
        message: ErrorCode.GENERAL_INVALID_STRING_FIELD,
    })
    @IsOptional()
    icon?: string
}
