import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    public userId: mongoose.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' })
    public hotel: mongoose.ObjectId;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HotelRoom',
    })
    public roomId: mongoose.ObjectId;

    @Prop({ required: true })
    public dateStart: Date;

    @Prop({ required: true })
    public dateEnd: Date;

    _doc: any;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);