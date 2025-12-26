import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCategoryDTO, UpdateCategoryDTO } from '@/feature/category/dto'
import { AbstractService } from '@/feature/AbstractService'

@Injectable()
export class CategoryService extends AbstractService {
    async create(userId: string, category: CreateCategoryDTO) {
        const existingCategory = await this.categoryRepository.findOne({
            where: {
                name: category.name,
                user: {
                    id: userId,
                },
            },
        })
        if (existingCategory) {
            throw new BadRequestException('Categoria já cadastrada')
        }
        const newCategory = this.categoryRepository.create({
            ...category,
            user: {
                id: userId,
            },
        })
        await newCategory.beforeInsert()
        const response = await this.categoryRepository.save(newCategory)
        return response.toDTO()
    }

    async update(userId: string, id: string, category: UpdateCategoryDTO) {
        const existingByName = await this.categoryRepository.findOne({
            where: {
                name: category.name,
                user: {
                    id: userId,
                },
            },
        })
        if (existingByName && existingByName.id !== id) {
            throw new BadRequestException('Categoria já cadastrada')
        }
        const existingCategory = await this.categoryRepository.findOne({
            where: {
                id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingCategory) {
            throw new Error('Categoria não encontrada')
        }
        Object.assign(existingCategory, category)
        await existingCategory.beforeUpdate()
        const response = await this.categoryRepository.save(existingCategory)
        return response.toDTO()
    }

    async delete(userId: string, id: string) {
        const existingCategory = await this.categoryRepository.findOne({
            where: {
                id,
                user: {
                    id: userId,
                },
            },
        })
        if (!existingCategory) {
            throw new Error('Categoria não encontrada')
        }
        const response = await this.categoryRepository.remove(existingCategory)
        return response.toDTO()
    }

    async getAll(userId: string) {
        const categories = await this.categoryRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
            order: {
                name: 'ASC',
            },
        })
        return {
            categories: categories.map((category) => category.toDTO()),
            total: await this.categoryRepository.count({
                where: {
                    user: {
                        id: userId,
                    },
                },
            }),
        }
    }
}
