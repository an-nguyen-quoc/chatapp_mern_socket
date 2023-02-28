const asyncHandler = require('express-async-handler');

const Chat = require('../models/chat');
const User = require('../models/user');

const accessChat = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ message: 'No user id provided' });
    next(new Error('No user id provided'));
  }

  let isChatExist = await Chat.find({
    isGroup: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChatExist = await User.populate(isChatExist, {
    path: 'latestMessage.sender',
    select: '-password',
  });

  if (isChatExist.length > 0) {
    res.status(200).json(isChatExist[0]);
  } else {
    const chatData = {
      chatName: 'sender',
      isGroup: false,
      users: [userId, req.user._id],
    };
    try {
      const newChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: newChat._id }).populate(
        'users',
        '-password'
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).json({ message: error.toString() });
    }
  }
});

const fetchAllChats = asyncHandler(async (req, res, next) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .limit(10);

    const fullChats = await User.populate(chats, {
      path: 'latestMessage.sender',
      select: '-password',
    });

    res.status(200).json(fullChats);
  } catch (error) {
    res.status(400).json({ message: error.toString() });
    next(new Error(error.toString()));
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: 'Please Fill all the feilds' });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send('More than 2 users are required to form a group chat');
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(removed);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    res.status(404);
    throw new Error('Chat Not Found');
  } else {
    res.json(added);
  }
});

module.exports = {
  accessChat,
  fetchAllChats,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
