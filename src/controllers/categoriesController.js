import Category from '../models/category.js';

export const getAllCategories = async (req, res) => {
  // get query params
  const page = Number(req.query.page) || 1;
  const perPage = Number(req.query.perPage) || 4;
  const skip = (page - 1) * perPage;

  const [categories, totalCategories] = await Promise.all([
    Category.find().sort({ createdAt: -1 }).skip(skip).limit(perPage),
    Category.countDocuments(),
  ]);

  // calculate total pages
  const totalPages = Math.ceil(totalCategories / perPage);

  res.status(200).json({
    page,
    perPage,
    totalCategories,
    totalPages,
    categories,
  });
};
