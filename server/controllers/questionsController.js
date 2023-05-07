const db = require("../models/");

const getQuestions = async ({
  searchText,
  unansweredOnly,
  sortOption,
  currentPage,
  pageSize,
  selectedCategory,
}) => {
  const options = {};
  const scoreOptions = {};
  let sortOptions = {};

  if (unansweredOnly) {
    options.isAnswered = false;
  }
  if (searchText) {
    options["$text"] = { $search: searchText };
    scoreOptions["score"] = { $meta: "textScore" };
  }
  if (selectedCategory) {
    options.category = selectedCategory;
  }
  switch (sortOption) {
    case "newest-first":
      sortOptions = { date: -1 };
      break;
    case "oldest-first":
      sortOptions = { date: 1 };
      break;
    default:
    case "relevance":
      sortOptions = { score: -1, date: -1 };
      break;
  }

  const questions = await db.Question.find(options, { ...scoreOptions })
    .populate(["author", "category"])
    .sort(sortOptions)
    .skip(currentPage * pageSize)
    .limit(pageSize)
    .exec();

  const questionsCount = await db.Question.count(options).exec();

  return { questions, questionsCount };
};

const getQuestionById = async (questionId) => {
  const question = await db.Question.findById(questionId)
    .populate(["author", "category"])
    .exec();

  return question;
};

const addQuestion = async (userId, { title, description }) => {
  try {
    const newQuestion = new db.Question();

    newQuestion.title = title;
    newQuestion.description = description;
    newQuestion.author = userId;

    await newQuestion.save();

    return { success: true, questionId: newQuestion._id };
  } catch (err) {
    return { success: false, errors: db.mapErrors(err.errors) };
  }
};

const updateQuestion = async (questionId, userId, { title, description }) => {
  try {
    const question = await db.Question.findOne({
      _id: questionId,
      author: userId,
    }).exec();

    question.title = title;
    question.description = description;

    await question.save();

    return { success: true };
  } catch (err) {
    return { success: false, errors: db.mapErrors(err.errors) };
  }
};

const questionsController = {
  getQuestions,
  getQuestionById,
  addQuestion,
  updateQuestion,
};

module.exports = questionsController;
