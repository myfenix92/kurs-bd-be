const Routr = require('express');
const router = new Routr();
const userController = require('../controllers/user.controllers');
const authMiddleware = require('../middlewaree/authMiddleware')
const roleMiddleware = require('../middlewaree/roleMiddleware')

router.post('/register', userController.userCreate);
router.post('/login', userController.userLogin);

router.get('/user/:id_user', authMiddleware, userController.getAboutUser);

router.get('/users', roleMiddleware([1]), userController.getUsers);
router.get('/count_users', roleMiddleware([1]), userController.getCountUsers);
router.get('/user_msg_from_admin', roleMiddleware([1, 2]), userController.getMessagesFromAdmin); //0 from admin, 1 from user
router.get('/user_msg_from_user', roleMiddleware([1, 2]), userController.getMessagesFromUser); //0 from admin, 1 from user

router.put('/profile', userController.changeAboutUser);
router.put('/logout', userController.userLogout);

module.exports = router;