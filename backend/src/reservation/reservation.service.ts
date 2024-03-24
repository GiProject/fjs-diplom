import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Reservation, ReservationDocument} from './reservation.model';
import {ReservationDto, ReservationSearchOptions, IReservation} from './reservatiom.interfaces'

@Injectable()
export class ReservationService implements IReservation {
    constructor(
        @InjectModel(Reservation.name)
        private ReservationModel: Model<ReservationDocument>,
    ) {
    }

    public async addReservation(data: ReservationDto) {
        const checkReservationDays = await this.getReservations({
            roomId: data.roomId,
            dateStart: data.dateStart,
            dateEnd: data.dateEnd,
        });

        if (checkReservationDays.length === 0) {
            const reservation = await this.ReservationModel.create(data);
            await reservation.populate([
                {
                    path: 'roomId',
                    transform: function (value) {
                        return {
                            description: value.description,
                            images: value.images,
                        };
                    },
                },
                {
                    path: 'hotel',
                    transform: function (value) {
                        return {
                            title: value.title,
                            description: value.description,
                            images: value.images,
                        };
                    },
                },
            ]);

            return reservation;
        } else {
            throw new HttpException({}, HttpStatus.BAD_REQUEST);
        }
    }

    public async removeReservation(id: string) {
        await this.ReservationModel.findByIdAndDelete(id);
    }

    public async getReservations(
        filter: ReservationSearchOptions,
    ) {
        let reservation: Reservation[] | PromiseLike<Reservation[]>;

        if (filter.roomId && filter.dateStart && filter.dateEnd) {
            reservation = await this.ReservationModel.find({
                roomId: filter.roomId,
                $and: [
                    {
                        $or: [
                            {
                                dateStart: {$gte: filter.dateStart, $lte: filter.dateEnd},
                            },
                            {
                                dateEnd: {$gte: filter.dateStart, $lte: filter.dateEnd},
                            },
                        ],
                    },
                ],
            });
        }

        if (filter.roomId && !filter.dateStart && !filter.dateEnd) {
            reservation = await this.ReservationModel.find({
                roomId: filter.roomId,
            });
        }

        if (filter.userId && filter.dateStart && filter.dateEnd) {
            reservation = await this.ReservationModel.find({
                userId: filter.userId,
                $and: [
                    {
                        $or: [
                            {
                                dateStart: {$gte: filter.dateStart, $lte: filter.dateEnd},
                            },
                            {
                                dateEnd: {$gte: filter.dateStart, $lte: filter.dateEnd},
                            },
                        ],
                    },
                ],
            });
        }

        if (filter.userId && !filter.dateStart && !filter.dateEnd) {
            reservation = await this.ReservationModel.find({
                userId: filter.userId,
            }).populate([
                {
                    path: 'roomId',
                    transform: function (value) {
                        return {
                            description: value.description,
                            images: value.images,
                        };
                    },
                },
                {
                    path: 'hotel',
                    transform: function (value) {
                        return {
                            title: value.title,
                            description: value.description,
                            images: value.images,
                        };
                    },
                },
            ]);
        }

        if (
            !filter.userId &&
            !filter.roomId &&
            !filter.dateStart &&
            !filter.dateEnd
        ) {
            reservation = await this.ReservationModel.find({})
                .skip(filter.offset)
                .limit(filter.limit)
                .select('-__v')
                .populate([
                    {
                        path: 'roomId',
                        transform: function (value) {
                            return {
                                description: value.description,
                                images: value.images,
                            };
                        },
                    },
                    {
                        path: 'hotel',
                        transform: function (value) {
                            return {
                                title: value.title,
                                description: value.description,
                                images: value.images,
                            };
                        },
                    },
                ]);
        }

        if (
            !filter.userId &&
            !filter.roomId &&
            filter.dateStart &&
            filter.dateEnd
        ) {
            reservation = await this.ReservationModel.find({
                $or: [
                    {
                        dateStart: {$gte: filter.dateStart, $lte: filter.dateEnd},
                    },
                    {
                        dateEnd: {$gte: filter.dateStart, $lte: filter.dateEnd},
                    },
                ],
            })
                .select('-__v')
                .populate([
                    {
                        path: 'roomId',
                        transform: function (value) {
                            return {
                                id: value._id,
                            };
                        },
                    },
                ]);
        }
        return reservation;
    }
}