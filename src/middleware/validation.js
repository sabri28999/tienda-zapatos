const { body, param, validationResult } = require('express-validator');

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

const validateRegister = [
  body('nombre').isLength({ min: 2 }),
  body('email').isEmail(),
  body('contraseña').isLength({ min: 6 }),
  handleErrors
];

const validateLogin = [
  body('email').isEmail(),
  body('contraseña').notEmpty(),
  handleErrors
];

const validateUserUpdate = [
  body('nombre').optional().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('contraseña').optional().isLength({ min: 6 }),
  handleErrors
];

const validateProductCreate = [
  body('nombre').notEmpty(),
  body('precio').isFloat({ gt: 0 }),
  body('talle').notEmpty(),
  body('categoria').notEmpty(),
  handleErrors
];

const validateProductUpdate = [
  body('nombre').optional().notEmpty(),
  body('precio').optional().isFloat({ gt: 0 }),
  body('talle').optional().notEmpty(),
  body('categoria').optional().notEmpty(),
  handleErrors
];

const validateCategory = [
  body('nombre').notEmpty(),
  handleErrors
];

const validateCategoryUpdate = [
  body('nombre').optional().notEmpty(),
  handleErrors
];

const validateCartAdd = [
  body('idProducto').isInt({ gt: 0 }),
  body('cantidad').isInt({ gt: 0 }),
  handleErrors
];

const validateCartUpdate = [
  body('cantidad').isInt({ gt: 0 }),
  handleErrors
];

const validateFavoriteAdd = [
  body('idProducto').isInt({ gt: 0 }),
  handleErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUserUpdate,
  validateProductCreate,
  validateProductUpdate,
  validateCategory,
  validateCategoryUpdate,
  validateCartAdd,
  validateCartUpdate,
  validateFavoriteAdd
};