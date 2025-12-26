import { ApiProperty } from '@nestjs/swagger'

export class ResponseCategoryDTO {
    @ApiProperty({
        description: 'ID da categoria',
        example: '123e4567-e89b-12d3-a456-426614174000',
        required: true,
    })
    id: string

    @ApiProperty({
        description: 'Data de criação da categoria',
        example: '2023-01-01T00:00:00.000Z',
    })
    createdAt: Date

    @ApiProperty({
        description: 'Data de atualização da categoria',
        example: '2023-01-01T00:00:00.000Z',
    })
    updatedAt: Date

    @ApiProperty({
        description: 'Nome da categoria',
        example: 'Alimentação',
    })
    name: string

    @ApiProperty({
        description: 'Descrição da categoria',
        example: 'Despesas com alimentação e restaurantes',
        required: false,
    })
    description?: string

    @ApiProperty({
        description: 'Cor da categoria em formato hexadecimal',
        example: '#FF5733',
        required: false,
    })
    color?: string

    @ApiProperty({
        description: 'Ícone da categoria (Google Material Icons)',
        example: 'restaurant',
        required: false,
    })
    icon?: string
}
