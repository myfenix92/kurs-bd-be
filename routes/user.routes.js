const Routr = require('express');
const router = new Routr();
const userController = require('../controllers/user.controllers');

router.post('/register', userController.userCreate);
router.post('/login', userController.userLogin);
//router.post('/profile', userController.aboutUser);

router.put('/user', userController.userChangePassword);

router.delete('/user', userController.deleteUser);
// router.put('/user', userController.userChangeName);

module.exports = router;