import { Body, Controller, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { destinationhotelRoom, editFileName } from "../lib/file-upload";
import { HotelRoomService } from "./hotel.room.service";

import * as mongoose from "mongoose";
import { HotelService } from "../hotel/hotel.service";
import { ICreateHotelRoomDto, ID, SearchRoomsParams } from "../hotel/hotel.interfaces";

@Controller("api")
export class HotelRoomController {
  constructor(
    private readonly hotelRoomService: HotelRoomService,
    private readonly hotelService: HotelService
  ) {
  }

  @Get("/hotels-rooms")
  async searchRooms(@Query() query: SearchRoomsParams) {
    const search = await this.hotelRoomService.search({ ...query, hotel: new mongoose.Types.ObjectId(query.hotel) });

    return search.map((item) => ({
      id: item._id.toString(),
      description: item.description
    }));
  }

  @Post("/hotels/:hotelId/rooms")
  @UseInterceptors(
    FilesInterceptor("files", 10, {
      storage: diskStorage({
        destination: destinationhotelRoom,
        filename: editFileName
      })
    })
  )
  async create(
    @Param() params: {
      hotelId: ID
    },
    @Body() body: ICreateHotelRoomDto,
    @UploadedFiles() files
  ) {

    const hotel = await this.hotelService.findById(params.hotelId);
    const data = {
      hotel: hotel._id,
      description: body.description,
      images: files.map((file) => file.originalname),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const hotelRoom = await this.hotelRoomService.create(data);

    return {
      id: hotelRoom._id.toString(),
      description: hotelRoom.description,
      images: hotelRoom.images,
      isEnabled: hotelRoom.isEnabled,
      hotel: hotelRoom.hotel
    };
  }
}