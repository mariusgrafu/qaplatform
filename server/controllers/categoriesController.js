const db = require("../models/");

const getCategories = async () => {
    const categories = await db.Category.find({}).exec();

    return categories;
}

const categoriesController = {
    getCategories
};

module.exports = categoriesController;