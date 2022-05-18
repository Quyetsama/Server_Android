const router = require('express-promise-router')()
const userController = require('../controllers/user.controller')
const { validateParam, validateBody, schemas } = require('../utils/routerValidate')
const passport = require('passport')
const passportConfig = require('../middlewares/passport')
const customPassport = require('../middlewares/customPassport')




router.get('/', userController.index)
router.post('/signup', validateBody(schemas.authSignUpSchema), userController.signUp)
router.post('/signin', validateBody(schemas.authSignInSchema), customPassport.passportLocal, userController.signIn)



module.exports = router