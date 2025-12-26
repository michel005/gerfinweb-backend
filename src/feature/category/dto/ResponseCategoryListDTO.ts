import { ResponseCategoryDTO } from '@/feature/category/dto/ResponseCategoryDTO'
import { ApiProperty } from '@nestjs/swagger'

export class ResponseCategoryListDTO {
    @ApiProperty({
        type: [ResponseCategoryDTO],
        description: 'Lista de categorias',
    })
    categories: ResponseCategoryDTO[]

    @ApiProperty({
        type: Number,
        description: 'Total de categorias',
    })
    total: number
}
