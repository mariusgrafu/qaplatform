const db = require("../models/");

const DEFAULT_BADGES = [
  {
    title: "Bronze 1",
    identifier: "bronze_1",
    requiredPoints: 100,
  },
  {
    title: "Bronze 2",
    identifier: "bronze_2",
    requiredPoints: 200,
  },
  {
    title: "Bronze 3",
    identifier: "bronze_3",
    requiredPoints: 300,
  },
  {
    title: "Silver 1",
    identifier: "silver_1",
    requiredPoints: 400,
  },
  {
    title: "Silver 2",
    identifier: "silver_2",
    requiredPoints: 500,
  },
  {
    title: "Silver 3",
    identifier: "silver_3",
    requiredPoints: 600,
  },
  {
    title: "Gold 1",
    identifier: "gold_1",
    requiredPoints: 700,
  },
  {
    title: "Gold 2",
    identifier: "gold_2",
    requiredPoints: 800,
  },
  {
    title: "Gold 3",
    identifier: "gold_3",
    requiredPoints: 900,
  },
  {
    title: "Wise Owl",
    identifier: "wise_owl",
    requiredPoints: 1000,
  },
  {
    title: "Spreading Knowledge",
    identifier: "spreading_knowledge",
    requiredPoints: 1500,
  },
  {
    title: "Expanding Brain",
    identifier: "expanding_brain",
    requiredPoints: 2000,
  },
];

const initBadges = async () => {
  await db.Badge.collection.drop();

  await Promise.all(
    DEFAULT_BADGES.map((badge) => {
      const newBadge = new db.Badge();
      newBadge.title = badge.title;
      newBadge.identifier = badge.identifier;
      newBadge.requiredPoints = badge.requiredPoints;

      return newBadge.save();
    })
  );
};

const badgeController = { initBadges };

module.exports = badgeController;
