import { ResponseMovementDTO } from '@/feature/movement/dto/ResponseMovementDTO'
import { ApiProperty } from '@nestjs/swagger'
import { ResponseRecurrenceDTO } from '@/feature/recurrences/dto'

class RecurrenceMovementDTO {
    @ApiProperty({
        type: String,
        description: 'Recorrência associada às movimentações',
    })
    recurrence?: ResponseRecurrenceDTO

    @ApiProperty({
        type: () => [ResponseMovementDTO],
        description: 'Lista de movimentações da recorrência',
    })
    movements: ResponseMovementDTO[]

    @ApiProperty({
        type: Number,
        description: 'Total de débitos da recorrência',
    })
    debits: number

    @ApiProperty({
        type: Number,
        description: 'Total de créditos da recorrência',
    })
    credits: number

    @ApiProperty({
        type: Number,
        description: 'Valor total das movimentações da recorrência',
    })
    totalAmount: number
}

export class RecurrencesMovementByMonthYearDTO {
    @ApiProperty({
        type: Number,
        description: 'Mês das movimentações',
    })
    month: number

    @ApiProperty({
        type: Number,
        description: 'Ano das movimentações',
    })
    year: number

    @ApiProperty({
        type: () => [RecurrenceMovementDTO],
        description: 'Lista de recorrências com suas respectivas movimentações',
    })
    recurrences: RecurrenceMovementDTO[]

    @ApiProperty({
        type: () => [ResponseMovementDTO],
        description: 'Lista de movimentações que não possuem recorrência',
    })
    otherMovements: RecurrenceMovementDTO
}
