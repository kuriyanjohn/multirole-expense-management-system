const Category = require('../../models/category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    
    const existing = await Category.findOne({ name });
    if (existing) return res.status(400).json({ message: 'Category already exists' });
    
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: 'Error creating category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
