import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as process from 'node:process'
import { AuthService } from './authentication/AuthService'
import { JwtStrategy } from './authentication/JwtStrategy'
import { BankAccount } from './entity/BankAccount'
import { Recurrence } from './entity/Recurrence'
import { User } from './entity/User'
import { BankAccountController } from './feature/bankAccount/BankAccountController'
import { BankAccountService } from './feature/bankAccount/BankAccountService'
import { RecurrenceController } from './feature/recurrences/RecurrenceController'
import { RecurrenceService } from './feature/recurrences/RecurrenceService'
import { UserController } from './feature/user/UserController'
import { UserService } from './feature/user/UserService'

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
            entities: [User, BankAccount, Recurrence],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
        }),
        TypeOrmModule.forFeature([BankAccount, User, Recurrence]), // Entities
    ],
    controllers: [RecurrenceController, BankAccountController, UserController], // Controllers
    providers: [RecurrenceService, BankAccountService, UserService, AuthService, JwtStrategy], // Services
})
export class AppModule {}
