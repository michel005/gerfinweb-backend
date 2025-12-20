import { AuthService } from '@/authentication/AuthService'
import { JwtStrategy } from '@/authentication/JwtStrategy'
import { BankAccount } from '@/entity/BankAccount'
import { Recurrence } from '@/entity/Recurrence'
import { User } from '@/entity/User'
import { BankAccountController } from '@/feature/bankAccount/BankAccountController'
import { BankAccountService } from '@/feature/bankAccount/BankAccountService'
import { RecurrenceController } from '@/feature/recurrences/RecurrenceController'
import { RecurrenceService } from '@/feature/recurrences/RecurrenceService'
import { UserController } from '@/feature/user/UserController'
import { UserService } from '@/feature/user/UserService'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { newDb } from 'pg-mem'
import { ValidationError } from 'class-validator'

export async function createTestApp() {
    const db = newDb()
    db.public.registerFunction({
        name: 'now',
        implementation: () => new Date(),
    })
    db.public.registerFunction({
        name: 'version',
        implementation: () => 'PostgreSQL 14.2',
    })
    db.public.registerFunction({
        name: 'current_database',
        implementation: () => 'gerfinweb',
    })

    const dataSource: DataSource = await db.adapters.createTypeormDataSource({
        type: 'postgres',
        entities: [User, BankAccount, Recurrence],
        synchronize: true,
    })

    await dataSource.initialize()

    const moduleFixture = await Test.createTestingModule({
        imports: [
            PassportModule,
            JwtModule.register({
                secret: 'TokenSuperSeguro@2025',
                signOptions: { expiresIn: '7d' },
            }),
            TypeOrmModule.forRoot({
                type: 'postgres',
                entities: [User, BankAccount, Recurrence],
                synchronize: true,
                logging: false,
            }),
            TypeOrmModule.forFeature([User, BankAccount, Recurrence]),
        ],
        controllers: [RecurrenceController, BankAccountController, UserController],
        providers: [RecurrenceService, BankAccountService, UserService, AuthService, JwtStrategy],
    })
        .overrideProvider(DataSource)
        .useValue(dataSource)
        .compile()
    const app = moduleFixture.createNestApplication()

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            exceptionFactory: (errors: ValidationError[]) => {
                const errorMap: Record<string, string> = {}

                for (const error of errors) {
                    if (error.constraints && error.constraints.hasOwnProperty.call('whitelistValidation')) {
                        errorMap[error.property] = `O campo '${error.property}' não é permitido.`
                        continue
                    }

                    if (error.constraints) {
                        errorMap[error.property] = Object.values(error.constraints).pop() as string
                    }
                }

                return new BadRequestException({
                    message: 'Dados inválidos',
                    details: errorMap,
                    error: 'Bad Request',
                    statusCode: 400,
                })
            },
        })
    )

    await app.init()
    return app
}
