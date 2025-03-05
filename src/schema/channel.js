import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema(
    {
    name: {
        type: string,
        required: [true, 'Channel name is required'],
    }
},
  {timestamps: true}
);

const Channel = mongoose.model('Channel', channelSchema);

export default Channel;