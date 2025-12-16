import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as express from 'express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bodyParser: true,
        rawBody: true,
    })
    app.enableCors()
    app.setGlobalPrefix('api')
    const config = new DocumentBuilder()
        .setTitle('GerFinWEB - Backend')
        .setDescription('API em NestJS para o GerFinWEB')
        .setVersion('1.0')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                in: 'header',
            },
            'Authorization'
        )
        .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    })

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

    app.use(express.json({ limit: '50mb' }))
    app.use(express.urlencoded({ limit: '50mb', extended: true }))

    await app.listen(process.env.PORT ?? 8080)
}

bootstrap().catch((e) => {
    console.error('Erro ao iniciar o servidor:', e)
})
