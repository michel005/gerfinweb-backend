import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bodyParser: true,
        rawBody: true,
    })
    app.enableCors()
    app.setGlobalPrefix('api')

    // Aumentar o limite do tamanho do corpo da requisição
    app.use(require('express').json({ limit: '50mb' }))
    app.use(require('express').urlencoded({ limit: '50mb', extended: true }))

    await app.listen(process.env.PORT ?? 8080)
}

bootstrap()
