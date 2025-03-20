import mongoose  from "mongoose";


const messageSchema = new mongoose.Schema({
    body: {
        type: String,
        required: [true, 'Message body is required']
    },
    image: {
        type: String
    },
    channelId: {
        types: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: [true, 'Channel ID is required']
    },
    senderId: {
        types: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Sender ID is required']
    },
    workpsaceId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Workspace',
         required: [true,'Workspace ID is required']

    }
});

const Message = mongoose.model('Message', messageSchema)

export default Message;