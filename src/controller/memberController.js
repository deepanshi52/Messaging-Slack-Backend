import { StatusCodes } from "http-status-codes";

import { isMemberPartOfWorkspaceService } from "../services/memberService.js";
import { customErrorResponse, internalErrorResponse, successResponse } from "../utils/common/responseObjects.js";

export const isMemberPartOfWorkspaceController = async function(req, res){
    try {
       const response = isMemberPartOfWorkspaceService(req.params.wotkspaceId,
         req.user); 
         return res.status(StatusCodes.OK).json(successResponse(response));
    } catch (error) {
      console.log('User controller error');
         if(error.statusCode){
          return res.status(error.statusCode).json(customErrorResponse(error));
             }
             return res
             .status(StatusCodes.INTERNAL_SERVER_ERROR)
             .json(internalErrorResponse(error));     
    }
}