const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const removeMd = require('remove-markdown');

const TITLE_MIN_CHAR = 10;
const TITLE_MAX_CHAR = 200;

const DESCRIPTION_MIN_CHAR = 100;
const DESCRIPTION_MAX_CHAR = 2000;

const QuestionSchema = new Schema({
    author: {
        type: ObjectId,
        requried: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'A question is required!'],
        validate: {
            validator: value => value && value.length >= TITLE_MIN_CHAR && value.length <= TITLE_MAX_CHAR,
            message: () => `The question must have at least ${TITLE_MIN_CHAR} characters and maximum ${TITLE_MAX_CHAR}.`
        }
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        validate: {
            validator: value => value && value.length >= DESCRIPTION_MIN_CHAR && value.length <= DESCRIPTION_MAX_CHAR,
            message: () => `The description must have at least ${DESCRIPTION_MIN_CHAR} characters and maximum ${DESCRIPTION_MAX_CHAR}.`
        }
    },
    plainTextDescription: {
        type: String,
    },
    isAnswered: {
        type: Boolean,
        required: true,
        default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
});

QuestionSchema.index({
    title: 'text',
    plainTextDescription: 'text',
});

QuestionSchema.pre('save', function (next) {
    if (!this.isModified('description')) {
        return next();
    }

    this.plainTextDescription = removeMd(this.description);

    next();
});

const QuestionModel = mongoose.model("Question", QuestionSchema);

module.exports = QuestionModel;
