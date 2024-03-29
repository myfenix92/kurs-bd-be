const Routr = require('express');
const router = new Routr();
const userController = require('../controllers/user.controllers');
const authMiddleware = require('../middlewaree/authMiddleware')
const roleMiddleware = require('../middlewaree/roleMiddleware')

router.post('/register', userController.userCreate);
router.post('/login', userController.userLogin);
router.post('/dialog', userController.insertMsg);

router.get('/user/:id_user', roleMiddleware([1, 2]), userController.getAboutUser);

router.get('/users', roleMiddleware([1]), userController.getUsers);
router.get('/count_users', roleMiddleware([1]), userController.getCountUsers);
router.get('/user_msg_from_user', roleMiddleware([1, 2]), userController.getCountMessagesFromUser); //0 from admin, 1 from user
router.get('/users/dialog/:id_user', roleMiddleware([1, 2]), userController.getDialog); //0 from admin, 1 from user

router.delete('/users/:id_user', roleMiddleware([1]), userController.deleteUser);

router.put('/checkban', userController.checkBanTime);
router.put('/ban/:id_user', userController.bannedUser);
router.put('/users/dialog/:id_user', userController.readMsg);
router.put('/profile', userController.changeAboutUser);
router.put('/logout', userController.userLogout);

module.exports = router;