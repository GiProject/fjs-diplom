import {Body, Controller, Get, HttpStatus, Param, Post, Query, Req,} from '@nestjs/common';
import {HttpException} from '@nestjs/common/exceptions';
import {EventEmitter2} from '@nestjs/event-emitter';
import {
    CreateSupportRequestDto,
    GetSupportRequestDto,
    ISupportRequestClientService,
    ISupportRequestEmployeeService,
    ISupportRequestService
} from "./support.chat.interfaces";

@Controller('api')
export class ReservationController {
    constructor(
        private readonly supportRequestClient: ISupportRequestClientService,
        private readonly supportRequestService: ISupportRequestService,
        private readonly supportRequestEmployeeService: ISupportRequestEmployeeService,
        private eventEmitter: EventEmitter2,
    ) {
    }

    @Post('/client/support-requests/')
    async createSupportRequest(@Body() body: CreateSupportRequestDto) {
        const supportRequest = await this.supportRequestClient.createSupportRequest(
            body,
        );
        this.eventEmitter.emit('support.created', 'Новое обращение');

        return {
            id: supportRequest.userId.toString(),
            createdAt: supportRequest.userId,
            isActive: supportRequest.isActive,
            hasNewMessages: true,
        };
    }

    @Get('/client/support-requests/')
    async getSupportRequestClient(
        @Req() req: any,
        @Query() query: GetSupportRequestDto,
    ) {
        const supportRequest = await this.supportRequestService.findSupportRequests({
            ...query
        });

        return supportRequest.map((item) => {
            return {
                id: item._id,
                createdAt: item.createdAt,
                isActive: item.isActive,
                theme: item.theme,
                hasNewMessages: item.messages.some(
                    (item) => item.author?.toString() !== req.user?.id && !item.readAt,
                ),
            };
        });
    }

    @Get('/manager/support-requests/')
    async getManagerSupportRequestClient(
        @Req() req: any,
        @Query() query: GetSupportRequestDto,
    ) {
        const result: any = await this.supportRequestService.findSupportRequests({
            ...query,
        });

        return result.map((item: { _id: any; createdAt: any; isActive: any; theme: any; messages: any[]; userId: { _id: any; email: any; name: any; contactPhone: any; }; }) => {
            return {
                id: item._id,
                createdAt: item.createdAt,
                isActive: item.isActive,
                theme: item.theme,
                hasNewMessages: item.messages.some(
                    (item) => item.author.toString() !== req.user?.id && !item.readAt,
                ),
                client: {
                    id: item.userId._id,
                    email: item.userId.email,
                    name: item.userId.name,
                    contactPhone: item.userId.contactPhone,
                },
            };
        });
    }

    @Get('/common/support-requests/:id/messages')
    async getHistoryMessageSupportRequest(
        @Req() req: any,
        @Param() params: { id: string },
    ) {
        const messages = await this.supportRequestService.getMessages(params.id);

        const validateUser = messages.some(
            (item) => item.author._id.toString() === req.user?.id,
        );

        if (req.user && req.user.role === 'client' && validateUser) {
            return messages;
        } else if (req.user && req.user.role === 'client' && !validateUser) {
            throw new HttpException(
                {
                    status: HttpStatus.FORBIDDEN,
                    error: 'Данный пользоветель не создавал обращение',
                },
                HttpStatus.FORBIDDEN,
            );
        }

        return messages;
    }

    @Post('/common/support-requests/:id/messages')
    async sendMessage(
        @Body() body: { text: string },
        @Req() req: any,
        @Param() params: { id: string },
    ) {
        const messages = await this.supportRequestService.sendMessage({
            author: req.user?.id,
            supportRequest: params.id,
            text: body.text,
        });

        this.eventEmitter.emit(`sendMessage.${params.id}`, messages);
    }

    @Post('/common/support-requests/:id/messages/read')
    async readMessage(
        @Body() body: { createdBefore: Date },
        @Req() req: any,
        @Param() params: { id: string },
    ) {
        if (req.user?.role === 'client') {
            await this.supportRequestClient.markMessagesAsRead({
                user: req.user.id,
                supportRequest: params.id,
                createdBefore: body.createdBefore,
            });
        }

        if (req.user?.role === 'manager') {
            await this.supportRequestEmployeeService.markMessagesAsRead({
                user: req.user.id,
                supportRequest: params.id,
                createdBefore: body.createdBefore,
            });
        }
    }

    @Post('/common/support-requests/close/:id')
    async closeRequest(@Param() params: { id: string }) {
        await this.supportRequestEmployeeService.closeRequest(params.id);
    }
}