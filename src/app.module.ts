import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as process from 'node:process'
import { User } from './entity/User'
import { UserService } from './feature/user/UserService'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './authentication/AuthService'
import { JwtStrategy } from './authentication/JwtStrategy'
import { UserController } from './feature/user/UserController'
import { BankAccountController } from './feature/bankAccount/BankAccountController'
import { BankAccountService } from './feature/bankAccount/BankAccountService'
import { BankAccount } from './entity/BankAccount'

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
            entities: [User, BankAccount],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
        }),
        TypeOrmModule.forFeature([BankAccount, User]), // Entities
    ],
    controllers: [BankAccountController, UserController], // Controllers
    providers: [BankAccountService, UserService, AuthService, JwtStrategy], // Services
})
export class AppModule {}
