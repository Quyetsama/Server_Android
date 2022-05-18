const express = require('express')
const router = require('express-promise-router')()
const productController = require('../controllers/product.controller')


router.get('/', productController.index)
router.post('/', productController.upload, productController.newProduct)

router.get('/:_id', productController.getProductById)

module.exports = router