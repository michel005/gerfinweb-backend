import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import * as process from 'node:process'
import { AccountController } from './controller/account.controller'
import { MovementController } from './controller/movement.controller'
import { TemplateController } from './controller/template.controller'
import { UserController } from './controller/user.controller'
import { Account, AccountSchema } from './schema/account.schema'
import { Movement, MovementSchema } from './schema/movement.schema'
import { Template, TemplateSchema } from './schema/template.schema'
import { Token, TokenSchema } from './schema/token.schema'
import { User, UserSchema } from './schema/user.schema'
import { AccountService } from './service/account.service'
import { MovementService } from './service/movement.service'
import { TemplateService } from './service/template.service'
import { TokenService } from './service/token.service'
import { UserService } from './service/user.service'
import { PageController } from './controller/page.controller'

@Module({
    imports: [
        MongooseModule.forRoot(
            process.env.MONGODB_URI ||
                'mongodb://admin:123@localhost:27017/gerfinweb?authSource=admin'
        ),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Token.name, schema: TokenSchema },
            { name: Account.name, schema: AccountSchema },
            { name: Movement.name, schema: MovementSchema },
            { name: Template.name, schema: TemplateSchema },
        ]),
    ],
    controllers: [
        PageController,
        TemplateController,
        MovementController,
        AccountController,
        UserController,
    ],
    providers: [
        TemplateService,
        MovementService,
        AccountService,
        UserService,
        TokenService,
    ],
})
export class AppModule {}
