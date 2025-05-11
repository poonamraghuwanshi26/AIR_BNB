const express=require('express')
const propertyController=require('../../controllers/propertyControllers/property.Controller')
const authMiddleware=require('../../middlewares/authMiddleware')
const router=express.Router();

router.post('/create',authMiddleware,propertyController.propertyCreateController);     

router.delete('/delete/:id',authMiddleware,propertyController.deletePropertyController);

router.put('/update/:id',authMiddleware,propertyController.updatePropertyController);

router.get('/view/:id',authMiddleware,propertyController.viewPropertyController);

router.get("/search",authMiddleware, propertyController.searchPropertyController);

router.get('/my-property',authMiddleware,propertyController.viewMyPropertyController);

module.exports=router;