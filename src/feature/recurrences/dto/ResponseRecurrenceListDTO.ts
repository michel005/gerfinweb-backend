import { ApiProperty } from '@nestjs/swagger'
import { ResponseRecurrenceDTO } from './ResponseRecurrenceDTO'

export class ResponseRecurrenceListDTO {
    @ApiProperty({
        description: 'Lista de recorrências',
        type: [ResponseRecurrenceDTO],
        example: [],
    })
    recurrences: ResponseRecurrenceDTO[]

    @ApiProperty({ description: 'Quantidade total de recorrências' })
    total: number
}
