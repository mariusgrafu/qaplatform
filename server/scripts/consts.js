const RANDOM_USERS_PASSWORD = "pass123";
const RANDOM_USERS_UID_PREFIX = "uuid-random-user-";

const RANDOM_USERS = [
  "Lilian Carter",
  "Jack Barrett",
  "Carla Kelly",
  "Johnni Wells",
  "Heidi Kim",
  "Brett Reynolds",
  "Willie Burns",
  "Colleen Jensen",
  "Edgar Nguyen",
  "Claire Berry",
].map((displayName, index) => ({
  uid: `${RANDOM_USERS_UID_PREFIX}${index + 1}`,
  email: `${displayName.toLowerCase().split(" ").join(".")}@email.com`,
  displayName,
  password: RANDOM_USERS_PASSWORD,
}));

module.exports = {
  RANDOM_USERS_PASSWORD,
  RANDOM_USERS_UID_PREFIX,
  RANDOM_USERS,
};
