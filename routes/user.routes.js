const Routr = require('express');
const router = new Routr();
const userController = require('../controllers/user.controllers');

router.post('/register', userController.userCreate);
router.post('/login', userController.userLogin);

router.get('/user/:id_user', userController.getAboutUser);

router.put('/profile', userController.changeAboutUser);

router.delete('/user', userController.deleteUser);

module.exports = router;