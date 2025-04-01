import { StatusCodes } from 'http-status-codes';
import { v4 as uuidv4 } from 'uuid';

import channelRepository from '../repositories/channelRepository.js';
import userRepository from '../repositories/userRepository.js';
import workspaceRepository from "../repositories/workspaceRepository.js";
import ClientError from '../utils/errors/clientError.js';
import ValidationError from '../utils/errors/validationError.js';


const isUserAdminOfWorkspace = (workspace, userId) => {
    if (!workspace || !workspace.members) return false;
  
    const response = workspace.members.find(
      (member) =>
        member.memberId &&
        (member.memberId.toString() === userId ||
          member.memberId._id?.toString() === userId) &&
        member.role === "admin"
    ); 
    console.log(response);
    return response;
  };

  export const isUserMemberOfWorkspace = (workspace, userId) => {

    console.log("checking member for user",userId);
    console.log('Workspace',workspace)
    return workspace.members.find((member) => {
      console.log('member id ', member.memberId.toString());
      return member.memberId._id.toString() === userId;
    });
  };
  

const isChannelAlreadyPartOfWorkspace = (workspace, channelName) => {
    return workspace.channels.find(
        (channel) => channel.name.toLowerCase() === channelName.toLowerCase()
      );
}
export const createWorkspaceService = async (workspaceData) => {
    try {
        const joinCode = uuidv4().substring(0,6).toUpperCase();
        console.log("this is joincode", joinCode);
        
        // First create the workspace without members
        const response = await workspaceRepository.create({
            name: workspaceData.name,
            description: workspaceData.description,
            joinCode
        });

        // Then add the owner as an admin member
        if (workspaceData.owner) {
            await workspaceRepository.addMemberToWorkspace(
                response._id, 
                workspaceData.owner,
                'admin'
            );
        }
   
        // Finally add the general channel
        const updatedWorkspace = await workspaceRepository.addChannelToWorkspace( 
            response._id, 
            'general'
        );
        return updatedWorkspace;
    } catch (error) {
        console.log('Create workspace service error', error);
        if(error.name === 'ValidationError'){
            throw new ValidationError(
                {
                    error:error.errors
                },
                error.message
            );
        } 
        if(error.name ==='MongoServerError' && error.code ===11000){
            throw new ValidationError({
                error:["A workspace with same details already exists "]
            },  'A workspace with same details already exists'
            );
        }
        throw error;  
    }
}

export const getWorkspaceByJoinCodeService = async (joinCode, userId) => {
    try {
      const workspace =
        await workspaceRepository.getWorkspaceByJoinCode(joinCode);
      if (!workspace) {
        throw new ClientError({
          explanation: "No workspace for the given Joincode",
          message: "No workspace for the given Joincode",
          statusCode: StatusCodes.FORBIDDEN
        });
      }
      const isMember = isUserMemberOfWorkspace(workspace, userId);
  
      if (!isMember) {
        throw new ClientError({
          explanation: "User is not a member of the workspace",
          message: "User is not a member of the workspace",
          statusCode: StatusCodes.UNAUTHORIZED
        });
      }
      return workspace;
    } catch (error) {
      console.log("Get workspace ByJoinCode error", error);
      throw error;
    }
  };

export const getWorkspacesUserIsMemberOfService = async (userId) => {
    try {
     const response = await workspaceRepository.fetchAllWorkspaceByMemberId(userId);
     return response;   
    } catch (error) {
        console.log('Get workspaces user is member of service error', error);
        throw error
    };
}

