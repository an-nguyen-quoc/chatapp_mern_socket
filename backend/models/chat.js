const moongose = require('mongoose');

const chatSchema = new moongose.Schema(
  {
    chatName: { type: String, required: true, trim: true },
    isGroupChat: { type: Boolean, required: true, default: false },
    users: [
      {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    latestMessage: {
      type: moongose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: moongose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

const Chat = moongose.model('Chat', chatSchema);

module.exports = Chat;
