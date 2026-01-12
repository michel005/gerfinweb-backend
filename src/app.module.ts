import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
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
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        PassportModule,
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): JwtModuleOptions => ({
                secret: configService.get<string>('JWT_SECRET') || 'TokenSuperSeguro@2025',
                signOptions: { expiresIn: (configService.get<string>('JWT_EXPIRES_IN') as any) || '7d' },
            }),
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
                type: 'mysql',
                host: configService.get<string>('MYSQL_HOST') || 'localhost',
                port: configService.get<number>('MYSQL_PORT') || 3306,
                username: configService.get<string>('MYSQL_USER') || 'root',
                password: configService.get<string>('MYSQL_PASSWORD') || '123456',
                database: configService.get<string>('MYSQL_DATABASE') || 'gerfinweb',
                entities: Object.values(Entities),
                synchronize: configService.get<string>('NODE_ENV') !== 'production',
                logging: configService.get<string>('NODE_ENV') === 'development',
                retryAttempts: 10,
                retryDelay: 5000,
            }),
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
