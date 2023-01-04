const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema({
    uid: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    displayName: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        default: 0,
    },
    badge: {
        type: ObjectId,
        requried: false,
        ref: 'Badge',
        default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
