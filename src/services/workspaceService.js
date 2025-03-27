import { v4 as uuidv4 } from 'uuid';

import workspaceRepository from "../repositories/workspaceRepository.js"

export const createWorkspaceService = async (workspaceData) => {
        const joinCode = uuidv4().substring(0,6).toUpperCase();
        console.log("this is joincode", joinCode);
        
        const response = await workspaceRepository.create({
            name: workspaceData.name,
            description: workspaceData.description,
            joinCode
   } );

   await workspaceRepository.addMemberToWorkspace(
    response._id, 
    workspaceData.owner,
    'admin'
   );


   await workspaceRepository.addChannelToWorkspace( response._id, 'general');
   
   return response;
};