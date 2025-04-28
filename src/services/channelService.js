import { StatusCodes } from "http-status-codes";

import channelRepository from "../repositories/channelRepository.js";
import messageRepository from "../repositories/messageRepository.js";
import ClientError from "../utils/errors/clientError.js";
import { isUserMemberOfWorkspace } from "./workspaceService.js";

export const getChannelByIdService = async (channelId, userId) => {
    try {
     const channel = await channelRepository.getChannelWithWorkspaceDetails(channelId);
     console.log(channel);

     if(!channel || !channel.workspaceId){
        throw new ClientError({
        message: 'Channel not found with provided ID' ,
        explanation: 'Invalid data sent from the client',
        statuscode: StatusCodes.NOT_FOUND
        });
    }    
    const isUserPartOfWorkspace = isUserMemberOfWorkspace(
        channel.workspaceId,
        userId
    ); 
    if(!isUserPartOfWorkspace){
        throw new ClientError({
            explanation: "User is not a member of the workspace and hence cannot accesss the channel",
            message: "User is not a member of the workspace",
            statusCode: StatusCodes.UNAUTHORIZED
          });
    }
    const messages = await messageRepository.getPaginatedMessages(
        {
        channelId
    }, 
    1, 
    20
);
    channel.messages = messages;
    return {
        messages,
        _id: channel._id,
        name: channel.name,
        createdAt: channel.createdAt,
        updatedAt: channel.updatedAt,
        workspaceId: channel.workspaceId
    }
    } catch (error) {
     console.log('Get channel by ID service error');
     throw error;
    }
}