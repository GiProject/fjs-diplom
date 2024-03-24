import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    public author: mongoose.Types.ObjectId;

    @Prop({ required: true })
    public sentAt: Date;

    @Prop({ required: true })
    public text: string;

    @Prop()
    public readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);