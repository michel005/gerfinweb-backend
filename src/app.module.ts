import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as process from 'node:process'
import { AuthService } from './authentication/AuthService'
import { JwtStrategy } from './authentication/JwtStrategy'
import { BankAccountController } from './feature/bankAccount/BankAccountController'
import { BankAccountService } from './feature/bankAccount/BankAccountService'
import { RecurrenceController } from './feature/recurrences/RecurrenceController'
import { RecurrenceService } from './feature/recurrences/RecurrenceService'
import { UserController } from './feature/user/UserController'
import { UserService } from './feature/user/UserService'
import MovementService from '@/feature/movement/MovementService'
import { MovementController } from '@/feature/movement/MovementController'
import { CategoryController } from '@/feature/category/CategoryController'
import { CategoryService } from '@/feature/category/CategoryService'
import * as Entities from './entity'
import { SearchController } from '@/feature/search/SearchController'
import { SearchService } from '@/feature/search/SearchService'

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: 'TokenSuperSeguro@2025',
            signOptions: { expiresIn: '7d' },
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.MYSQL_HOST || 'localhost',
            port: parseInt(process.env.MYSQL_PORT || '3306'),
            username: process.env.MYSQL_USER || 'root',
            password: process.env.MYSQL_PASSWORD || '123456',
            database: process.env.MYSQL_DATABASE || 'gerfinweb',
            entities: Object.values(Entities),
            synchronize: process.env.NODE_ENV !== 'production',
            logging: true,
        }),
        TypeOrmModule.forFeature(Object.values(Entities)),
    ],
    controllers: [
        SearchController,
        CategoryController,
        MovementController,
        RecurrenceController,
        BankAccountController,
        UserController,
    ],
    providers: [
        SearchService,
        CategoryService,
        MovementService,
        RecurrenceService,
        BankAccountService,
        UserService,
        AuthService,
        JwtStrategy,
    ],
})
export class AppModule {}
