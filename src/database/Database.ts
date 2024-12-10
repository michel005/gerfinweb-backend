import { PrismaClient } from '@prisma/client'

export class Database<T> {
    public static prismaClient = new PrismaClient()
}
