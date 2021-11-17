const Routr = require('express');
const router = new Routr();
const userController = require('../controllers/user.controllers');
const authMiddleware = require('../middlewaree/authMiddleware')

router.post('/register', userController.userCreate);
router.post('/login', userController.userLogin);

router.get('/user/:id_user', authMiddleware, userController.getAboutUser);

router.put('/profile', userController.changeAboutUser);
router.put('/logout', userController.userLogout);

module.exports = router;