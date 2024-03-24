import {Body, Controller, Delete, Get, Param, Post, Query} from '@nestjs/common';
import {formatInTimeZone} from 'date-fns-tz';

import {ReservationService} from './reservation.service';
import {ReservationDto, SearchReservationParams} from "./reservatiom.interfaces";

@Controller('api')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Post('client/reservations/')
    async add(@Body() body: ReservationDto) {
        const reservation = await this.reservationService.addReservation({
            ...body,
            dateStart: new Date(
                formatInTimeZone(
                    body.dateStart,
                    'Europe/Moscow',
                    'yyyy-MM-dd',
                )
            ),
            dateEnd: new Date(
                formatInTimeZone(
                    body.dateEnd,
                    'Europe/Moscow',
                    'yyyy-MM-dd'
                )
            ),
        });

        return {
            dateStart: reservation.dateStart,
            dateEnd: reservation.dateEnd,
            hotelRoom: reservation.roomId,
            hotel: reservation.hotel,
        };
    }

    @Get('reservations/hotel-room/:roomId')
    async reservationHotelRoom(@Param() params: { roomId: string }) {
        return await this.reservationService
            .getReservations({
                roomId: params.roomId,
            })
            .then((res) =>
                res.map((item) => {
                    return [item.dateStart, item.dateEnd];
                }),
            );
    }

    @Get('/reservations/:id')
    async getReservationClient(@Param() params: { id: string }) {
        return await this.reservationService.getReservations({
            userId: params.id,
        });
    }

    @Delete('/reservations/:id')
    async removeReservation(@Param() params: { id: string }) {
        await this.reservationService.removeReservation(params.id);
    }
}