const mongoose = require("mongoose");

const { RANDOM_USERS_UID_PREFIX, RANDOM_USERS } = require('./consts');

mongoose.connect("mongodb://127.0.0.1/qaplatformDb");
const db = require('../models/');

const hipsumDescription = `I'm baby dIY umami messenger bag, yr banjo flannel man braid kickstarter tonx same everyday carry waistcoat plaid. Tumeric neutra farm-to-table +1 slow-carb authentic. Swag hell of bruh, small batch you probably haven't heard of them cronut umami banh mi slow-carb lyft organic selfies. Kinfolk chillwave gentrify shaman, tonx kogi live-edge lyft 90's. Praxis master cleanse raw denim asymmetrical.

Meggings waistcoat vinyl mumblecore typewriter. Shaman affogato poutine, letterpress selfies vape irony big mood four dollar toast hella. Etsy man braid trust fund bitters. Messenger bag art party hammock hashtag hexagon pop-up praxis church-key hella. Kogi fingerstache photo booth yes plz lyft. Trust fund pork belly mlkshk ascot dreamcatcher chartreuse prism activated charcoal tonx aesthetic artisan neutra austin adaptogen paleo.`;
const QUESTIONS_PER_USER = 10;
let userIds = [];
let categoryIds = [];

const addUsers = async () => {
    await db.User.collection.drop();

    await Promise.all(RANDOM_USERS.map((user, index) => {
        const newUser = new db.User();

        newUser.uid = user.uid;
        newUser.email = user.email;
        newUser.displayName = user.displayName;

        // offset each user by ~1 month so they don't all appear to have been created at once
        newUser.date = new Date(Date.now() - index * 60000 * 60 *  24 * 30);

        userIds.push(newUser._id);

        return newUser.save();
    }));
}

const getUsers = async () => {
    const users = await db.User.find({}).exec();

    userIds = users.map(user => user._id);
}

const getCategories = async () => {
    const categories = await db.Category.find({}).exec();

    categoryIds = categories.map(user => user._id);
}

const addQuestions = async () => {
    // await Promise.all([addUsers(), db.Question.collection.drop()]);
    await Promise.all([getUsers(), getCategories(), db.Question.collection.drop()]);

    await Promise.all(userIds.map((userId, userIndex) => {

        return Array.from({length: QUESTIONS_PER_USER}).map((_, questionIndex) => {
            const newQuestion = new db.Question();

            newQuestion.author = userId;
            newQuestion.title = `Question Title ${userIndex}-${questionIndex}`;
            newQuestion.description = hipsumDescription;
            newQuestion.date = new Date(Date.now() - (userIndex + 1) * (questionIndex * 1) * 60000 * 60);
            newQuestion.category = categoryIds[Math.floor(Math.random() * categoryIds.length)];

            return newQuestion.save();
        });
    }).flat());
}

const categories = "Math, Computer Science, Phisics, Work, School, Lifestyle, Health, Hobbies, Sport, Technology, Engineering".split(", ");

const addCategories = async () => {
    await Promise.all(categories.map((catName) => {
        const newCategory = new db.Category();
        newCategory.name = catName;

        return newCategory.save();
    }))
}

addQuestions().then(() => {
    process.exit();
});

// addCategories().then(() => {
//     process.exit();
// });
