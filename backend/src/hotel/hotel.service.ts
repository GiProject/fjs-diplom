import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import { Model, Promise } from "mongoose";
import {Hotel, HotelDocument} from './hotel.model';
import { HotelReturnInterface, ID, IHotelService, SearchHotelParams, UpdateHotelParams } from "./hotel.interfaces";
import { UserReturnInterface } from "../users/user.interfaces";

@Injectable()
export class HotelService implements IHotelService {
    constructor(
        @InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>,
    ) {
    }

    public async create(data: any): Promise<Hotel> {
        const hotel = new this.HotelModel(data);
        return await hotel.save();
    }

    public async findById(id: ID): Promise<Hotel> {
        return this.HotelModel.findById(id).select(
            '-__v -createdAt -updatedAt',
        );
    }

    public async search(params: SearchHotelParams): Promise<HotelReturnInterface> {

        const query = {
            title: {$regex: new RegExp(params.title, "i") },
        };

        const count = await this.HotelModel.find(query).countDocuments().exec();
        const hotels = await this.HotelModel.find(query)
          .skip(params.offset)
          .limit(params.limit)
          .select('-__v -createdAt -updatedAt');

        return {
            count: count,
            hotels: hotels,
        };
    }

    public async update(id: ID, data: UpdateHotelParams): Promise<Hotel> {
        return this.HotelModel.findOneAndUpdate(
            {
                _id: id,
            },
            {
                $set: {
                    title: data.title,
                    description: data.description,
                    images:
                        data.images.length === 0 ? [] : [...data.images.split(',')],
                    updatedAt: new Date(),
                },
            },
            {
                new: true,
            },
        );
    }
}