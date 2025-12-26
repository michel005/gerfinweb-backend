import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Delete, Get, Param, Post, Put, Request } from '@nestjs/common'
import { AbstractPrivateController } from '@/feature/AbstractPrivateController'
import { CreateCategoryDTO, ResponseCategoryDTO, ResponseCategoryListDTO } from '@/feature/category/dto'
import { CustomUserRequest } from '@/type/CustomUserRequest'

@ApiTags('Category')
@Controller('/category')
export class CategoryController extends AbstractPrivateController {
    @Post('/create')
    @ApiResponse({
        status: 200,
        description: 'Cadastra uma categoria com sucesso',
        type: ResponseCategoryDTO,
    })
    async create(@Request() req: CustomUserRequest, @Body() category: CreateCategoryDTO) {
        return this.categoryService.create(req.user.id, category)
    }

    @Put('/:id/update')
    @ApiResponse({
        status: 200,
        description: 'Atualiza uma categoria com sucesso',
        type: ResponseCategoryDTO,
    })
    async update(@Request() req: CustomUserRequest, @Param('id') id: string, @Body() category: CreateCategoryDTO) {
        return this.categoryService.update(req.user.id, id, category)
    }

    @Delete('/:id/delete')
    @ApiResponse({
        status: 200,
        description: 'Deleta uma categoria com sucesso',
        type: ResponseCategoryDTO,
    })
    async delete(@Request() req: CustomUserRequest, @Param('id') id: string) {
        return this.categoryService.delete(req.user.id, id)
    }

    @Get('/getAll')
    @ApiResponse({
        status: 200,
        description: 'Retorna todas as categorias do usuário',
        type: ResponseCategoryListDTO,
    })
    async getAll(@Request() req: CustomUserRequest) {
        return this.categoryService.getAll(req.user.id)
    }
}
