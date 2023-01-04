const firebaseAdmin = require("../firebaseAdmin");
const db = require("../models/");

const POINTS_ANSWER = 20;
const POINTS_BEST_ANSWER = 50;
const POINTS_SUGGEST_EDIT = 10;

const registerUser = async ({ email, displayName, password }) => {
  const result = await firebaseAdmin.auth().createUser({
    email,
    password,
    displayName,
  });

  const newUser = new db.User();
  newUser.uid = result.uid;
  newUser.email = email;
  newUser.displayName = displayName;

  await newUser.save();
};

const verifyToken = async (token) => {
  const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
  return decodedToken || null;
};

const getUserIdFromUid = async (uid) => {
  const user = await db.User.findOne({ uid }).exec();

  return user?._id;
};

const addPointsToUser = async (userId, points) => {
  const user = await db.User.findOne({ _id: userId }).exec();

  user.points += points;

  await user.save();
};

const userController = {
  registerUser,
  verifyToken,
  getUserIdFromUid,
  addPointsToUser,

  POINTS_ANSWER,
  POINTS_BEST_ANSWER,
  POINTS_SUGGEST_EDIT,
};

module.exports = userController;
