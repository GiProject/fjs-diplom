import {Hotel} from "./hotel.model";
import { Promise, Types } from "mongoose";
import {HotelRoom} from "../hotelRoom/hotel.room.model";
import { User } from "../users/user.model";

export interface ID extends Types.ObjectId {}
export interface SearchHotelParams {
    limit: number;
    offset: number;
    title: string;
}

export interface UpdateHotelParams {
    title: string;
    description: string;
    images: string;
    files: File[];
}
export interface IHotelService {
    create(data: any): Promise<Hotel>;
    findById(id: ID): Promise<Hotel>;
    search(params: SearchHotelParams):  Promise<HotelReturnInterface>;
    update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}

export interface SearchRoomsParams {
    hotel: ID;
    limit?: number;
    offset?: number;
    isEnabled?: boolean;
}

export interface IHotelRoomService {
    create(data: Partial<HotelRoom>): Promise<HotelRoom>;
    findById(id: ID): Promise<HotelRoom>;
    search(params: SearchRoomsParams): Promise<HotelRoom[]>;
    update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}

export interface ICreateHotelDto {
    title: string;
    description: string;
}

export interface ICreateHotelRoomDto {
    id: string;
    description: string;
}

export interface HotelReturnInterface {
    count: number,
    hotels: Hotel[]
}
