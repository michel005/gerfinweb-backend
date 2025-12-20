import { ApiProperty } from '@nestjs/swagger'
import { ResponseBankAccountDTO } from './ResponseBankAccountDTO'

export class ResponseBankAccountListDTO {
    @ApiProperty({
        description: 'Lista de contas bancárias',
        type: [ResponseBankAccountDTO],
        example: [],
    })
    accounts: ResponseBankAccountDTO[]

    @ApiProperty({ description: 'Quantidade total de contas bancárias' })
    total: number
}
