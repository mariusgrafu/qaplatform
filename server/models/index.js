const User = require("./User");
const Question = require("./Question");
const Answer = require("./Answer");
const Suggestion = require("./Suggestion");
const Badge = require("./Badge");

const mapErrors = (errors) => {
  const errMap = {};
  Object.values(errors).forEach((err) => {
    errMap[err.path] = err.message;
  });

  return errMap;
};

module.exports = {
  User,
  Question,
  Answer,
  Suggestion,
  Badge,

  mapErrors,
};
