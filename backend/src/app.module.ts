import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {UsersModule} from './users/users.module';
import {AuthModule} from "./auth/auth.module";
import {AuthController} from "./auth/auth.controller";
import {AuthService} from "./auth/auth.service";
import {PassportModule} from "@nestjs/passport";
import {HotelModule} from "./hotel/hotel.module";
import {HotelRoomModule} from "./hotelRoom/hotel.room.module";
import {ReservationModule} from "./reservation/reservation.module";
import {NestjsFormDataModule} from "nestjs-form-data";
import {JwtModule} from "@nestjs/jwt";

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGO_URL),
        UsersModule,
        AuthModule,
        PassportModule,
        HotelModule,
        HotelRoomModule,
        ReservationModule,
        NestjsFormDataModule,
        JwtModule.register({secret: 'secret'}),
    ],
    controllers: [
        AppController,
        AuthController,
    ],
    providers: [
        AppService,
        AuthService

    ],
    exports: [AuthService],
})
export class AppModule {
}
