const express = require("express");
const router = express.Router();

const adminMiddleware = require('../../middlewares/adminMiddleware.js')
const { getAllUsersController,deleteUserController,getAllBookingsController, getAllPropertyController,deleteSinglePropertyController, deleteBookingController} = require("../../controllers/adminControllers/admin.controller.js");

router.get("/all-users", adminMiddleware, getAllUsersController);
router.delete("/delete-user/:id", adminMiddleware, deleteUserController);
router.get("/all-booking", adminMiddleware, getAllBookingsController);
router.delete("/delete-booking/:id", adminMiddleware, deleteBookingController);
router.get("/all-properties", adminMiddleware, getAllPropertyController);
router.delete(
  "/delete-property/:id",adminMiddleware,deleteSinglePropertyController);

module.exports = router;
