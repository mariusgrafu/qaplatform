const db = require("../models/");
const {
  POINTS_SUGGEST_EDIT,
  POINTS_ANSWER,
  POINTS_BEST_ANSWER,
} = require("./userController");
const userController = require("./userController");

const getAnswersByQuestionId = async ({
  questionId,
  currentPage,
  pageSize,
}) => {
  const answers = await db.Answer.find({ question: questionId })
    .populate([
      { path: "author" },
      {
        path: "appliedSuggestion",
        populate: {
          path: "author",
        },
      },
      {
        path: "suggestions",
        populate: {
          path: "author",
        },
      },
    ])
    .sort([
      ["isBestAnswer", -1],
      ["date", -1],
    ])
    .skip(currentPage * pageSize)
    .limit(pageSize)
    .exec();

  const answersCount = await db.Answer.count({ question: questionId }).exec();

  return { answers, answersCount };
};

const addAnswer = async (userId, { content, questionId }) => {
  try {
    const newAnswer = new db.Answer();

    newAnswer.author = userId;
    newAnswer.question = questionId;
    newAnswer.content = content;

    await newAnswer.save();

    const question = await db.Question.findOne({ _id: questionId }).exec();
    if (!question.author.equals(userId)) {
      userController.addPointsToUser(userId, POINTS_ANSWER);
    }

    return { success: true, answerId: newAnswer._id };
  } catch (err) {
    return { success: false, errors: db.mapErrors(err.errors) };
  }
};

const editAnswer = async (userId, { content, answerId }) => {
  try {
    const answer = await db.Answer.findOne({
      _id: answerId,
      author: userId,
    }).exec();

    answer.content = content;
    await answer.save();

    return { success: true };
  } catch (err) {
    return { success: false, errors: db.mapErrors(err.errors) };
  }
};

const toggleBestAnswer = async (userId, { answerId, questionId }) => {
  const question = await db.Question.findOne({ _id: questionId }).exec();

  if (!question) {
    throw new Error("Question not found.");
  }

  const answer = await db.Answer.findOne({
    _id: answerId,
    question: questionId,
  }).exec();

  if (!answer) {
    throw new Error("Answer not found.");
  }
  if (answer.author === userId) {
    throw new Error("Author cannot assign best answer to themselves.");
  }

  const bestAnswer = await db.Answer.findOne({
    question: questionId,
    isBestAnswer: true,
  }).exec();

  if (bestAnswer) {
    if (bestAnswer._id.equals(answer._id)) {
      answer.isBestAnswer = false;
    } else {
      bestAnswer.isBestAnswer = false;
      answer.isBestAnswer = true;
      userController.addPointsToUser(answer.author, POINTS_BEST_ANSWER);
      userController.addPointsToUser(bestAnswer.author, -1 * POINTS_BEST_ANSWER);
      await bestAnswer.save();
    }
  } else {
    answer.isBestAnswer = true;
    userController.addPointsToUser(answer.author, POINTS_BEST_ANSWER);
  }

  question.isAnswered = answer.isBestAnswer;

  await Promise.all([answer.save(), question.save()]);
};

const addSuggestion = async (userId, { content, answerId }) => {
  try {
    const answer = await db.Answer.findOne({ _id: answerId }).exec();

    if (answer.author.equals(userId)) {
      return { success: false };
    }

    const question = await db.Question.findOne({ _id: answer.question }).exec();

    if (question.author.equals(userId)) {
      return { success: false };
    }

    const suggestion = new db.Suggestion();
    suggestion.author = userId;
    suggestion.answer = answerId;
    suggestion.content = content;

    answer.suggestions = [suggestion._id, ...answer.suggestions];

    await Promise.all([
      suggestion.save(),
      answer.save(),
      userController.addPointsToUser(userId, POINTS_SUGGEST_EDIT),
    ]);

    return { success: true };
  } catch (err) {
    return { success: false, errors: db.mapErrors(err.errors) };
  }
};

const acceptSuggestion = async (userId, {suggestionId}) => {
  try {
    const suggestion = await db.Suggestion.findOne({_id: suggestionId});
    const answer = await db.Answer.findOne({_id: suggestion.answer});
    const question = await db.Question.findOne({_id: answer.question});

    if (!answer.author.equals(userId) && !question.author.equals(userId)) {
      return {success: false};
    }

    suggestion.isAccepted = true;
    answer.appliedSuggestion = suggestion._id;

    await Promise.all([suggestion.save(), answer.save()]);

    return {success: true};
  } catch (err) {
    return {success: false, errors: db.mapErrors(err.errors)}
  }
};

const answersController = {
  addAnswer,
  getAnswersByQuestionId,
  toggleBestAnswer,
  editAnswer,
  addSuggestion,
  acceptSuggestion,
};

module.exports = answersController;
