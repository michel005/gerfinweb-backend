import { ResponseMovementDTO } from '@/feature/movement/dto'
import { ApiProperty } from '@nestjs/swagger'
import { ResponseBankAccountDTO } from '@/feature/bankAccount/dto'

export class SearchResultDTO {
    @ApiProperty({
        description: 'Lista dos ultimos 5 lançamentos realizados',
        type: [ResponseMovementDTO],
    })
    lastMovements: ResponseMovementDTO[]

    @ApiProperty({
        description: 'Lista dos bancos que atendem a busca',
        type: [ResponseBankAccountDTO],
    })
    bankAccounts: ResponseBankAccountDTO[]

    @ApiProperty({
        description: 'Lista dos lançamentos que atendem a busca',
        type: [ResponseMovementDTO],
    })
    movements: ResponseMovementDTO[]
}
