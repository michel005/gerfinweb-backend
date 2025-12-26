import { ResponseMovementDTO } from '@/feature/movement/dto/index'
import { ApiProperty } from '@nestjs/swagger'

export class ResponseMovementListDTO {
    @ApiProperty({
        description: 'Lista de movimentações',
        type: [ResponseMovementDTO],
        example: [],
    })
    movements: ResponseMovementDTO[]

    @ApiProperty({ description: 'Quantidade total de movimentações' })
    total: number
}