export const deleteWorkspaceService = async (workspaceId, userId) => {
    try {
      const workspace = await workspaceRepository.getById(workspaceId);
  
      if (!workspace) {
        throw new ClientError({
          explanation: "Invalid data sent from the client",
          message: "Workspace not found",
          statusCode: StatusCodes.NOT_FOUND
        });
      }
  
      console.log(workspace.members, userId);
      const isAllowed = isUserAdminOfWorkspace(workspace, userId);
      // const channelIds=workspace.channels.map((channel)=>channel._id);
  
      if (isAllowed) {
        await channelRepository.deleteMany(workspace.channels);
  
        const response = await workspaceRepository.delete(workspaceId);
        return response;
      }
  
      throw new ClientError({
        explanation: "User is either not a member or an admin of a workspace",
        message: "User is not allowed to delete the workspace",
        statusCode: StatusCodes.UNAUTHORIZED
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

export const getWorkspaceService = async (workspaceId, userId) => {
    try {
    const workspace = await workspaceRepository.getById(workspaceId);   
    if(!workspace){
        throw new ClientError({
            explanation: 'Invalid data sent from the client',
            message: 'Workspace not found' ,
            statusCode: StatusCodes.NOT_FOUND
         });     
    }
    const isMember = isUserMemberOfWorkspace(workspace, userId);
    if(!isMember){
        throw new ClientError({
            explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
         });      
    }
    return workspace;
    } catch (error) {
    console.log('Get workspace by joincode service error', error);
    throw error;
           }
}




export const updateWorkspaceService = async (
    workspaceId,
    workspaceData,
    userId
  ) => {
    try {
      const workspace = await workspaceRepository.getById(workspaceId);
      if (!workspace) {
        throw new ClientError({
          explanation: "Invalid data sent from the client",
          message: "Workspace not found",
          statusCode: StatusCodes.NOT_FOUND
        });
      }
  
      const isAdmin = isUserAdminOfWorkspace(workspace, userId);
      if (!isAdmin) {
        throw new ClientError({
          explanation: "User is not an admin of the workspace",
          message: "User is not an admin of the workspace",
          statusCode: StatusCodes.UNAUTHORIZED
        });
      }
  
    const updatedWorkspace = await workspaceRepository.update(
        workspaceId,
        workspaceData
      );
      return updatedWorkspace;
    } catch (error) {
      console.log("update workspace service error", error);
      throw error;
    }
  };

export const addMemberToWorkspaceService  = async (workspaceId, memberId, role,userId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if(!workspace){
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found' ,
                statusCode: StatusCodes.NOT_FOUND
             });   
    }  


    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if(!isAdmin ){
        throw new ClientError({
            explanation: 'User is not the admin of the workspace',
            message: 'User is not the admin of the workspace' ,
            statusCode: StatusCodes.UNAUTHORIZED
         });   
}  


    const isValidUser = await userRepository.getById(memberId);
    if(!isValidUser ){
        throw new ClientError({
            explanation: 'Invalid data sent from the client',
            message: 'Workspace not found' ,
            statusCode: StatusCodes.NOT_FOUND
         });   
}  
    const isMember = isUserMemberOfWorkspace(workspace, memberId);
    if(isMember){
        throw new ClientError({
            explanation: 'User is already a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
         });   
}
    const response = await workspaceRepository.addMemberToWorkspace(workspaceId, memberId, role);
    return response;
    } catch (error) {
        console.log('Update workspace service error', error);
        throw error; 
    }
}



export const addChannelToWorkspaceService = async (workpsaceId, channelName, userId) => {
    try {
        const workspace = await workspaceRepository.getWorkspacedetailsById(workpsaceId)
        if(!workspace){
            throw new ClientError({
                explanation: 'Invalid data sent from the client',
                message: 'Workspace not found' ,
                statusCode: StatusCodes.NOT_FOUND
             });   
    }   
    const isAdmin = isUserAdminOfWorkspace(workspace, userId);
    if(!isAdmin){
        throw new ClientError({
            explanation: 'User is not a member of the workspace',
        message: 'User is not a member of the workspace',
        statusCode: StatusCodes.UNAUTHORIZED
         });   
}
    const isChannelPartOfWorkspace = isChannelAlreadyPartOfWorkspace(
        workspace,
        channelName
    );
    if(isChannelPartOfWorkspace){
        throw new ClientError({
            explanation: 'Invalid data sent from the client',
            message: 'channel already part of workspace',
            statusCode: StatusCodes.NOT_FOUND
         });   
}   
     const response = await workspaceRepository.addChannelToWorkspace(
        workpsaceId,
        channelName
     );
     return response;
    } catch (error) {
        console.log(' addChannelToWorkspaceService error', error);
        throw error;    
    }

}