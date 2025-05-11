const express=require('express')
const router=express.Router()
const userController=require('../../controllers/userControllers/user.controller')
const authMiddleware=require('../../middlewares/authMiddleware')


router.post('/register', userController.registerController);
router.post('/login',userController.loginController)
router.post('/logout',userController.logoutController)
router.get('/current-user',authMiddleware,userController.currentUserController)
router.put('profile',authMiddleware,userController.updateUserProfile);
router.post('/reset-password',userController.resetPasswordController);


module.exports=router;