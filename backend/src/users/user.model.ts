import {HydratedDocument, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop()
    email: string;

    @Prop()
    passwordHash: string;

    @Prop()
    name: string;

    @Prop()
    contactPhone: string;

    @Prop({ required: true, default: 'client' })
    public role: string;
    _id: any;

}

export const UserSchema = SchemaFactory.createForClass(User);