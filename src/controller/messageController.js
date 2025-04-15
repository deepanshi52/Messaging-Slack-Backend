import { StatusCodes } from "http-status-codes";
import { customErrorResponse,
     internalErrorResponse, 
     successResponse } from "../utils/common/responseObjects.js";
import { getMessagesService } from "../services/messageService.js";

export const getMessages = async(req,res) => {
  try {
       const messages = await getMessagesService({
        channelId: req.query.channelId
       },  
       req.query.page  || 1,
       req.query.limit || 20,
       req.user
       );
       return res
       .status(StatusCodes.OK)
       .json(successResponse(messages,'Messages fetched successfully')); 
  }catch (error) {
          console.log("User controller error",error);
          if(error.StatusCodes){
              return res.status(error.StatusCodes).json(customErrorResponse(error));
          }
          return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(internalErrorResponse(error));
      }  
}