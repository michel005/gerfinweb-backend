import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common'
import { AuthGuard, CustomRequest } from '../guards/AuthGuard'
import { Template } from '../schema/template.schema'
import { TemplateService } from '../service/template.service'

@Controller('templates')
export class TemplateController {
    constructor(private readonly templateService: TemplateService) {}

    @Post()
    @UseGuards(AuthGuard)
    create(@Request() req: CustomRequest, @Body() body: Template) {
        return this.templateService.create({
            ...body,
            user: req.user._id,
        })
    }

    @Put()
    @UseGuards(AuthGuard)
    update(
        @Request() req: CustomRequest,
        @Query('id') id: string,
        @Body() body: Template
    ) {
        return this.templateService.update(id, {
            user: req.user._id,
            day: body.day,
            description: body.description,
            destinyAccount: body.destinyAccount,
            recurrence: body.recurrence,
            value: body.value,
        })
    }

    @Delete()
    @UseGuards(AuthGuard)
    delete(@Request() req: CustomRequest, @Query('id') id: string) {
        return this.templateService.delete(id)
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(
        @Request() req: CustomRequest,
        @Query('month') month: string,
        @Query('year') year: string
    ) {
        return this.templateService.findAllWithMovementCount(
            req.user._id,
            month,
            year
        )
    }

    @Get('/toMovement')
    @UseGuards(AuthGuard)
    toMovement(
        @Request() req: CustomRequest,
        @Query('id') id: string,
        @Query('month') month: string,
        @Query('year') year: string
    ) {
        return this.templateService.toMovement(req.user._id, id, month, year)
    }

    @Get('/findAllByYear')
    @UseGuards(AuthGuard)
    findAllWithMovementCount(
        @Request() req: CustomRequest,
        @Query('year') year: string
    ) {
        return this.templateService.findAllByYear(req.user._id, year)
    }
}
