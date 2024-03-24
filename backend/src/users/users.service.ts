import { Injectable } from "@nestjs/common";
import { User } from "./user.model";
import { ID, IUser, IUserRegistration, IUserService, SearchUserParams, UserReturnInterface } from "./user.interfaces";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Promise } from "mongoose";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectModel(User.name) private readonly User: Model<User>
  ) {
  }

  public async create(data: IUserRegistration) {
    const { password } = data;
    const passwordHash = await bcrypt.hash(
      password,
      parseInt(process.env.APP_SALT)
    );

    const user = new this.User({ ...data, passwordHash: passwordHash });

    return await user.save();
  }

  public async findAll(query: SearchUserParams): Promise<UserReturnInterface> {
    const { email, name, contactPhone } = query;
    const findParams = {
      '$or': [
        {email: { $regex: new RegExp(email, "i") }},
        {name: { $regex: new RegExp(name, "i") }},
        {contactPhone: { $regex: new RegExp(contactPhone, "i") }}
      ]
    };

    const count = await this.User.find(findParams, "-passwordHash").countDocuments().exec();
    const users = await this.User.find(findParams, "-passwordHash").skip(query.offset).limit(query.limit);

    return {
      count: count,
      users: users
    };
  }

  public async findByEmail(email: string): Promise<User> {
    return this.User.findOne({ email: email }).select("-__v");
  }

  findById(id: ID): Promise<IUser> {
    throw new Error("Method not implemented.");
  }

}