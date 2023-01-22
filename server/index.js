require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const userController = require("./controllers/userController");
const questionsController = require("./controllers/questionsController");
const answersController = require("./controllers/answersController");
const badgeController = require("./controllers/badgeController");

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1/qaplatformDb", () => {
  badgeController.initBadges();
});

const parseBoolean = (booleanString) =>
  booleanString.toLowerCase().trim() === "true";

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) {
      return res.sendStatus(401);
    }

    const user = await userController.verifyToken(token);

    if (!user) {
      return res.sendStatus(401);
    }

    const userId = await userController.getUserIdFromUid(user.uid);

    req.user = user;
    req.userId = userId;
    next();
  } catch (err) {
    console.warn(err);
    res.sendStatus(401);
  }
};

app.post("/register", async (req, res) => {
  try {
    const email = req.body.email;
    const displayName = req.body.displayName;
    const password = req.body.password;

    await userController.registerUser({
      email,
      displayName,
      password,
    });

    res.send({ success: true });
  } catch (err) {
    console.warn(err);
    return {
      success: false,
      errorMessage: "There was an issue trying to register the account",
    };
  }
});

app.get("/questions", async (req, res) => {
  try {
    const { searchText, unansweredOnly, sortOption, currentPage, pageSize } =
      req.query;

    const { questions, questionsCount } =
      await questionsController.getQuestions({
        searchText,
        unansweredOnly: parseBoolean(unansweredOnly),
        sortOption,
        currentPage: +currentPage,
        pageSize: +pageSize,
      });

    res.send({
      success: true,
      questions,
      questionsCount,
    });
  } catch (err) {
    console.warn(err);
    return { success: false };
  }
});

app.get("/question/:questionId", async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await questionsController.getQuestionById(questionId);

    res.send({ success: true, question });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.post("/question", authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    const { success, questionId, errors } =
      await questionsController.addQuestion(req.userId, {
        title,
        description,
      });

    res.send({ success, questionId, errors });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.put("/question/:questionId", authenticateToken, async (req, res) => {
  try {
    const { questionId } = req.params;
    const { title, description } = req.body;

    const { success, errors } = await questionsController.updateQuestion(
      questionId,
      req.userId,
      {
        title,
        description,
      }
    );

    res.send({ success, errors });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.get("/answers", async (req, res) => {
  try {
    const { questionId, currentPage, pageSize } = req.query;

    const { answers, answersCount } =
      await answersController.getAnswersByQuestionId({
        questionId,
        currentPage: +currentPage,
        pageSize: +pageSize,
      });

    res.send({ success: true, answers, answersCount });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.post("/answer", authenticateToken, async (req, res) => {
  try {
    const { content, questionId } = req.body;

    const { success, answerId, errors } = await answersController.addAnswer(
      req.userId,
      {
        content,
        questionId,
      }
    );

    res.send({ success, answerId, errors });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.put("/answer", authenticateToken, async (req, res) => {
  try {
    const { content, answerId } = req.body;

    const { success, errors } = await answersController.editAnswer(req.userId, {
      content,
      answerId,
    });

    res.send({ success, errors });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.post("/best-answer", authenticateToken, async (req, res) => {
  try {
    const { answerId, questionId } = req.body;

    await answersController.toggleBestAnswer(req.userId, {
      answerId,
      questionId,
    });

    res.send({ success: true });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.post("/suggestion", authenticateToken, async (req, res) => {
  try {
    const { content, answerId } = req.body;

    const { success, errors } = await answersController.addSuggestion(
      req.userId,
      {
        content,
        answerId,
      }
    );

    res.send({ success, errors });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.post("/accept-suggestion", authenticateToken, async (req, res) => {
  try {
    const { suggestionId } = req.body;

    await answersController.acceptSuggestion(req.userId, {
      suggestionId,
    });

    res.send({ success: true });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.get("/badges", async (req, res) => {
  try {
    const badges = await badgeController.getAllBadges();

    res.send({ success: true, badges });
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.get("/user/badge-info", authenticateToken, async (req, res) => {
  try {
    const badgeInfo = await userController.getUserBadgeInfo(req.userId);

    res.send({success: true, ...badgeInfo});
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.post("/user/set-badge", authenticateToken, async (req, res) => {
  try {
    await userController.setUserBadge(req.userId, req.body.badgeId);

    res.send({success: true});
  } catch (err) {
    console.warn(err);
    res.send({ success: false });
  }
});

app.listen(3001, () => {
  console.log("Started listening on 3001");
});
