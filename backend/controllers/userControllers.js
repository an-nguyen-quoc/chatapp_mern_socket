const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const generateToken = require('../utils/generateToken');

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    next(new Error('Please fill all the fields'));
  }

  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400).json({ message: 'User already exists' });
    next(new Error('User already exists'));
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: '',
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
    next(new Error('Invalid user data'));
  }
});

const authUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Please fill all the fields' });
    next(new Error('Please fill all the fields'));
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      picture: '',
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
    next(new Error('Invalid email or password'));
  }
});

const getAllUsers = asyncHandler(async (req, res, next) => {
  const keyword = req.query.search || '';
  const users = await User.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } },
    ],
  });
  res.json(users);
});

module.exports = { registerUser, authUser, getAllUsers };
