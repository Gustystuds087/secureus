const express = require('express');
const multer = require('multer');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateWarranty } = require('../middleware');
const warrantys = require('../controllers/warrantys');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(isLoggedIn, catchAsync(warrantys.index))
  .post(
    isLoggedIn,
    upload.array('image'),
    validateWarranty,
    catchAsync(warrantys.addCard)
  );
router
  .route('/:id')
  .get(isLoggedIn, catchAsync(warrantys.showCard))
  .put(
    isLoggedIn,
    upload.array('image'),
    validateWarranty,
    catchAsync(warrantys.updateCard)
  )
  .delete(isLoggedIn, catchAsync(warrantys.deleteCard));

router.get('/:id/edit', isLoggedIn, catchAsync(warrantys.openUpdateFile));

module.exports = router;
