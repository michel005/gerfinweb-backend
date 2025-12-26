import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { CustomBadRequestExceptionDTO } from '@/dto'
import { BankAccountService } from '@/feature/bankAccount/BankAccountService'
import { CategoryService } from '@/feature/category/CategoryService'
import MovementService from '@/feature/movement/MovementService'
import { RecurrenceService } from '@/feature/recurrences/RecurrenceService'
import { UserService } from '@/feature/user/UserService'
import { SearchService } from '@/feature/search/SearchService'

@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('Authorization')
@ApiResponse({
    status: 400,
    description: 'Erros diversos de validação',
    type: CustomBadRequestExceptionDTO,
})
@ApiResponse({
    status: 401,
    description: 'Usuário não autorizado',
    type: CustomBadRequestExceptionDTO,
})
export abstract class AbstractPrivateController {
    constructor(
        protected searchService: SearchService,
        protected bankAccountService: BankAccountService,
        protected categoryService: CategoryService,
        protected movementService: MovementService,
        protected recurrenceService: RecurrenceService,
        protected userService: UserService
    ) {}
}
