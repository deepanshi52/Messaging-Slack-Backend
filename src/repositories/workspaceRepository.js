import Workpsace from "../schema/workspace.js";
import crudRepository from "./crudRepository.js";

const workpsaceRepository = {
    ...crudRepository(Workpsace),
    getWorkspaceByName: async function(){},
    getWorkspaceByJoinCode: async function(){},
    addMemberToWorkspace: async function(){},
    addChannelToWorkspace: async function(){},
    fetchAllWorkspaceByMemberId: async function(){}
};

export default workpsaceRepository;