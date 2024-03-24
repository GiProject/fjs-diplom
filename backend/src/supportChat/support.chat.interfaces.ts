import {Types} from "mongoose";
import {SupportRequest} from "./support.chat.model";
import {Message} from "./message.model";

export interface ID extends Types.ObjectId {}
export interface CreateSupportRequestDto {
    user: ID;
    text: string;
}

export interface SendMessageDto {
    author: ID;
    supportRequest: ID;
    text: string;
}

export interface MarkMessagesAsReadDto {
    user: ID;
    supportRequest: ID;
    createdBefore: Date;
}

interface GetChatListParams {
    user: ID | null;
    isActive: boolean;
}

export interface ISupportRequestService {
    findSupportRequests(params: { offset: number; limit: number; isActive: boolean }): Promise<SupportRequest[]>;

    sendMessage(data: { author: any; supportRequest: string; text: string }): Promise<Message>;

    getMessages(supportRequest: string): Promise<Message[]>;
    subscribe(
        handler: (supportRequest: SupportRequest, message: Message) => void
    ): () => void;
}

export interface ISupportRequestClientService {
    createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;

    markMessagesAsRead(params: { supportRequest: string; createdBefore: Date; user: any });
    getUnreadCount(supportRequest: ID): Promise<Message[]>;
}

export interface ISupportRequestEmployeeService {
    markMessagesAsRead(params: { supportRequest: string; createdBefore: Date; user: any });
    getUnreadCount(supportRequest: ID): Promise<Message[]>;

    closeRequest(supportRequest: string): Promise<void>;
}

export interface GetSupportRequestDto {
    offset: number;
    limit: number;
    isActive: boolean;
}