import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import {Model} from 'mongoose';
import {ID, IHotelRoomService, SearchRoomsParams} from '../hotel/hotel.interfaces';
import {HotelRoom, HotelRoomDocument} from './hotel.room.model';

@Injectable()
export class HotelRoomService implements IHotelRoomService {
    constructor(
        @InjectModel(HotelRoom.name)
        private HotelRoomModel: Model<HotelRoomDocument>,
    ) {}

    public async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
        const hotelRoom = new this.HotelRoomModel(data);
        await hotelRoom.save();
        return hotelRoom.populate([
            {
                path: 'hotel',
                transform: function (value) {
                    return {
                        id: value._id,
                        title: value.title,
                        description: value.description,
                    };
                },
            },
        ]);
    }

    public async findById(id: ID): Promise<HotelRoom> {
        return this.HotelRoomModel.findById(id)
            .select('-__v -createdAt -updatedAt')
            .populate({
                path: 'hotel',
                transform: function (value) {
                    return {
                        id: value._id,
                        title: value.title,
                        description: value.description,
                    };
                },
            });
    }

    async search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
        if (params.isEnabled === undefined) {
            delete params.isEnabled;
        }
        return await this.HotelRoomModel.find(params)
            .populate("hotel")
            .select("-__v")
            .exec();
    }


    public async update(
        id: ID,
        data: Partial<HotelRoom>,
    ): Promise<HotelRoom> {
        return this.HotelRoomModel.findOneAndUpdate(
            {
                _id: new mongoose.Types.ObjectId(id),
            },
            {
                $set: {
                    description: data.description,
                    images: data.images,
                    updatedAt: new Date(),
                },
            },
            {
                new: true,
            },
        );
    }
}