import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Workpsace name is required'],
        unique: true
    },
    description: {
        type: String,
    },
    members: [
    {
      membersId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      role:  {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
      }
    }
  ],
  joincode: {
    type: String,
    required: [true, 'join code is required']
  },
  channels: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }
]
})

const Workpsace = mongoose.model('Workspace', workspaceSchema)

export default Workpsace;