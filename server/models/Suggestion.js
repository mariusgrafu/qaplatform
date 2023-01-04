const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const removeMd = require("remove-markdown");

const CONTENT_MIN_CHAR = 10;
const CONTENT_MAX_CHAR = 2000;

const SuggestionSchema = new Schema({
  author: {
    type: ObjectId,
    requried: true,
    ref: "User",
  },
  answer: {
    type: ObjectId,
    requried: true,
    ref: "Answer",
  },
  content: {
    type: String,
    required: [true, "Suggestion's content is required!"],
    validate: {
      validator: (value) =>
        value &&
        value.length >= CONTENT_MIN_CHAR &&
        value.length <= CONTENT_MAX_CHAR,
      message: () =>
        `The suggestion's content must have at least ${CONTENT_MIN_CHAR} characters and maximum ${CONTENT_MAX_CHAR}.`,
    },
  },
  plainTextContent: {
    type: String,
  },
  isAccepted: {
    type: Boolean,
    required: true,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

SuggestionSchema.pre("save", function (next) {
  if (!this.isModified("content")) {
    return next();
  }

  this.plainTextContent = removeMd(this.content);

  next();
});

const SuggestionModel = mongoose.model("Suggestion", SuggestionSchema);

module.exports = SuggestionModel;
