import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import {HotelService} from './hotel.service';
import {FilesInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {destination, editFileName} from '../lib/file-upload';
import {ID, UpdateHotelParams, ICreateHotelRoomDto, SearchHotelParams, ICreateHotelDto} from "./hotel.interfaces";
import {FormDataRequest, NestjsFormDataModule} from "nestjs-form-data";

@Controller('api')
export class HotelController {
    constructor(private readonly hotelService: HotelService) {
    }


    @Post('/hotels')
    @UseInterceptors(FilesInterceptor('images', 6))
    async create(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() createHotelDto: ICreateHotelDto,
    ) {
        console.log(images);
        console.log(createHotelDto);
        // console.log(createHotelDto);
        // const hotel = await this.hotelService.create(createHotelDto);
        // return {
        //     id: hotel._id,
        //     title: hotel.title,
        //     description: hotel.description,
        // };
    }

    @Get('/hotels')
    async search(@Query() query: SearchHotelParams) {
        return await this.hotelService.search(query);
    }

    @Get('/hotels/:id')
    async findOne(@Param() params: {
        id: ID
    }) {
        return await this.hotelService.findById(params.id);
    }

    @Put('/hotels/:id')
    @UseInterceptors(
        FilesInterceptor('files', 10, {
            storage: diskStorage({
                destination: destination,
                filename: editFileName,
            }),
        }),
    )
    async putUpdateHotel(@Param() params: {
        id: ID
    }, @Body() body: UpdateHotelParams) {
        await this.hotelService.update(params.id, body);
    }
}