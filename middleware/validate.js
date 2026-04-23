const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const productFieldValidators = [
  body('name')
    .optional()
    .notEmpty().withMessage('Name cannot be empty')
    .isString().withMessage('Name must be text')
    .trim(),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .optional()
    .notEmpty().withMessage('Category cannot be empty')
    .isString().withMessage('Category must be text')
    .trim(),
  body('quantity')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a whole number 0 or more'),
  body('description')
    .optional()
    .isString().withMessage('Description must be text')
    .trim(),
  body('inStock')
    .optional()
    .isBoolean().withMessage('inStock must be true or false')
];

const validateProduct = [
  body('name')
    .exists({ checkFalsy: true }).withMessage('Name is required')
    .isString().withMessage('Name must be text')
    .trim(),
  body('price')
    .exists({ checkFalsy: true }).withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category')
    .exists({ checkFalsy: true }).withMessage('Category is required')
    .isString().withMessage('Category must be text')
    .trim(),
  body('quantity')
    .exists().withMessage('Quantity is required')
    .isInt({ min: 0 }).withMessage('Quantity must be a whole number 0 or more'),
  body('description')
    .optional()
    .isString().withMessage('Description must be text')
    .trim(),
  body('inStock')
    .optional()
    .isBoolean().withMessage('inStock must be true or false'),
  handleValidationErrors
];

const validateBulkProducts = [
  body('products')
    .isArray({ min: 1 }).withMessage('products must be a non-empty array'),
  body('products.*.name')
    .exists({ checkFalsy: true }).withMessage('Each product name is required')
    .isString().withMessage('Each product name must be text')
    .trim(),
  body('products.*.price')
    .exists({ checkFalsy: true }).withMessage('Each product price is required')
    .isFloat({ min: 0 }).withMessage('Each product price must be a positive number'),
  body('products.*.category')
    .exists({ checkFalsy: true }).withMessage('Each product category is required')
    .isString().withMessage('Each product category must be text')
    .trim(),
  body('products.*.quantity')
    .exists().withMessage('Each product quantity is required')
    .isInt({ min: 0 }).withMessage('Each product quantity must be a whole number 0 or more'),
  body('products.*.description')
    .optional()
    .isString().withMessage('Each product description must be text')
    .trim(),
  body('products.*.inStock')
    .optional()
    .isBoolean().withMessage('Each product inStock value must be true or false'),
  handleValidationErrors
];

const validateProductUpdate = [
  body().custom((value) => {
    const allowedFields = ['name', 'price', 'category', 'quantity', 'description', 'inStock'];
    const requestFields = Object.keys(value || {});

    if (requestFields.length === 0) {
      throw new Error('At least one field is required for update');
    }

    const invalidFields = requestFields.filter((field) => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
      throw new Error(`Invalid update fields: ${invalidFields.join(', ')}`);
    }

    return true;
  }),
  ...productFieldValidators,
  handleValidationErrors
];

module.exports = {
  validateProduct,
  validateBulkProducts,
  validateProductUpdate
};
