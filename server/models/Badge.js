const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BadgeSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    identifier: {
        type: String,
        required: true,
    },
    requiredPoints: {
        type: Number,
        required: true,
    },
});

const BadgeModel = mongoose.model("Badge", BadgeSchema);

module.exports = BadgeModel;
