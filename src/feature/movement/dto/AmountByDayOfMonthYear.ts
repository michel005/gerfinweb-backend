import { ApiProperty } from '@nestjs/swagger'

export class AmountByDayOfMonthYear {
    @ApiProperty({
        example: {
            1: { current: 1500, future: 2000 },
            2: { current: 1200, future: 1800 },
            3: { current: 1300, future: 1700 },
        },
        description: 'Saldo atual e previsto por dia do mês',
    })
    days: Record<
        number,
        {
            current: number
            future: number
        }
    >

    @ApiProperty({ example: 2000, description: 'Valor máximo dos saldos' })
    max: number
    @ApiProperty({ example: 1200, description: 'Valor mínimo dos saldos' })
    min: number
    @ApiProperty({ example: 3, description: 'Mês referente aos saldos' })
    month: number
    @ApiProperty({ example: 2024, description: 'Ano referente aos saldos' })
    year: number
}
