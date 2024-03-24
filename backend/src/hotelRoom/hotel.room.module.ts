import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from './hotel.room.model';
import { HotelModule } from '../hotel/hotel.module';
import { HotelRoomController } from './hotelRoom.controller';
import { HotelRoomService } from './hotel.room.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: HotelRoom.name, schema: HotelRoomSchema },
        ]),
        HotelModule,
    ],
    controllers: [HotelRoomController],
    providers: [HotelRoomService],
    exports: [HotelRoomService],
})
export class HotelRoomModule {}