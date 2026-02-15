import { ApiProperty } from '@nestjs/swagger'
import { ResponseCategoryDTO } from '@/feature/category/dto'
import { ResponseMovementDTO } from '@/feature/movement/dto/ResponseMovementDTO'

export class ResponseGetByCategoryIdAndYear {
    @ApiProperty({
        description: 'Categoria',
    })
    category: ResponseCategoryDTO

    @ApiProperty({
        description: 'Movimentação da categoria',
        type: [ResponseMovementDTO],
    })
    movements: ResponseMovementDTO[]

    total: number
}
