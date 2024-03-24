import { Promise, Types } from "mongoose";
import { User } from "./user.model";

export interface ID extends Types.ObjectId {
}

export interface IUser {
  email: string;
  name: string;
  contactPhone: string;
  role: string;
  passwordHash: string;
}

export interface SearchUserParams {
  limit: number;
  offset: number;
  email: string;
  name: string;
  contactPhone: string;
}

export interface SearchUserInputParams {
  limit: number;
  offset: number;
  query: string;
}

export interface UserReturnInterface {
  count: number,
  users: User[]
}

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUser>;

  findById(id: ID): Promise<IUser>;

  findByEmail(email: string): Promise<IUser>;

  findAll(params: SearchUserParams): Promise<UserReturnInterface>;
}

export interface CreateUserDto {
  email: string;
  name: string;
  phone?: string;
}

export interface IUserRegistration {
  email: string;
  name: string;
  phone: string;
  password: string;
}
