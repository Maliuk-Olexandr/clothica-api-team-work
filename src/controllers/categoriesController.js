import Category from '../models/category.js';

export const getAllCategories = async (req, res) => {
  // get query params
  const { page = 1, perPage = 4 } = req.query;
  const skip = (page - 1) * perPage;

  // create base query, to which will add filters
  const categoriesQuery = Category.find();

  // make both queries in parallel
  const [totalCategories, categories] = await Promise.all([
    categoriesQuery.clone().countDocuments(),
    categoriesQuery.skip(skip).limit(perPage),
  ]);

  // calculate total pages
  const totalPages = Math.ceil(totalCategories / perPage);

  res.status(200).json({
    page: Number(page),
    perPage: Number(perPage),
    totalCategories,
    totalPages,
    categories,
  });
};
