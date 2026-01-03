import { AbstractService } from '@/feature/AbstractService'

export class SearchService extends AbstractService {
    async dashboard(userId: string, month: number, year: number) {
        const queryBuilder = await this.bankAccountRepository
            .createQueryBuilder('ba')
            .leftJoin(
                'Movement',
                'm',
                '(m.originBankAccountId = ba.id OR m.destinationBankAccount = ba.id) AND m.userId = :userId AND m.date <= :date',
                { userId, date: new Date(year, month, 0) }
            )
            .select(
                'COALESCE(SUM(CASE WHEN m.approved AND m.date <= :now THEN CASE WHEN m.destinationBankAccount IS NOT NULL AND m.originBankAccountId = ba.id THEN (m.value * -1) ELSE m.value END ELSE 0 END), 0)',
                'totalCurrent'
            )
            .addSelect(
                'COALESCE(SUM(CASE WHEN m.destinationBankAccount IS NOT NULL AND m.originBankAccountId = ba.id THEN (m.value * -1) ELSE m.value END), 0)',
                'totalFuture'
            )
            .where('ba.userId = :userId', { userId })
            .andWhere('ba.active = :active', { active: true })
            .setParameter('now', new Date().toISOString().split('T')[0])
            .setParameter('dueDate', new Date(year, month, 0))
            .getRawOne()

        const amountsQueryBuilder = await this.movementRepository
            .createQueryBuilder('movement')
            .select('COALESCE(SUM(value), 0)', 'amount')
            .addSelect('COALESCE(SUM(CASE WHEN value > 0 THEN value ELSE 0 END), 0)', 'credits')
            .addSelect('COALESCE(SUM(CASE WHEN value < 0 THEN value ELSE 0 END), 0)', 'debits')
            .where('userId = :userId AND destinationBankAccountId is null AND date BETWEEN :date1 AND :date2', {
                userId,
                date1: new Date(year, month - 1, 1).toISOString().split('T')[0],
                date2: new Date(year, month, 0).toISOString().split('T')[0],
            })
            .getRawOne()

        const categoryQueryBuilder = this.categoryRepository
            .createQueryBuilder('category')
            .select('category')
            .addSelect('COALESCE(SUM(movements.value), 0)', 'category_totalBalance')
            .leftJoin(
                'Movement',
                'movements',
                'movements.categoryId = category.id AND movements.date BETWEEN :date1 AND :date2'
            )
            .where('category.userId = :userId', {
                userId,
                date1: new Date(year, month - 1, 1).toISOString().split('T')[0],
                date2: new Date(year, month, 0).toISOString().split('T')[0],
            })
            .groupBy('category.id')

        const { entities, raw } = await categoryQueryBuilder.getRawAndEntities()

        return {
            totalAmount: Number(queryBuilder.totalCurrent),
            amountByCategories: entities.map((x, index) => ({
                ...x,
                amount: raw[index].category_totalBalance,
            })),
            maxAmountByCategories: Math.max(...raw.map((x) => Number(x.category_totalBalance))),
            minAmountByCategories: Math.min(...raw.map((x) => Number(x.category_totalBalance))),
            monthYearAmount: Number(amountsQueryBuilder.amount ?? 0),
            monthYearDebits: Number(amountsQueryBuilder.debits ?? 0),
            monthYearCredits: Number(amountsQueryBuilder.credits ?? 0),
        }
    }
}
