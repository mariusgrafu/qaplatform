const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const removeMd = require("remove-markdown");

const CONTENT_MIN_CHAR = 10;
const CONTENT_MAX_CHAR = 2000;

const AnswerSchema = new Schema({
  author: {
    type: ObjectId,
    requried: true,
    ref: "User",
  },
  question: {
    type: ObjectId,
    requried: true,
    ref: "Question",
  },
  content: {
    type: String,
    required: [true, "Answer's content is required!"],
    validate: {
      validator: (value) =>
        value &&
        value.length >= CONTENT_MIN_CHAR &&
        value.length <= CONTENT_MAX_CHAR,
      message: () =>
        `The answer's content must have at least ${CONTENT_MIN_CHAR} characters and maximum ${CONTENT_MAX_CHAR}.`,
    },
  },
  plainTextContent: {
    type: String,
  },
  isBestAnswer: {
    type: Boolean,
    required: true,
    default: false,
  },
  suggestions: [
    {
      type: ObjectId,
      ref: "Suggestion",
    },
  ],
  appliedSuggestion: {
    type: ObjectId,
    ref: "Suggestion",
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

AnswerSchema.pre("save", function (next) {
  if (!this.isModified("content")) {
    return next();
  }

  this.plainTextContent = removeMd(this.content);

  next();
});

const AnswerModel = mongoose.model("Answer", AnswerSchema);

module.exports = AnswerModel;
