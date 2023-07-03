const router = require('express').Router();
const user = require('../controllers/userController')
const { uploads } = require('../middleware/imgStorage')

router.post('/adduser', user.addUser)
router.post('/add', uploads ,user.addUser)
router.post('/login', user.loginUser)
router.post('/reset/:id/:token', user.resetPassword)
router.post('/forget/:userId/:token', user.forgetPass)

module.exports = router;
