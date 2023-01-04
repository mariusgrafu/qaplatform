const firebaseAdmin = require("../firebaseAdmin");
const { RANDOM_USERS } = require("./consts");

const createRandomUsers = async () => {
  await Promise.allSettled(
    RANDOM_USERS.map((user) => firebaseAdmin.auth().createUser(user))
  );
};

createRandomUsers();
