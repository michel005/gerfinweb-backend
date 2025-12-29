import { AbstractPrivateController } from '@/feature/AbstractPrivateController'
import { Controller, Get, Param, Query, Request } from '@nestjs/common'
import { CustomUserRequest } from '@/type/CustomUserRequest'
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { SearchResultDTO } from '@/feature/search/dto/SearchResultDTO'

@ApiTags('Search')
@Controller('/search')
export class SearchController extends AbstractPrivateController {
    @Get('')
    @ApiResponse({
        status: 200,
        description: 'Resultados da busca',
        type: SearchResultDTO,
    })
    async search(@Request() req: CustomUserRequest, @Query('search') search: string) {
        const lastMovements = await this.movementService.lastMovements(req.user.id)
        const bankAccounts = await this.bankAccountService.search(req.user.id, search)
        const movements = await this.movementService.search(req.user.id, search)

        return {
            lastMovements,
            bankAccounts,
            movements,
        }
    }

    @Get('/dashboard/:year/:month')
    @ApiParam({
        name: 'year',
        required: true,
        type: Number,
        description: 'Ano',
        example: new Date().getFullYear(),
    })
    @ApiParam({
        name: 'month',
        required: true,
        type: Number,
        description: 'Mês',
        example: new Date().getMonth() + 1,
    })
    async dashboard(@Request() req: CustomUserRequest, @Param('year') year: number, @Param('month') month: number) {
        const lastMovements = await this.movementService.pendentMovements(req.user.id, month, year)

        return {
            ...(await this.searchService.dashboard(req.user.id, month, year)),
            lastMovements,
        }
    }
}
