import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Message } from './message.model';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest {
    _id: mongoose.Types.ObjectId;

    @Prop({ required: true, ref: 'User' })
    public userId: mongoose.Types.ObjectId;

    @Prop({ required: true })
    public createdAt: Date;

    @Prop({ required: true })
    public theme: string;

    @Prop()
    public messages: Message[];

    @Prop()
    public isActive: boolean;
}

export const SupportRequestSchema = SchemaFactory.createForClass(SupportRequest);