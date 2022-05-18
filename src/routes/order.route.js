const express = require('express')
const router = require('express-promise-router')()
const orderController = require('../controllers/order.controller')
const passport = require('passport')
const customPassport = require('../middlewares/customPassport')
const passportConfig = require('../middlewares/passport')


router.post('/', customPassport.passportJWT, orderController.newOrder)


module.exports = router